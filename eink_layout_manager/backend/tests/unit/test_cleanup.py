import pytest
from datetime import datetime, timedelta
from unittest.mock import patch
from backend import models


@pytest.mark.asyncio
async def test_cleanup_expired_images_logic(app):
    """Test that only UPLOADED images older than 12 hours are deleted."""
    from backend import database

    await database.init_db()

    # 1. Setup mock data
    now = datetime.utcnow()
    old_time = now - timedelta(hours=13)
    new_time = now - timedelta(hours=11)

    images = [
        # Image 1: Expired UPLOADED -> Should be deleted
        models.Image(
            id="img1",
            status="UPLOADED",
            created_at=old_time,
            file_path="f1",
            thumbnail_path="t1",
            file_hash="h1",
            name="n1",
            file_type="PNG",
            width=10,
            height=10,
        ),
        # Image 2: Fresh UPLOADED -> Should be kept
        models.Image(
            id="img2",
            status="UPLOADED",
            created_at=new_time,
            file_path="f2",
            thumbnail_path="t2",
            file_hash="h2",
            name="n2",
            file_type="PNG",
            width=10,
            height=10,
        ),
        # Image 3: Old but NOT 'UPLOADED' (if status changes in future)
        models.Image(
            id="img3",
            status="OTHER",
            created_at=old_time,
            file_path="f3",
            thumbnail_path="t3",
            file_hash="h3",
            name="n3",
            file_type="PNG",
            width=10,
            height=10,
        ),
    ]

    async with database.get_session() as session:
        for img in images:
            session.add(img)
        await session.commit()

    # 2. Mock the file deletion utility to avoid actual disk access
    with patch(
        "backend.background.cleanup.delete_image_files_and_record"
    ) as mock_delete:
        from backend.background.cleanup import cleanup_expired_images

        deleted_count = await cleanup_expired_images()

        # 3. Verify
        assert deleted_count == 1
        mock_delete.assert_called_once()
        # Verify it was called with img1
        args, _ = mock_delete.call_args
        assert args[0].id == "img1"
