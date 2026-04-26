import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from jsonschema import ValidationError
from backend.handlers.scenes import SceneHandler
from backend import models


@pytest.fixture
def handler():
    return SceneHandler()


@pytest.mark.asyncio
async def test_pre_create_transformations(handler):
    """Test pre_create maps 'layout' to 'layout_id' and sets status."""
    data = {"name": "Test Scene", "layout": "layout1", "items": []}
    # Mock validation to avoid DB lookup
    with patch.object(handler, "_validate_scene_items", new_callable=AsyncMock):
        result = await handler.pre_create(data)
        assert result["status"] == "draft"
        assert result["layout_id"] == "layout1"
        assert "layout" not in result


@pytest.mark.asyncio
async def test_validate_scene_items_success(handler):
    """Test _validate_scene_items with valid data."""
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
        {"id": "item1", "displays": ["d1"]},
        {"id": "item2", "displays": ["d2"]},
    ]

    with patch("backend.database.get_session") as mock_get_session:
        mock_get_session.return_value.__aenter__.return_value = mock_session
        # Should not raise
        await handler._validate_scene_items(items, "layout1")


@pytest.mark.asyncio
async def test_validate_scene_items_missing_display(handler):
    """Test _validate_scene_items fails when display is not in layout."""
    mock_session = AsyncMock()
    mock_layout = MagicMock(spec=models.Layout)
    mock_layout.id = "layout1"
    mock_layout.items = [{"id": "d1"}]

    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = mock_layout
    mock_session.execute.return_value = mock_result

    items = [{"id": "item1", "displays": ["MISSING"]}]

    with patch("backend.database.get_session") as mock_get_session:
        mock_get_session.return_value.__aenter__.return_value = mock_session
        with pytest.raises(ValidationError) as excinfo:
            await handler._validate_scene_items(items, "layout1")
        assert "Display 'MISSING' not in layout 'layout1'" in str(excinfo.value)


@pytest.mark.asyncio
async def test_validate_scene_items_duplicate_display(handler):
    """Test _validate_scene_items fails when display is used twice."""
    mock_session = AsyncMock()
    mock_layout = MagicMock(spec=models.Layout)
    mock_layout.id = "layout1"
    mock_layout.items = [{"id": "d1"}, {"id": "d2"}]

    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = mock_layout
    mock_session.execute.return_value = mock_result

    items = [
        {"id": "item1", "displays": ["d1"]},
        {"id": "item2", "displays": ["d1"]},  # Duplicate
    ]

    with patch("backend.database.get_session") as mock_get_session:
        mock_get_session.return_value.__aenter__.return_value = mock_session
        with pytest.raises(ValidationError) as excinfo:
            await handler._validate_scene_items(items, "layout1")
        assert "Display 'd1' mentioned more than once in scene" in str(excinfo.value)
