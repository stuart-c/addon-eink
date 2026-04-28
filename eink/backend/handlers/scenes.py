import os
from aiohttp import web
from jsonschema import ValidationError
from .base import BaseCRUDHandler
from .. import models, database
from ..utils.converters import scene_model_to_dict
from ..utils.storage import get_storage_path
from ..utils.validation import response_schema, validate_id  # noqa: F401


class SceneHandler(BaseCRUDHandler):
    model_class = models.Scene
    schema_name = "scene"

    def model_to_dict(self, item):
        """Use specialized converter for Scene to handle layout_id mapping."""
        return scene_model_to_dict(item)

    async def pre_create(self, data):
        """Set default status and map layout to layout_id."""
        if "layout" in data:
            data["layout_id"] = data.pop("layout")

        # Validation
        if "items" in data and "layout_id" in data:
            await self._validate_scene_items(data["items"], data["layout_id"])

        # Calculate status
        layout_id = data.get("layout_id")
        items = data.get("items", [])
        data["status"] = await self._calculate_scene_status(items, layout_id)

        return data

    async def pre_update(self, data, existing_item):
        """Map layout to layout_id for updates if present."""
        if "layout" in data:
            data["layout_id"] = data.pop("layout")

        # Determine layout_id for validation and status calculation
        layout_id = data.get("layout_id") or existing_item.layout_id

        # Validation
        if "items" in data:
            await self._validate_scene_items(data["items"], layout_id)

        # Calculate status
        # Note: data might only contain partial updates,
        # so we fall back to existing_item
        items = data.get("items") if "items" in data else existing_item.items
        data["status"] = await self._calculate_scene_status(items, layout_id)

        return data

    async def post_create(self, item, session):
        """Update image palettes and queue processing after creation."""
        await self._update_image_palettes(item, session)
        await self._update_scene_queue(item, session)

    async def post_update(self, item, session):
        """Update image palettes and queue processing after update."""
        await self._update_image_palettes(item, session)
        await self._update_scene_queue(item, session)

    async def _calculate_scene_status(self, items, layout_id):
        """
        Calculate if the scene is 'active' or 'draft'.
        'active' if:
        - items include every display in the layout.
        - each item has at least one image.
        """
        if not items or not layout_id:
            return "draft"

        from sqlalchemy import select

        async with database.get_session() as session:
            stmt = select(models.Layout).where(models.Layout.id == layout_id)
            result = await session.execute(stmt)
            layout = result.scalars().first()
            if not layout:
                return "draft"

            # 1. Check if all items have at least one image
            for item in items:
                if not item.get("images") or len(item["images"]) == 0:
                    return "draft"

            # 2. Check if all displays in layout are covered
            layout_display_ids = set()
            for layout_item in layout.items:
                if isinstance(layout_item, dict) and "id" in layout_item:
                    layout_display_ids.add(layout_item["id"])

            scene_display_ids = set()
            for item in items:
                displays = item.get("displays", [])
                scene_display_ids.update(displays)

            if layout_display_ids == scene_display_ids and len(layout_display_ids) > 0:
                return "active"

            return "draft"

    async def _validate_scene_items(self, items, layout_id):
        """
        Validate that all displays in scene items exist in the layout
        and are only mentioned once.
        """
        if not items:
            return

        from sqlalchemy import select

        async with database.get_session() as session:
            stmt = select(models.Layout).where(models.Layout.id == layout_id)
            result = await session.execute(stmt)
            layout = result.scalars().first()
            if not layout:
                # Should not happen if schema validation and referential
                # integrity are working, but good for safety.
                raise ValidationError(f"Layout {layout_id} not found")

            # Extract valid IDs from layout items
            valid_display_ids = set()
            for layout_item in layout.items:
                if isinstance(layout_item, dict) and "id" in layout_item:
                    valid_display_ids.add(layout_item["id"])

            seen_display_ids = set()

            for item in items:
                displays = item.get("displays", [])
                for display_id in displays:
                    if display_id not in valid_display_ids:
                        raise ValidationError(
                            f"Display '{display_id}' not in " f"layout '{layout_id}'"
                        )
                    if display_id in seen_display_ids:
                        raise ValidationError(
                            f"Display '{display_id}' mentioned more than once "
                            "in scene"
                        )
                    seen_display_ids.add(display_id)

    async def _update_image_palettes(self, scene, session):
        """
        Record all image/palette combinations used in the scene.
        """
        if not scene.items or not scene.layout_id:
            return

        from sqlalchemy import select

        # 1. Fetch the layout to get display mappings
        stmt = select(models.Layout).where(models.Layout.id == scene.layout_id)
        result = await session.execute(stmt)
        layout = result.scalars().first()
        if not layout:
            return

        # 2. Map display_id to display_type_id
        display_to_type = {}
        for layout_item in layout.items:
            if isinstance(layout_item, dict) and "id" in layout_item:
                display_to_type[layout_item["id"]] = layout_item.get("display_type_id")

        # 3. Fetch all needed display types to get palettes
        type_ids = {tid for tid in display_to_type.values() if tid}
        if not type_ids:
            return

        stmt = select(models.DisplayType).where(models.DisplayType.id.in_(type_ids))
        result = await session.execute(stmt)
        display_types = {dt.id: dt.colour_type for dt in result.scalars().all()}

        # 4. Process scene items to find all image/palette pairs
        for item in scene.items:
            image_ids = [
                img.get("image_id")
                for img in item.get("images", [])
                if img.get("image_id")
            ]
            display_ids = item.get("displays", [])

            # Resolve unique palettes for this item
            palettes = set()
            for d_id in display_ids:
                type_id = display_to_type.get(d_id)
                if type_id and type_id in display_types:
                    palettes.add(display_types[type_id])

            for image_id in image_ids:
                for palette in palettes:
                    # Check if entry already exists
                    stmt = select(models.ImagePalette).where(
                        models.ImagePalette.image_id == image_id,
                        models.ImagePalette.palette == palette,
                    )
                    result = await session.execute(stmt)
                    if not result.scalars().first():
                        session.add(
                            models.ImagePalette(
                                image_id=image_id,
                                palette=palette,
                                filename="",
                            )
                        )

    async def _update_scene_queue(self, scene, session):
        """
        Identify what needs creating/updating for this scene and populate the
        scene_queue table.
        """
        from sqlalchemy import select, delete

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
                    if not record or not record.file_hash:
                        needs_work = True
                    elif record.scene_hash != scene.scene_hash:
                        needs_work = True
                    elif record.image_hash != image_record.settings_hash:
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
            from ..background.scene_processor import trigger_scene_processing

            trigger_scene_processing()

    async def slice_get(self, request):
        """Custom endpoint for scene slice retrieval."""
        scene_id = request.match_info["scene_id"]
        display_id = request.match_info["display_id"]
        image_id = request.match_info["image_id"]

        try:
            scene_id = validate_id(scene_id)
            display_id = validate_id(display_id)
            image_id = validate_id(image_id)
        except ValueError as e:
            return web.json_response({"error": str(e)}, status=400)

        from sqlalchemy import select

        async with database.get_session() as session:
            stmt = select(models.SceneDisplayImage).where(
                models.SceneDisplayImage.scene_id == scene_id,
                models.SceneDisplayImage.display_id == display_id,
                models.SceneDisplayImage.image_id == image_id,
            )
            result = await session.execute(stmt)
            record = result.scalar_one_or_none()

            if not record or not record.filename:
                return web.json_response({"error": "Not Found"}, status=404)

            slice_storage_path = get_storage_path("scene_display")
            file_path = os.path.join(slice_storage_path, record.filename)

            if not os.path.exists(file_path):
                return web.json_response({"error": "Not Found"}, status=404)

            return web.FileResponse(file_path)


