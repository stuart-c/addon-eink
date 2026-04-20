import pytest
from unittest.mock import MagicMock, AsyncMock
from backend.handlers.items import DisplayTypeHandler
from backend import models
from aiohttp import web


@pytest.fixture
def handler():
    return DisplayTypeHandler()


def test_ensure_landscape_no_swap(handler):
    """Test that dimensions are not swapped when already in landscape."""
    data = {
        "width_mm": 100,
        "height_mm": 80,
        "panel_width_mm": 90,
        "panel_height_mm": 70,
        "width_px": 800,
        "height_px": 600,
    }
    result = handler._ensure_landscape(data)
    assert result["width_mm"] == 100
    assert result["height_mm"] == 80
    assert result["panel_width_mm"] == 90
    assert result["panel_height_mm"] == 70
    assert result["width_px"] == 800
    assert result["height_px"] == 600


def test_ensure_landscape_swap(handler):
    """Test that dimensions are swapped when in portrait."""
    data = {
        "width_mm": 80,
        "height_mm": 100,
        "panel_width_mm": 70,
        "panel_height_mm": 90,
        "width_px": 600,
        "height_px": 800,
    }
    result = handler._ensure_landscape(data)
    assert result["width_mm"] == 100
    assert result["height_mm"] == 80
    assert result["panel_width_mm"] == 90
    assert result["panel_height_mm"] == 70
    assert result["width_px"] == 800
    assert result["height_px"] == 600


def test_ensure_landscape_square(handler):
    """Test that dimensions are not swapped when square."""
    data = {
        "width_mm": 100,
        "height_mm": 100,
        "panel_width_mm": 90,
        "panel_height_mm": 90,
        "width_px": 800,
        "height_px": 800,
    }
    result = handler._ensure_landscape(data)
    assert result["width_mm"] == 100
    assert result["height_mm"] == 100


@pytest.mark.asyncio
async def test_pre_delete_collision(handler):
    """Test pre_delete raises Conflict when display type is in use."""
    mock_session = AsyncMock()
    mock_item = MagicMock(spec=models.DisplayType)
    mock_item.id = "dt1"

    # Mock a layout that uses this display type
    mock_layout = MagicMock(spec=models.Layout)
    mock_layout.name = "Test Layout"
    mock_layout.items = [{"display_type_id": "dt1"}]

    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [mock_layout]
    mock_session.execute.return_value = mock_result

    with pytest.raises(web.HTTPConflict) as excinfo:
        await handler.pre_delete(mock_item, mock_session)

    assert "Display type in use: Test Layout" in str(excinfo.value.reason)


@pytest.mark.asyncio
async def test_pre_delete_no_collision(handler):
    """Test pre_delete succeeds when display type is not in use."""
    mock_session = AsyncMock()
    mock_item = MagicMock(spec=models.DisplayType)
    mock_item.id = "dt1"

    # Mock a layout that uses a DIFFERENT display type
    mock_layout = MagicMock(spec=models.Layout)
    mock_layout.items = [{"display_type_id": "dt2"}]

    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [mock_layout]
    mock_session.execute.return_value = mock_result

    # Should not raise
    await handler.pre_delete(mock_item, mock_session)
