import pytest
from sqlalchemy import select
from backend import models, database
from backend.background.image_processor import check_for_work


@pytest.mark.asyncio
async def test_check_for_work_detects_missing_filename(app, aiohttp_client):
    """Test that check_for_work finds entries with empty filenames."""
    await aiohttp_client(app)
    # 1. Manually insert an image and a palette entry with empty filename
    async with database.get_session() as session:
        image = models.Image(
            id="test-img-1",
            name="Test Image",
            file_type="png",
            width=100,
            height=100,
            file_path="/tmp/test.png",
            status="READY",
            file_hash="hash1",
        )
        session.add(image)
        await session.flush()

        palette = models.ImagePalette(
            image_id="test-img-1",
            palette="MONO",
            filename="",
            image_settings_hash=image.settings_hash,
        )
        session.add(palette)
        await session.commit()

    # 2. Run check_for_work
    count = await check_for_work()
    assert count == 1


@pytest.mark.asyncio
async def test_check_for_work_detects_hash_mismatch(app, aiohttp_client):
    """Test that check_for_work finds entries with mismatched hashes."""
    await aiohttp_client(app)
    # 1. Manually insert an image and a palette entry with matching hash
    async with database.get_session() as session:
        image = models.Image(
            id="test-img-2",
            name="Test Image 2",
            file_type="png",
            width=100,
            height=100,
            file_path="/tmp/test2.png",
            status="READY",
            file_hash="hash2",
        )
        session.add(image)
        await session.flush()

        palette = models.ImagePalette(
            image_id="test-img-2",
            palette="MONO",
            filename="test2_mono.png",
            image_settings_hash=image.settings_hash,
        )
        session.add(palette)
        await session.commit()

    # 2. Run check_for_work - should be 0
    count = await check_for_work()
    assert count == 0

    # 3. Update image settings to change its hash
    async with database.get_session() as session:
        stmt = select(models.Image).where(models.Image.id == "test-img-2")
        result = await session.execute(stmt)
        image = result.scalars().first()
        old_hash = image.settings_hash

        image.brightness = 2.0
        session.add(image)
        await session.commit()

        # Verify hash actually changed
        assert image.settings_hash != old_hash

    # 4. Run check_for_work - should be 1
    count = await check_for_work()
    assert count == 1
