import os
import pytest
from backend import database, models
from sqlalchemy import select


@pytest.fixture
async def db_setup(tmp_path):
    """Fixture to set up and tear down a temporary test database."""
    os.environ["DATA_DIR"] = str(tmp_path)
    await database.init_db()
    yield
    await database.close_db()


@pytest.mark.asyncio
async def test_scene_display_images_table_exists(db_setup):
    """Test that the scene_display_images table is created."""
    async with database.get_session() as session:
        res = await session.execute(
            database.text(
                "SELECT name FROM sqlite_master "
                "WHERE type='table' AND name='scene_display_images'"
            )
        )
        assert res.scalar() == "scene_display_images"


@pytest.mark.asyncio
async def test_scene_display_images_crud(db_setup):
    """Test basic CRUD operations on scene_display_images table."""
    async with database.get_session() as session:
        # Create
        new_entry = models.SceneDisplayImage(
            scene_id="scene1",
            display_id="display1",
            image_id="image1",
            image_hash="ihash1",
            scene_hash="shash1",
            filename="output1.png",
        )
        session.add(new_entry)
        await session.commit()

        # Read
        stmt = select(models.SceneDisplayImage).where(
            models.SceneDisplayImage.scene_id == "scene1",
            models.SceneDisplayImage.display_id == "display1",
            models.SceneDisplayImage.image_id == "image1",
        )
        result = await session.execute(stmt)
        entry = result.scalar_one()
        assert entry.image_id == "image1"
        assert entry.filename == "output1.png"

        # Update
        entry.filename = "output1_v2.png"
        await session.commit()

        result = await session.execute(stmt)
        entry = result.scalar_one()
        assert entry.filename == "output1_v2.png"

        # Delete
        await session.delete(entry)
        await session.commit()

        result = await session.execute(stmt)
        assert result.scalar() is None
