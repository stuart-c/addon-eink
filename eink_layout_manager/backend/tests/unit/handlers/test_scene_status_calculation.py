import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from backend.handlers.scenes import SceneHandler
from backend import models

@pytest.fixture
def handler():
    return SceneHandler()

@pytest.mark.asyncio
async def test_calculate_scene_status_ready(handler):
    mock_session = AsyncMock()
    mock_layout = MagicMock(spec=models.Layout)
    mock_layout.id = "layout1"
    mock_layout.items = [
        {"id": "d1", "type": "display"},
        {"id": "d2", "type": "display"},
    ]

    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = mock_layout
    mock_session.execute.return_value = mock_result

    items = [
        {"id": "item1", "displays": ["d1"], "images": [{"image_id": "img1"}]},
        {"id": "item2", "displays": ["d2"], "images": [{"image_id": "img2"}]},
    ]

    with patch("backend.database.get_session") as mock_get_session:
        mock_get_session.return_value.__aenter__.return_value = mock_session
        status = await handler._calculate_scene_status(items, "layout1")
        assert status == "ready"

@pytest.mark.asyncio
async def test_calculate_scene_status_draft_missing_image(handler):
    mock_session = AsyncMock()
    mock_layout = MagicMock(spec=models.Layout)
    mock_layout.id = "layout1"
    mock_layout.items = [{"id": "d1"}]

    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = mock_layout
    mock_session.execute.return_value = mock_result

    items = [
        {"id": "item1", "displays": ["d1"], "images": []} # No images
    ]

    with patch("backend.database.get_session") as mock_get_session:
        mock_get_session.return_value.__aenter__.return_value = mock_session
        status = await handler._calculate_scene_status(items, "layout1")
        assert status == "draft"

@pytest.mark.asyncio
async def test_calculate_scene_status_draft_missing_display(handler):
    mock_session = AsyncMock()
    mock_layout = MagicMock(spec=models.Layout)
    mock_layout.id = "layout1"
    mock_layout.items = [{"id": "d1"}, {"id": "d2"}]

    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = mock_layout
    mock_session.execute.return_value = mock_result

    items = [
        {"id": "item1", "displays": ["d1"], "images": [{"image_id": "img1"}]}
        # d2 is missing
    ]

    with patch("backend.database.get_session") as mock_get_session:
        mock_get_session.return_value.__aenter__.return_value = mock_session
        status = await handler._calculate_scene_status(items, "layout1")
        assert status == "draft"
