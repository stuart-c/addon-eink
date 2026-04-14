import pytest
import json
from unittest.mock import MagicMock, patch, mock_open
from app.handlers.items import delete_item


@pytest.mark.asyncio
async def test_delete_item_display_type_in_use():
    """Test that a display_type cannot be deleted if in use by a layout."""
    mock_request = MagicMock()
    mock_request.match_info = {
        "resource_type": "display_type",
        "id": "display1",
    }

    # Layout data that uses "display1"
    layout_data = {
        "name": "Test Layout",
        "items": [{"display_type_id": "display1"}],
    }

    with (
        patch("app.handlers.items.get_storage_path") as mock_get_path,
        patch("app.handlers.items.validate_id", side_effect=lambda x: x),
        patch("os.path.exists", return_value=True),
        patch("os.path.realpath", side_effect=lambda x: x),
        patch("os.listdir", return_value=["layout1.json"]),
        patch("builtins.open", mock_open(read_data=json.dumps(layout_data))),
        patch("app.utils.validation.load_schema", return_value={"type": "object"}),
        patch("os.remove") as mock_remove,
    ):

        mock_get_path.side_effect = lambda t: f"/data/{t}"

        response = await delete_item(mock_request)

        assert response.status == 400
        response_data = json.loads(response.body.decode())
        assert response_data["error"] == "Conflict"
        assert "Display type in use" in response_data["message"]
        mock_remove.assert_not_called()


@pytest.mark.asyncio
async def test_delete_item_display_type_not_in_use():
    """Test that a display_type CAN be deleted if NOT in use."""
    mock_request = MagicMock()
    mock_request.match_info = {
        "resource_type": "display_type",
        "id": "display1",
    }

    # Layout data that does NOT use "display1"
    layout_data = {
        "name": "Other Layout",
        "items": [{"display_type_id": "other_display"}],
    }

    with (
        patch("app.handlers.items.get_storage_path") as mock_get_path,
        patch("app.handlers.items.validate_id", side_effect=lambda x: x),
        patch("os.path.exists", return_value=True),
        patch("os.path.realpath", side_effect=lambda x: x),
        patch("os.listdir", return_value=["layout1.json"]),
        patch("builtins.open", mock_open(read_data=json.dumps(layout_data))),
        patch("app.utils.validation.load_schema", return_value={"type": "object"}),
        patch("os.remove") as mock_remove,
    ):

        mock_get_path.side_effect = lambda t: f"/data/{t}"

        response = await delete_item(mock_request)

        assert response.status == 200
        response_data = json.loads(response.body.decode())
        assert response_data["status"] == "deleted"
        mock_remove.assert_called_once()


@pytest.mark.asyncio
async def test_delete_item_not_found():
    """Test deletion of a non-existent item."""
    mock_request = MagicMock()
    mock_request.match_info = {"resource_type": "layout", "id": "missing"}

    with (
        patch(
            "app.handlers.items.get_storage_path", return_value="/data/layout"
        ),
        patch("app.handlers.items.validate_id", side_effect=lambda x: x),
        patch("os.path.exists", return_value=False),
        patch("os.path.realpath", side_effect=lambda x: x),
    ):

        response = await delete_item(mock_request)

        assert response.status == 404
