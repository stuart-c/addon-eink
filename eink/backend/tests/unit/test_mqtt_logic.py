import pytest
import os
from unittest.mock import MagicMock, AsyncMock, patch
from backend.background.mqtt import MQTTManager
from backend import models


@pytest.fixture
def mock_app():
    app = {"client_session": AsyncMock()}
    return app


@pytest.mark.asyncio
async def test_mqtt_on_message_parsing():
    manager = MQTTManager()
    manager._handle_layout_update = AsyncMock()

    # Test scene set
    topic = "eink/layout/layout1/scene/set"
    payload = b"Evening Scene"
    manager.on_message(None, topic, payload, 0, None)

    # Check that _handle_layout_update was called with correct args
    manager._handle_layout_update.assert_called_with(
        "layout1", scene_name="Evening Scene"
    )
    assert manager.layout_states["layout1"]["current_scene"] == "Evening Scene"

    # Test refresh set
    topic = "eink/layout/layout1/refresh/set"
    payload = b"press"
    manager.on_message(None, topic, payload, 0, None)
    manager._handle_layout_update.assert_called_with("layout1")


@pytest.mark.asyncio
async def test_handle_layout_update_logic(mock_app):
    manager = MQTTManager(app=mock_app)
    manager.client = MagicMock()

    layout_id = "L1"
    scene_name = "S1"
    display_id = "D1"
    device_id = "dev_abc"
    image_id = "img_xyz"
    filename = "slice_L1_D1_img_xyz.png"

    # Mock Data
    mock_layout = models.Layout(
        id=layout_id,
        name="Test Layout",
        items=[{"id": display_id, "device_id": device_id}],
        status="active",
    )
    mock_scene = models.Scene(
        id="scene_id_1",
        name=scene_name,
        layout_id=layout_id,
        items=[
            {
                "id": "item1",
                "type": "image",
                "displays": [display_id],
                "images": [{"image_id": image_id}],
            }
        ],
    )
    mock_slice = models.SceneDisplayImage(
        scene_id="scene_id_1",
        display_id=display_id,
        image_id=image_id,
        filename=filename,
    )

    # Database Mocks
    mock_session = AsyncMock()

    # 1. Layout query
    res_layout = MagicMock()
    res_layout.scalar_one_or_none.return_value = mock_layout

    # 2. Scene query
    res_scene = MagicMock()
    res_scene.scalar_one_or_none.return_value = mock_scene

    # 3. Slices query
    res_slices = MagicMock()
    res_slices.scalars.return_value.all.return_value = [mock_slice]

    # 3.5 LayoutState query (from _save_layout_state)
    res_state = MagicMock()
    res_state.scalar_one_or_none.return_value = None

    mock_session.execute.side_effect = [res_layout, res_scene, res_state, res_slices]

    with (
        patch(
            "backend.database.get_session",
            return_value=AsyncMock(__aenter__=AsyncMock(return_value=mock_session)),
        ),
        patch.dict(os.environ, {"SUPERVISOR_TOKEN": "mock_token"}),
    ):
        # HA response mock
        mock_resp = AsyncMock()
        mock_resp.status = 200
        mock_app["client_session"].post.return_value.__aenter__.return_value = mock_resp

        await manager._handle_layout_update(layout_id, scene_name=scene_name)

        # Verify MQTT Updates (Timestamp and current scene)
        assert manager.client.publish.call_count >= 2

        # Verify HA Service Call
        mock_app["client_session"].post.assert_called_once()
        _, kwargs = mock_app["client_session"].post.call_args

        data = kwargs["json"]
        assert data["device_id"] == device_id
        assert filename in data["image"]["media_content_id"]
        assert data["dither_mode"] == "none"
        assert data["rotation"] == 90
        assert data["fit_mode"] == "crop"
