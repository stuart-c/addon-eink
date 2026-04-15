import pytest
import json
from unittest.mock import MagicMock, patch, AsyncMock
from app.handlers.items import delete_item
from app import models


@pytest.mark.asyncio
async def test_delete_item_display_type_in_use():
    """Test that a display_type cannot be deleted if in use by a layout."""
    mock_request = MagicMock()
    mock_request.match_info = {
        "resource_type": "display_type",
        "id": "display1",
    }

    # Mock DB layout that uses "display1"
    mock_layout = models.Layout(
        id="layout1",
        name="Test Layout",
        items=[{"display_type_id": "display1"}],
        canvas_width_mm=100,
        canvas_height_mm=100
    )

    # Setup the mock session as an async context manager
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [mock_layout]
    mock_session.execute.return_value = mock_result
    
    # database.get_session() returns the context manager
    mock_get_session = MagicMock()
    mock_get_session.return_value.__aenter__.return_value = mock_session

    with (
        patch("app.database.get_session", mock_get_session),
        patch("app.handlers.items.validate_id", side_effect=lambda x: x),
    ):

        response = await delete_item(mock_request)

        assert response.status == 400
        response_data = json.loads(response.body.decode())
        assert response_data["error"] == "Conflict"
        assert "Display type in use: Test Layout" in response_data["message"]
        mock_session.delete.assert_not_called()


@pytest.mark.asyncio
async def test_delete_item_display_type_not_in_use():
    """Test that a display_type CAN be deleted if NOT in use."""
    mock_request = MagicMock()
    mock_request.match_info = {
        "resource_type": "display_type",
        "id": "display1",
    }

    # Mock DB layout that does NOT use "display1"
    mock_layout = models.Layout(
        id="layout1",
        name="Other Layout",
        items=[{"display_type_id": "other_display"}],
        canvas_width_mm=100,
        canvas_height_mm=100
    )
    
    mock_display_type = models.DisplayType(id="display1", name="Display 1")

    mock_session = AsyncMock()
    
    mock_result_layouts = MagicMock()
    mock_result_layouts.scalars.return_value.all.return_value = [mock_layout]
    
    mock_result_dt = MagicMock()
    mock_result_dt.scalars.return_value.first.return_value = mock_display_type
    
    mock_session.execute.side_effect = [mock_result_layouts, mock_result_dt]
    
    mock_get_session = MagicMock()
    mock_get_session.return_value.__aenter__.return_value = mock_session

    with (
        patch("app.database.get_session", mock_get_session),
        patch("app.handlers.items.validate_id", side_effect=lambda x: x),
    ):

        response = await delete_item(mock_request)

        assert response.status == 200
        response_data = json.loads(response.body.decode())
        assert response_data["status"] == "deleted"
        mock_session.delete.assert_called_once()
        mock_session.commit.assert_called_once()


@pytest.mark.asyncio
async def test_delete_item_not_found():
    """Test deletion of a non-existent item."""
    mock_request = MagicMock()
    mock_request.match_info = {"resource_type": "layout", "id": "missing"}

    mock_session = AsyncMock()
    
    mock_result_scene = MagicMock()
    mock_result_scene.scalars.return_value.first.return_value = None
    
    mock_result_item = MagicMock()
    mock_result_item.scalars.return_value.first.return_value = None
    
    mock_session.execute.side_effect = [mock_result_scene, mock_result_item]
    
    mock_get_session = MagicMock()
    mock_get_session.return_value.__aenter__.return_value = mock_session

    with (
        patch("app.database.get_session", mock_get_session),
        patch("app.handlers.items.validate_id", side_effect=lambda x: x),
    ):

        response = await delete_item(mock_request)

        assert response.status == 404
