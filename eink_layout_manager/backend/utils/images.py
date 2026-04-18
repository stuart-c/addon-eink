import os
from backend.utils.storage import get_storage_path


async def delete_image_files_and_record(image, session):
    """
    Permanently delete an image record from database and its files from disk.

    Args:
        image (models.Image): The Image model instance to delete.
        session (AsyncSession): The database session to use for deletion.
    """
    filename = image.file_path
    thumbnail = image.thumbnail_path
    image_id = image.id

    # 1. Delete from DB
    await session.delete(image)
    await session.commit()

    # 2. Delete files from disk
    try:
        # Delete main image
        storage_path = get_storage_path("image")
        file_path = os.path.join(storage_path, filename)
        if os.path.exists(file_path):
            os.remove(file_path)

        # Delete thumbnail if it exists
        if thumbnail:
            thumb_storage_path = get_storage_path("thumbnail")
            thumb_file_path = os.path.join(thumb_storage_path, thumbnail)
            if os.path.exists(thumb_file_path):
                os.remove(thumb_file_path)
    except Exception as e:
        # Log but don't fail, as DB record is already gone
        print(f"Error deleting image files for {image_id}: {str(e)}")
