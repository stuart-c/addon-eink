import asyncio
import logging
from datetime import datetime, timedelta
from sqlalchemy import select
from .. import database, models
from ..utils.images import delete_image_files_and_record

logger = logging.getLogger(__name__)


async def cleanup_expired_images():
    """Find and delete images with UPLOADED status older than 12 hours."""
    # SQLite func.now() returns UTC.
    expiry_threshold = datetime.utcnow() - timedelta(hours=12)

    try:
        async with database.get_session() as session:
            stmt = select(models.Image).where(
                models.Image.status == "UPLOADED",
                models.Image.created_at < expiry_threshold,
            )
            result = await session.execute(stmt)
            expired_images = result.scalars().all()

            if not expired_images:
                return 0

            count = 0
            for image in expired_images:
                try:
                    await delete_image_files_and_record(image, session)
                    count += 1
                except Exception as e:
                    logger.error(
                        f"Failed to clean up image {image.id}: {str(e)}"
                    )

            return count
    except Exception as e:
        logger.error(f"Error during image cleanup process: {str(e)}")
        return 0


async def schedule_image_cleanup(app):
    """Start the hourly periodic cleanup task."""

    async def cleanup_loop():
        try:
            while True:
                # Run cleanup
                logger.info("Starting hourly image cleanup")
                deleted_count = await cleanup_expired_images()
                if deleted_count > 0:
                    logger.info(f"Cleaned up {deleted_count} expired images")

                # Wait for 1 hour
                await asyncio.sleep(3600)
        except asyncio.CancelledError:
            logger.info("Image cleanup task cancelled")
        except Exception as e:
            logger.error(f"Image cleanup task crashed: {str(e)}")

    # Start the task and store it in app for lifecycle management
    app["image_cleanup_task"] = asyncio.create_task(cleanup_loop())


async def stop_image_cleanup(app):
    """Stop the background cleanup task."""
    task = app.get("image_cleanup_task")
    if task:
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass
