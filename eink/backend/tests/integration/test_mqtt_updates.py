import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from backend import database, models
from backend.background.mqtt import MQTTManager


@pytest.mark.asyncio
async def test_mqtt_independent_item_selection(aiohttp_client, app):
    """
    Test that different scene items with the same image pool
    result in independent random selections.
    """
    await aiohttp_client(app)
    async with database.get_session() as session:
        # 1. Create a Layout
        layout = models.Layout(
            id="test-layout",
            name="Test Layout",
            canvas_width_mm=100,
            canvas_height_mm=100,
            items=[
                {"id": "d1", "device_id": "dev1", "display_type_id": "dt1"},
                {"id": "d2", "device_id": "dev2", "display_type_id": "dt1"},
            ],
            status="active",
        )
        session.add(layout)

        # 2. Create a Scene with TWO items, both having images [img1, img2]
        scene = models.Scene(
            id="test-scene",
            name="Test Scene",
            layout_id="test-layout",
            items=[
                {
                    "id": "item1",
                    "type": "image",
                    "displays": ["d1"],
                    "images": [{"image_id": "img1"}, {"image_id": "img2"}],
                },
                {
                    "id": "item2",
                    "type": "image",
                    "displays": ["d2"],
                    "images": [{"image_id": "img1"}, {"image_id": "img2"}],
                },
            ],
            status="active",
            scene_hash="hash1",
        )
        session.add(scene)

        # 3. Add slices to SceneDisplayImage for all possible combinations
        slices = [
            models.SceneDisplayImage(
                scene_id="test-scene",
                display_id="d1",
                image_id="img1",
                filename="slice1_img1.png",
                scene_hash="hash1",
                image_hash="h1",
            ),
            models.SceneDisplayImage(
                scene_id="test-scene",
                display_id="d1",
                image_id="img2",
                filename="slice1_img2.png",
                scene_hash="hash1",
                image_hash="h2",
            ),
            models.SceneDisplayImage(
                scene_id="test-scene",
                display_id="d2",
                image_id="img1",
                filename="slice2_img1.png",
                scene_hash="hash1",
                image_hash="h1",
            ),
            models.SceneDisplayImage(
                scene_id="test-scene",
                display_id="d2",
                image_id="img2",
                filename="slice2_img2.png",
                scene_hash="hash1",
                image_hash="h2",
            ),
        ]
        for s in slices:
            session.add(s)

        await session.commit()

    # 4. Mock MQTTManager and its dependencies
    manager = MQTTManager(app=MagicMock())
    manager.client = MagicMock()
    manager._call_ha_upload = AsyncMock()

    # We want to verify that random.choice is called twice independently.
    # To be deterministic, we can patch random.choice.
    # Let's say first call returns img1, second call returns img2.
    with patch("random.choice") as mock_choice:
        mock_choice.side_effect = ["img1", "img2"]

        await manager._handle_layout_update("test-layout", scene_name="Test Scene")

        # Assertions
        assert manager._call_ha_upload.call_count == 2

        calls = manager._call_ha_upload.call_args_list
        # Call 1: d1 with img1 (slice1_img1.png)
        # Call 2: d2 with img2 (slice2_img2.png)

        call_args = [c[0] for c in calls]
        assert ("dev1", "slice1_img1.png") in call_args
        assert ("dev2", "slice2_img2.png") in call_args


@pytest.mark.asyncio
async def test_mqtt_same_item_selection(aiohttp_client, app):
    """
    Test that displays in the SAME scene item get the SAME image selection.
    """
    await aiohttp_client(app)
    async with database.get_session() as session:
        # Create a Layout
        layout = models.Layout(
            id="multi-display-layout",
            name="Multi Display Layout",
            canvas_width_mm=200,
            canvas_height_mm=100,
            items=[
                {"id": "d1", "device_id": "dev1", "display_type_id": "dt1"},
                {"id": "d2", "device_id": "dev2", "display_type_id": "dt1"},
            ],
            status="active",
        )
        session.add(layout)

        # Create a Scene with ONE item covering BOTH displays
        scene = models.Scene(
            id="multi-display-scene",
            name="Multi Display Scene",
            layout_id="multi-display-layout",
            items=[
                {
                    "id": "multi-item",
                    "type": "image",
                    "displays": ["d1", "d2"],
                    "images": [{"image_id": "img1"}, {"image_id": "img2"}],
                }
            ],
            status="active",
            scene_hash="hash2",
        )
        session.add(scene)

        # Add slices
        slices = [
            models.SceneDisplayImage(
                scene_id="multi-display-scene",
                display_id="d1",
                image_id="img1",
                filename="d1_img1.png",
                scene_hash="hash2",
                image_hash="h1",
            ),
            models.SceneDisplayImage(
                scene_id="multi-display-scene",
                display_id="d1",
                image_id="img2",
                filename="d1_img2.png",
                scene_hash="hash2",
                image_hash="h2",
            ),
            models.SceneDisplayImage(
                scene_id="multi-display-scene",
                display_id="d2",
                image_id="img1",
                filename="d2_img1.png",
                scene_hash="hash2",
                image_hash="h1",
            ),
            models.SceneDisplayImage(
                scene_id="multi-display-scene",
                display_id="d2",
                image_id="img2",
                filename="d2_img2.png",
                scene_hash="hash2",
                image_hash="h2",
            ),
        ]
        for s in slices:
            session.add(s)
        await session.commit()

    manager = MQTTManager(app=MagicMock())
    manager.client = MagicMock()
    manager._call_ha_upload = AsyncMock()

    with patch("random.choice") as mock_choice:
        mock_choice.return_value = "img2"

        await manager._handle_layout_update(
            "multi-display-layout", scene_name="Multi Display Scene"
        )

        assert manager._call_ha_upload.call_count == 2
        calls = manager._call_ha_upload.call_args_list
        call_args = [c[0] for c in calls]
        assert ("dev1", "d1_img2.png") in call_args
        assert ("dev2", "d2_img2.png") in call_args
