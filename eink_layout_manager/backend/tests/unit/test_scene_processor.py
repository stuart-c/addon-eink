import os
import json
import pytest
from unittest.mock import patch, AsyncMock
from sqlalchemy import select
from backend import database, models
from backend.background.scene_processor import check_for_scene_work


@pytest.fixture
async def db_setup(tmp_path):
    """Fixture to set up and tear down a temporary test database."""
    os.environ["DATA_DIR"] = str(tmp_path)
    # We also need to handle the /share path in tests
    with patch("backend.utils.storage.os.makedirs"):
        await database.init_db()
        yield
        await database.close_db()


@pytest.mark.asyncio
async def test_scene_processor_identifies_work(db_setup, tmp_path):
    """Test that scene_processor identifies an active scene."""

    async with database.get_session() as session:
        # 1. Setup Display Type
        dt = models.DisplayType(
            id="dt1",
            name="7.5 inch",
            width_mm=163,
            height_mm=98,
            panel_width_mm=163,
            panel_height_mm=98,
            width_px=800,
            height_px=480,
            colour_type="BW",
            frame={},
            mat={},
        )
        session.add(dt)

        # 2. Setup Layout
        layout = models.Layout(
            id="layout1",
            name="Test Layout",
            canvas_width_mm=200,
            canvas_height_mm=200,
            items=[
                {
                    "id": "d1",
                    "display_type_id": "dt1",
                    "x_mm": 0,
                    "y_mm": 0,
                    "orientation": "landscape",
                },
                {
                    "id": "d2",
                    "display_type_id": "dt1",
                    "x_mm": 170,
                    "y_mm": 0,
                    "orientation": "landscape",
                },
            ],
            status="active",
        )
        session.add(layout)

        # 3. Setup Image
        img = models.Image(
            id="img1",
            name="Test Image",
            file_path="test.png",
            width=1000,
            height=1000,
            file_type="png",
            status="ACTIVE",
            file_hash="hash1",
        )
        session.add(img)
        await session.commit()
        # Compute settings_hash (happens via event)
        await session.refresh(img)

        # 4. Setup Scene
        scene = models.Scene(
            id="scene1",
            name="Test Scene",
            layout_id="layout1",
            status="active",
            items=[
                {
                    "id": "item1",
                    "type": "image",
                    "displays": ["d1", "d2"],
                    "images": [
                        {
                            "image_id": "img1",
                            "scaling_factor": 50,
                            "offset": {"x": 10, "y": 20},
                            "background_color": "#000000",
                        }
                    ],
                }
            ],
        )
        session.add(scene)
        await session.commit()
        await session.refresh(scene)

    # Mock the subprocess call
    with patch("asyncio.create_subprocess_exec") as mock_exec:

        def side_effect(*args, **kwargs):
            # args[2] is the JSON config
            config = json.loads(args[2])
            dest = config["dest"]
            with open(dest, "wb") as f:
                f.write(b"dummy image data")
            mock_process = AsyncMock()
            mock_process.communicate.return_value = (b"Done", b"")
            mock_process.returncode = 0
            return mock_process

        mock_exec.side_effect = side_effect

        # Mock get_storage_path to avoid /share permission issues in tests
        with patch(
            "backend.background.scene_processor.get_storage_path",
            return_value=str(tmp_path),
        ):

            # Run the check
            await check_for_scene_work()

            # Verify converter was called 2 times (one for each display)
            assert mock_exec.call_count == 2

            # Check arguments for the first call (d1)
            args, _ = mock_exec.call_args_list[0]
            config = json.loads(args[2])
            assert config["width"] == 800
            assert config["height"] == 480
            assert config["draw_w"] == 500  # 1000 * 50%
            assert config["draw_x"] == 10  # offset.x - 0

            # Check arguments for the second call (d2)
            args, _ = mock_exec.call_args_list[1]
            config = json.loads(args[2])
            # d2 is at 170mm. d1 is at 0mm.
            # rel_x_mm = 170 - 0 = 170mm
            # px_per_mm = 800 / 163 = 4.9079
            # draw_x = 10 - (170 * 4.9079) = 10 - 834.35 = -824.35
            assert config["draw_x"] < 0

            # Verify DB was updated
            async with database.get_session() as session:
                stmt = select(models.SceneDisplayImage).where(
                    models.SceneDisplayImage.scene_id == "scene1"
                )
                result = await session.execute(stmt)
                records = result.scalars().all()
                assert len(records) == 2
                assert records[0].scene_hash == scene.scene_hash
                assert records[0].image_hash == img.settings_hash
                assert records[0].file_hash is not None
                assert len(records[0].file_hash) == 64  # SHA-256


@pytest.mark.asyncio
async def test_scene_processor_retriggers_if_file_hash_empty(db_setup, tmp_path):
    """Test that scene_processor retriggers if file_hash is empty."""

    async with database.get_session() as session:
        # Minimal setup for one display
        dt = models.DisplayType(
            id="dt1",
            name="7.5",
            width_mm=163,
            height_mm=98,
            panel_width_mm=163,
            panel_height_mm=98,
            width_px=800,
            height_px=480,
            colour_type="BW",
            frame={},
            mat={},
        )
        session.add(dt)
        layout = models.Layout(
            id="l1",
            name="L",
            canvas_width_mm=200,
            canvas_height_mm=200,
            items=[{"id": "d1", "display_type_id": "dt1", "x_mm": 0, "y_mm": 0}],
            status="active",
        )
        session.add(layout)
        img = models.Image(
            id="i1",
            name="I",
            file_path="t.png",
            width=100,
            height=100,
            file_type="png",
            status="ACTIVE",
            file_hash="h1",
        )
        session.add(img)
        await session.commit()
        await session.refresh(img)

        scene = models.Scene(
            id="s1",
            name="S",
            layout_id="l1",
            status="active",
            items=[
                {
                    "id": "it1",
                    "type": "image",
                    "displays": ["d1"],
                    "images": [
                        {
                            "image_id": "i1",
                            "scaling_factor": 100,
                            "offset": {"x": 0, "y": 0},
                        }
                    ],
                }
            ],
        )
        session.add(scene)
        await session.commit()
        await session.refresh(scene)

        # Create record with matching hashes but MISSING file_hash
        record = models.SceneDisplayImage(
            scene_id="s1",
            display_id="d1",
            image_id="i1",
            image_hash=img.settings_hash,
            scene_hash=scene.scene_hash,
            file_hash=None,  # This is what we are testing
            filename="old.png",
        )
        session.add(record)
        await session.commit()

    # Mock the subprocess call
    with patch("asyncio.create_subprocess_exec") as mock_exec:

        def side_effect(*args, **kwargs):
            config = json.loads(args[2])
            with open(config["dest"], "wb") as f:
                f.write(b"new data")
            m = AsyncMock()
            m.communicate.return_value = (b"Done", b"")
            m.returncode = 0
            return m

        mock_exec.side_effect = side_effect

        with patch(
            "backend.background.scene_processor.get_storage_path",
            return_value=str(tmp_path),
        ):
            await check_for_scene_work()

            # Verify converter WAS called because file_hash was missing
            assert mock_exec.call_count == 1

            async with database.get_session() as session:
                stmt = select(models.SceneDisplayImage).where(
                    models.SceneDisplayImage.scene_id == "s1"
                )
                result = await session.execute(stmt)
                updated_record = result.scalar_one()
                assert updated_record.file_hash is not None
