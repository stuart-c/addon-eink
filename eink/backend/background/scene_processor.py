from .events import trigger_scene_processing, queue_update_event
import asyncio
import contextlib
import logging
import hashlib
import json
import os
from sqlalchemy import select, delete
from .. import database, models
from ..utils.storage import get_storage_path

logger = logging.getLogger(__name__)


def get_palette_for_display(display_type):
    """Map display colour type to a converter palette name."""
    ct = display_type.colour_type
    if ct == "BWGBRY":
        return "spectra6"
    elif ct == "BWR":
        return "acep"  # acep is used as fallback for BWR in frontend
    return "default"


async def check_for_scene_work():
    """
    Check for queued scenes that need their display images generated or updated.
    """
    try:
        async with database.get_session() as session:
            # 1. Get all scene_ids that have pending work
            stmt = select(models.SceneQueue.scene_id).distinct()
            result = await session.execute(stmt)
            scene_ids = result.scalars().all()

            if not scene_ids:
                return

            # 2. Get those scenes
            stmt = select(models.Scene).where(models.Scene.id.in_(scene_ids))
            result = await session.execute(stmt)
            scenes = result.scalars().all()

            for scene in scenes:
                # Fetch specific queued combos for this scene
                q_stmt = select(models.SceneQueue).where(
                    models.SceneQueue.scene_id == scene.id
                )
                q_result = await session.execute(q_stmt)
                queued_items = q_result.scalars().all()
                queued_combos = {(q.display_id, q.image_id) for q in queued_items}

                if queued_combos:
                    await process_scene(scene, queued_combos, session)

    except Exception as e:
        logger.error(f"Error during scene work check: {str(e)}")
        return 0


async def process_scene(scene, queued_combos, session):
    """Process a single scene: check all items/displays/images against the queue."""
    try:
        # Load layout
        stmt = select(models.Layout).where(models.Layout.id == scene.layout_id)
        result = await session.execute(stmt)
        layout = result.scalar_one_or_none()
        if not layout:
            logger.warning(f"Layout {scene.layout_id} not found for scene {scene.id}")
            return

        # Load all display types needed for this layout
        display_type_ids = {item["display_type_id"] for item in layout.items}
        stmt = select(models.DisplayType).where(
            models.DisplayType.id.in_(display_type_ids)
        )
        result = await session.execute(stmt)
        display_types = {dt.id: dt for dt in result.scalars().all()}

        # Map layout items for easy access
        layout_items = {item["id"]: item for item in layout.items}

        if not scene.items:
            return

        for item in scene.items:
            if item.get("type") != "image" and item.get("type") != "tile":
                continue

            displays_in_item = item.get("displays", [])
            images_in_item = item.get("images", [])

            if not displays_in_item or not images_in_item:
                continue

            # Calculate Item Panel Bounding Box
            # Following frontend logic in scene-item-settings-dialog.ts
            item_panels = []
            for d_id in displays_in_item:
                l_item = layout_items.get(d_id)
                if not l_item:
                    continue
                dt = display_types.get(l_item["display_type_id"])
                if not dt:
                    continue

                is_portrait = l_item.get("orientation") == "portrait"
                frame_w = dt.height_mm if is_portrait else dt.width_mm
                frame_h = dt.width_mm if is_portrait else dt.height_mm
                panel_w = dt.panel_height_mm if is_portrait else dt.panel_width_mm
                panel_h = dt.panel_width_mm if is_portrait else dt.panel_height_mm

                panel_x = l_item["x_mm"] + (frame_w - panel_w) / 2
                panel_y = l_item["y_mm"] + (frame_h - panel_h) / 2

                item_panels.append(
                    {
                        "id": d_id,
                        "x": panel_x,
                        "y": panel_y,
                        "w": panel_w,
                        "h": panel_h,
                        "dt": dt,
                        "orientation": l_item.get("orientation", "landscape"),
                    }
                )

            if not item_panels:
                continue

            min_x = min(p["x"] for p in item_panels)
            min_y = min(p["y"] for p in item_panels)

            # Get pxPerMm from the FIRST display in the item
            # (consistent with frontend)
            first_panel = item_panels[0]
            first_dt = first_panel["dt"]
            px_per_mm = first_dt.width_px / first_dt.panel_width_mm

            for image_meta in images_in_item:
                image_id = image_meta["image_id"]

                # Get Image record
                stmt = select(models.Image).where(models.Image.id == image_id)
                result = await session.execute(stmt)
                image_record = result.scalar_one_or_none()
                if not image_record:
                    logger.warning(f"Image {image_id} not found for scene {scene.id}")
                    continue

                for panel in item_panels:
                    if (panel["id"], image_id) not in queued_combos:
                        continue

                    await process_slice(
                        scene,
                        panel,
                        image_meta,
                        image_record,
                        min_x,
                        min_y,
                        px_per_mm,
                        session,
                    )

    except Exception as e:
        logger.error(f"Error processing scene {scene.id}: {str(e)}")


