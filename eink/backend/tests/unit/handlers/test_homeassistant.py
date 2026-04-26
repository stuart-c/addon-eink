import os
import pytest
from unittest.mock import patch, AsyncMock


@pytest.fixture
def mock_supervisor_token():
    with patch.dict(os.environ, {"SUPERVISOR_TOKEN": "mock_token"}):
        yield "mock_token"


@pytest.fixture(autouse=True)
def mock_db_init():
    with (
        patch("backend.database.init_db", AsyncMock()),
        patch("backend.database.close_db", AsyncMock()),
    ):
        yield


@pytest.mark.asyncio
async def test_handle_device_list_no_token(aiohttp_client, app):
    # Ensure token is NOT in environment
    with patch.dict(os.environ, {}, clear=True):
        client = await aiohttp_client(app)
        resp = await client.get("/api/homeassistant/device")
        assert resp.status == 200
        data = await resp.json()
        assert data == []


@pytest.mark.asyncio
async def test_handle_device_list_success(aiohttp_client, app, mock_supervisor_token):
    client = await aiohttp_client(app)

    # Mock data
    entries_data = [
        {"entry_id": "entry_1", "domain": "opendisplay"},
        {"entry_id": "entry_2", "domain": "other"},
    ]
    devices_data = [
        {
            "id": "device_1",
            "name": "Display 1",
            "name_by_user": "Kitchen Display",
            "model": "ST7789",
            "manufacturer": "Waveshare",
            "config_entries": ["entry_1"],
        },
        {
            "id": "device_2",
            "name": "Other Device",
            "config_entries": ["entry_2"],
        },
    ]

    # Create a mock session
    from unittest.mock import MagicMock

    mock_session = MagicMock()
    mock_session.close = AsyncMock()

    # Mock responses
    mock_entries_resp = AsyncMock()
    mock_entries_resp.status = 200
    mock_entries_resp.json.return_value = entries_data
    mock_entries_resp.__aenter__.return_value = mock_entries_resp

    mock_devices_resp = AsyncMock()
    mock_devices_resp.status = 200
    mock_devices_resp.json.return_value = devices_data
    mock_devices_resp.__aenter__.return_value = mock_devices_resp

    mock_session.get.side_effect = [mock_entries_resp, mock_devices_resp]

    # Inject mock session into app
    app["client_session"] = mock_session

    resp = await client.get("/api/homeassistant/device")
    assert resp.status == 200
    data = await resp.json()

    assert len(data) == 1
    assert data[0]["id"] == "device_1"
    assert data[0]["name"] == "Kitchen Display"
    assert data[0]["model"] == "ST7789"
    assert data[0]["manufacturer"] == "Waveshare"


@pytest.mark.asyncio
async def test_handle_device_list_no_integration(
    aiohttp_client, app, mock_supervisor_token
):
    client = await aiohttp_client(app)

    from unittest.mock import MagicMock

    # Mock data - no opendisplay
    entries_data = [{"entry_id": "entry_2", "domain": "other"}]

    mock_session = MagicMock()
    mock_session.close = AsyncMock()
    mock_entries_resp = AsyncMock()
    mock_entries_resp.status = 200
    mock_entries_resp.json.return_value = entries_data
    mock_entries_resp.__aenter__.return_value = mock_entries_resp
    mock_session.get.return_value = mock_entries_resp

    app["client_session"] = mock_session

    resp = await client.get("/api/homeassistant/device")
    assert resp.status == 200
    data = await resp.json()
    assert data == []


@pytest.mark.asyncio
async def test_handle_device_list_api_error(aiohttp_client, app, mock_supervisor_token):
    client = await aiohttp_client(app)

    from unittest.mock import MagicMock

    mock_session = MagicMock()
    mock_session.close = AsyncMock()
    mock_entries_resp = AsyncMock()
    mock_entries_resp.status = 502
    mock_entries_resp.__aenter__.return_value = mock_entries_resp
    mock_session.get.return_value = mock_entries_resp

    app["client_session"] = mock_session

    resp = await client.get("/api/homeassistant/device")
    assert resp.status == 502
    data = await resp.json()
    assert "error" in data
