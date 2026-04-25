import asyncio
import contextlib
import logging
import json
import os
from sqlalchemy import select, or_
from .. import database, models
from ..utils.storage import get_storage_path

logger = logging.getLogger(__name__)


async def check_for_work():
    """
    Check the ImagePalette table for work to do.
    Work is defined as:
    - filename is empty
    OR
    - image_settings_hash differs from the value in the images table.
    """
    try:
        async with database.get_session() as session:
            # Join ImagePalette with Image to compare hashes
            stmt = (
                select(models.ImagePalette, models.Image)
                .join(
                    models.Image,
                    models.ImagePalette.image_id == models.Image.id,
                )
                .where(
                    or_(
                        models.ImagePalette.filename == "",
                        models.ImagePalette.image_settings_hash
                        != models.Image.settings_hash,
                    )
                )
            )
            result = await session.execute(stmt)
            work_items = result.all()

            if not work_items:
                return 0

            for palette_entry, image_entry in work_items:
                logger.debug(
                    f"Found work for image {palette_entry.image_id} with "
                    f"palette {palette_entry.palette}"
                )

                # Perform conversion
                success = await run_conversion(palette_entry, image_entry, session)
                if success:
                    logger.info(
                        f"Completed work for image {palette_entry.image_id} with "
                        f"palette {palette_entry.palette}"
                    )

            return len(work_items)
    except Exception as e:
        logger.error(f"Error during image palette work check: {str(e)}")
        return 0


async def run_conversion(palette_entry, image_entry, session):
    """Run the conversion utility for a specific image/palette combination."""
    try:
        # 1. Setup paths
        src_path = os.path.join(get_storage_path("image"), image_entry.file_path)
        palette = palette_entry.palette
        settings_hash = image_entry.settings_hash

        # Unique filename: <image_id>_<palette>_<settings_hash>.png
        safe_palette = palette.replace("/", "_")
        dest_filename = f"{image_entry.id}_{safe_palette}_{settings_hash}.png"
        dest_path = os.path.join(get_storage_path("conversion"), dest_filename)

        # 2. Construct JSON config
        config = {
            "src": src_path,
            "dest": dest_path,
            "palette": palette,
            "brightness": image_entry.brightness,
            "contrast": image_entry.contrast,
            "saturation": image_entry.saturation,
            "conversion": image_entry.conversion,
        }
        config_json = json.dumps(config)

        # 3. Call converter utility
        # converter/index.js is sibling to backend/
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        converter_path = os.path.join(base_dir, "converter", "index.js")

        process = await asyncio.create_subprocess_exec(
            "node",
            converter_path,
            config_json,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            logger.error(
                f"Converter failed for {image_entry.id}/{palette}: "
                f"{stderr.decode()}"
            )
            return False

        # 4. Update database
        # Note: palette_entry is an instance from the session
        palette_entry.filename = dest_filename
        palette_entry.image_settings_hash = settings_hash
        await session.commit()
        return True

    except Exception as e:
        logger.error(f"Failed to run conversion for {image_entry.id}: {str(e)}")
        return False


async def schedule_image_processing(app):
    """Start the periodic image palette processing task."""

    async def processing_loop():
        try:
            while True:
                # logger.debug("Checking for image palette work")
                await check_for_work()
                # Run periodically
                await asyncio.sleep(60)
        except asyncio.CancelledError:
            logger.info("Image processing task cancelled")
        except Exception as e:
            logger.error(f"Image processing task crashed: {str(e)}")

    app["image_processing_task"] = asyncio.create_task(processing_loop())


async def stop_image_processing(app):
    """Stop the background image processing task."""
    task = app.get("image_processing_task")
    if task:
        task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await task