async def process_slice(
    scene,
    panel,
    image_meta,
    image_record,
    item_min_x,
    item_min_y,
    px_per_mm,
    session,
):
    """Check and process a single slice for a combination."""
    try:
        scene_id = scene.id
        display_id = panel["id"]
        image_id = image_record.id

        # Fetch existing record if it exists (for updating)
        stmt = select(models.SceneDisplayImage).where(
            models.SceneDisplayImage.scene_id == scene_id,
            models.SceneDisplayImage.display_id == display_id,
            models.SceneDisplayImage.image_id == image_id,
        )
        result = await session.execute(stmt)
        record = result.scalar_one_or_none()

        # Need to run conversion
        logger.info(
            f"Generating slice for Scene {scene_id}, "
            f"Display {display_id}, Image {image_id}"
        )

        # Calculate offsets
        rel_x_mm = panel["x"] - item_min_x
        rel_y_mm = panel["y"] - item_min_y

        # In pixels
        draw_x = (image_meta.get("offset", {}).get("x", 0)) - (rel_x_mm * px_per_mm)
        draw_y = (image_meta.get("offset", {}).get("y", 0)) - (rel_y_mm * px_per_mm)
        draw_w = (image_record.width * image_meta.get("scaling_factor", 100)) / 100
        draw_h = (image_record.height * image_meta.get("scaling_factor", 100)) / 100

        # Output pixels
        is_portrait = panel.get("orientation") == "portrait"
        out_w = panel["dt"].height_px if is_portrait else panel["dt"].width_px
        out_h = panel["dt"].width_px if is_portrait else panel["dt"].height_px

        # Paths
        src_path = os.path.join(get_storage_path("image"), image_record.file_path)
        dest_filename = f"slice_{scene_id}_{image_id}_{display_id}.png"
        dest_path = os.path.join(get_storage_path("scene_display"), dest_filename)

        # Palette
        palette = get_palette_for_display(panel["dt"])

        # Config for converter
        config = {
            "src": src_path,
            "dest": dest_path,
            "palette": palette,
            "width": out_w,
            "height": out_h,
            "background_color": image_meta.get("background_color", "#ffffff"),
            "draw_x": draw_x,
            "draw_y": draw_y,
            "draw_w": draw_w,
            "draw_h": draw_h,
            "brightness": image_record.brightness,
            "contrast": image_record.contrast,
            "saturation": image_record.saturation,
            "conversion": image_record.conversion,
        }

        # Call node converter
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        converter_path = os.path.join(base_dir, "converter", "index.js")

        process = await asyncio.create_subprocess_exec(
            "node",
            converter_path,
            json.dumps(config),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            logger.error(f"Converter failed for slice: {stderr.decode()}")
            return

        # Update DB
        if not record:
            record = models.SceneDisplayImage(
                scene_id=scene_id, display_id=display_id, image_id=image_id
            )
            session.add(record)

        # Calculate hash of the generated file
        with open(dest_path, "rb") as f:
            file_hash = hashlib.sha256(f.read()).hexdigest()

        record.scene_hash = scene.scene_hash
        record.image_hash = image_record.settings_hash
        record.file_hash = file_hash
        record.filename = dest_filename

        # Remove the successfully processed item from the queue
        del_stmt = delete(models.SceneQueue).where(
            models.SceneQueue.scene_id == scene_id,
            models.SceneQueue.display_id == display_id,
            models.SceneQueue.image_id == image_id,
        )
        await session.execute(del_stmt)

        await session.commit()
        logger.debug(f"Successfully updated slice {dest_filename}")

    except Exception as e:
        logger.exception(
            f"Failed to process slice for "
            f"{scene.id}/{panel['id']}/{image_record.id}: {str(e)}"
        )


async def schedule_scene_processing(app):
    """Start the periodic scene processing task."""

    async def processing_loop():
        try:
            while True:
                queue_update_event.clear()
                await check_for_scene_work()

                with contextlib.suppress(asyncio.TimeoutError):
                    await asyncio.wait_for(queue_update_event.wait(), timeout=60)
        except asyncio.CancelledError:
            logger.info("Scene processing task cancelled")
        except Exception as e:
            logger.error(f"Scene processing task crashed: {str(e)}")

    app["scene_processing_task"] = asyncio.create_task(processing_loop())


async def stop_scene_processing(app):
    """Stop the background scene processing task."""
    task = app.get("scene_processing_task")
    if task:
        task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await task


async def update_scene_queue(scene, session):
    """
    Identify what needs creating/updating for this scene and populate the
    scene_queue table.
    """
    # 1. Clear existing queue for this scene
    stmt = delete(models.SceneQueue).where(models.SceneQueue.scene_id == scene.id)
    await session.execute(stmt)

    if scene.status != "active":
        return

    # 2. Identify all display/image combinations in the scene
    if not scene.items:
        return

    image_ids = set()
    for item in scene.items:
        for img in item.get("images", []):
            if img.get("image_id"):
                image_ids.add(img["image_id"])

    if not image_ids:
        return

    # 3. Fetch current Image records to get their settings_hash
    stmt = select(models.Image).where(models.Image.id.in_(image_ids))
    result = await session.execute(stmt)
    images = {img.id: img for img in result.scalars().all()}

    # 4. Fetch existing SceneDisplayImage records to check hashes
    stmt = select(models.SceneDisplayImage).where(
        models.SceneDisplayImage.scene_id == scene.id
    )
    result = await session.execute(stmt)
    records = {(r.display_id, r.image_id): r for r in result.scalars().all()}

    # 5. Identify work needed
    to_queue = set()
    for item in scene.items:
        if item.get("type") not in ("image", "tile"):
            continue

        display_ids = item.get("displays", [])
        item_images = item.get("images", [])

        for img_meta in item_images:
            image_id = img_meta.get("image_id")
            if not image_id or image_id not in images:
                continue

            image_record = images[image_id]

            for display_id in display_ids:
                record = records.get((display_id, image_id))

                needs_work = False
                if (
                    not record
                    or not record.file_hash
                    or record.scene_hash != scene.scene_hash
                    or record.image_hash != image_record.settings_hash
                ):
                    needs_work = True

                if needs_work:
                    to_queue.add((display_id, image_id))

    # 6. Populate the queue
    for display_id, image_id in to_queue:
        session.add(
            models.SceneQueue(
                scene_id=scene.id, display_id=display_id, image_id=image_id
            )
        )

    if to_queue:
        trigger_scene_processing()


async def update_all_scene_queues():
    """Update the scene queue for all active scenes."""
    try:
        async with database.get_session() as session:
            stmt = select(models.Scene).where(models.Scene.status == "active")
            result = await session.execute(stmt)
            scenes = result.scalars().all()

            for scene in scenes:
                await update_scene_queue(scene, session)

            await session.commit()

    except Exception as e:
        logger.error(f"Error updating scene queues: {str(e)}")


async def schedule_scene_queue_update(app):
    """Start the periodic scene queue update task."""

    async def queue_loop():
        try:
            while True:
                await update_all_scene_queues()
                await asyncio.sleep(600)  # 10 minutes
        except asyncio.CancelledError:
            logger.info("Scene queue update task cancelled")
        except Exception as e:
            logger.error(f"Scene queue update task crashed: {str(e)}")

    app["scene_queue_task"] = asyncio.create_task(queue_loop())


async def stop_scene_queue_update(app):
    """Stop the background scene queue update task."""
    task = app.get("scene_queue_task")
    if task:
        task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await task