# Instantiate handler
scene_handler = SceneHandler()


# Map routes to handler methods
@response_schema("item_list_response")
async def handle_scene_list(request):
    return await scene_handler.list(request)


@response_schema("scene")
async def handle_scene_get(request):
    return await scene_handler.get(request)


@response_schema("scene")
async def handle_scene_create(request):
    return await scene_handler.create(request)


@response_schema("scene")
async def handle_scene_update(request):
    return await scene_handler.update(request)


@response_schema("status_response")
async def handle_scene_delete(request):
    return await scene_handler.delete(request)


@response_schema("scene_slice_list")
async def handle_scene_slice_list(request):
    """Return a list of display slices created for a specified scene ID."""
    scene_id = request.match_info["id"]
    try:
        scene_id = validate_id(scene_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    from sqlalchemy import select

    async with database.get_session() as session:
        # 1. Verify scene exists
        stmt = select(models.Scene).where(models.Scene.id == scene_id)
        result = await session.execute(stmt)
        if not result.scalars().first():
            return web.json_response({"error": "Scene Not Found"}, status=404)

        # 2. Fetch all slices associated with this scene
        stmt = select(models.SceneDisplayImage).where(
            models.SceneDisplayImage.scene_id == scene_id
        )
        result = await session.execute(stmt)
        slices = result.scalars().all()

        return web.json_response(
            [
                {
                    "display_id": s.display_id,
                    "image_id": s.image_id,
                    "file_hash": s.file_hash,
                }
                for s in slices
            ]
        )


async def handle_scene_slice_get(request):
    """Handle retrieval of a scene slice binary."""
    return await scene_handler.slice_get(request)


@response_schema("scene_queue_count")
async def handle_scene_queue_count(request):
    """Return the number of items in the queue for a specified scene ID."""
    scene_id = request.match_info["id"]
    try:
        scene_id = validate_id(scene_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    from sqlalchemy import select, func

    async with database.get_session() as session:
        # 1. Verify scene exists
        stmt = select(models.Scene).where(models.Scene.id == scene_id)
        result = await session.execute(stmt)
        if not result.scalars().first():
            return web.json_response({"error": "Scene Not Found"}, status=404)

        # 2. Count queue items
        stmt = (
            select(func.count())
            .select_from(models.SceneQueue)
            .where(models.SceneQueue.scene_id == scene_id)
        )
        result = await session.execute(stmt)
        count = result.scalar()

        return web.json_response({"count": count})
