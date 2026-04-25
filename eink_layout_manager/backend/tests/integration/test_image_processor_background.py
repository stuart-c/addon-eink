import os
import pytest
from sqlalchemy import select
from backend import models, database
from backend.background.image_processor import check_for_work


@pytest.fixture
def test_image(app):
    """Create a small valid PNG for testing."""
    from PIL import Image
    from backend.utils.storage import get_storage_path

    filename = "test.png"
    img_path = os.path.join(get_storage_path("image"), filename)
    img = Image.new("RGB", (10, 10), color="red")
    img.save(img_path)
    return filename


@pytest.mark.asyncio
async def test_check_for_work_completes_conversion(app, aiohttp_client, test_image):
    """Test that check_for_work performs conversion and updates database."""
    await aiohttp_client(app)

    # 1. Manually insert an image and a palette entry with empty filename
    async with database.get_session() as session:
        image = models.Image(
            id="test-img-1",
            name="Test Image",
            file_type="png",
            width=10,
            height=10,
            file_path=test_image,
            status="READY",
            file_hash="hash1",
        )
        session.add(image)
        await session.flush()

        palette = models.ImagePalette(
            image_id="test-img-1",
            palette="MONO",
            filename="",
            image_settings_hash="",  # Triggers work
        )
        session.add(palette)
        await session.commit()

    # 2. Run check_for_work
    count = await check_for_work()
    assert count == 1

    # 3. Verify database updates
    async with database.get_session() as session:
        stmt = select(models.ImagePalette).where(
            models.ImagePalette.image_id == "test-img-1"
        )
        result = await session.execute(stmt)
        entry = result.scalars().first()

        assert entry.filename != ""
        assert entry.filename.startswith("test-img-1_MONO_")
        assert entry.image_settings_hash != ""

    # 4. Verify file exists in conversion cache
    from backend.utils.storage import get_storage_path

    conversion_dir = get_storage_path("conversion")
    assert os.path.exists(os.path.join(conversion_dir, entry.filename))


@pytest.mark.asyncio
async def test_check_for_work_detects_hash_mismatch_and_reprocesses(
    app, aiohttp_client, test_image
):
    """Test that check_for_work re-processes when hashes differ."""
    await aiohttp_client(app)

    # 1. Setup image and palette with matching hash
    async with database.get_session() as session:
        image = models.Image(
            id="test-img-2",
            name="Test Image 2",
            file_type="png",
            width=10,
            height=10,
            file_path=test_image,
            status="READY",
            file_hash="hash2",
        )
        session.add(image)
        await session.flush()

        settings_hash = image.settings_hash
        palette = models.ImagePalette(
            image_id="test-img-2",
            palette="MONO",
            filename="old.png",
            image_settings_hash=settings_hash,
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

        image.brightness = 2.0
        session.add(image)
        await session.commit()
        new_hash = image.settings_hash
        assert new_hash != settings_hash

    # 4. Run check_for_work - should be 1
    count = await check_for_work()
    assert count == 1

    # 5. Verify database updated with new hash and filename
    async with database.get_session() as session:
        stmt = select(models.ImagePalette).where(
            models.ImagePalette.image_id == "test-img-2"
        )
        result = await session.execute(stmt)
        entry = result.scalars().first()

        assert entry.image_settings_hash == new_hash
        assert entry.filename != "old.png"
