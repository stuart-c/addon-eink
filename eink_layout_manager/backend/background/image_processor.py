import asyncio
import contextlib
import logging
from sqlalchemy import select, or_
from .. import database, models

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

            for palette_entry, _image_entry in work_items:
                logger.info(
                    f"Found work for image {palette_entry.image_id} with "
                    f"palette {palette_entry.palette}"
                )

            return len(work_items)
    except Exception as e:
        logger.error(f"Error during image palette work check: {str(e)}")
        return 0


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
