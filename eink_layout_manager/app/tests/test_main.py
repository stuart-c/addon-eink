import os
import pytest
from app.main import init_app, get_storage_path, load_schema


@pytest.fixture
def app(tmp_path):
    """
    Fixture to initialize the application for testing
    using a temporary data directory.
    """
    # Override DATA_DIR for tests
    os.environ["DATA_DIR"] = str(tmp_path)
    return init_app()


# --- Helper Tests ---


def test_get_storage_path(tmp_path):
    """Test get_storage_path correctly creates and returns the directory."""
    os.environ["DATA_DIR"] = str(tmp_path)
    path = get_storage_path("test_resource")
    assert path == os.path.join(str(tmp_path), "test_resource")
    assert os.path.exists(path)


def test_load_schema():
    """Test load_schema returns a valid schema dict."""
    schema = load_schema("display_type")
    assert isinstance(schema, dict)
    assert schema["title"] == "DisplayType"

    with pytest.raises(FileNotFoundError):
        load_schema("non_existent_schema")


# --- Handler Tests ---


@pytest.mark.asyncio
async def test_ping(aiohttp_client, app):
    """Test the /ping health check."""
    client = await aiohttp_client(app)
    resp = await client.get("/ping")
    assert resp.status == 200
    assert await resp.text() == "pong"


@pytest.mark.asyncio
async def test_get_collection_empty(aiohttp_client, app):
    """Test GET /api/{resource_type} with no data."""
    client = await aiohttp_client(app)
    for resource in ["display_type", "layout"]:
        resp = await client.get(f"/api/{resource}")
        assert resp.status == 200
        assert await resp.json() == []


@pytest.mark.asyncio
async def test_create_and_get_item(aiohttp_client, app):
    """Test creating and then fetching an item."""
    client = await aiohttp_client(app)

    # Valid display type data
    display_data = {
        "id": "epd_2in13",
        "name": "2.13 inch EPD",
        "width_mm": 25,
        "height_mm": 50,
        "width_px": 122,
        "height_px": 250,
        "colour_type": "BWR",
        "frame": {"thickness_mm": 2, "colour": "#000000"},
        "mat": {"thickness_mm": 5, "colour": "#FFFFFF"},
    }

    # Create
    resp = await client.post("/api/display_type", json=display_data)
    assert resp.status == 201
    assert await resp.json() == display_data

    # Read
    resp = await client.get("/api/display_type/epd_2in13")
    assert resp.status == 200
    assert await resp.json() == display_data

    # Read Collection
    resp = await client.get("/api/display_type")
    assert resp.status == 200
    assert await resp.json() == [display_data]


@pytest.mark.asyncio
async def test_create_item_duplicate(aiohttp_client, app):
    """Test creating an item that already exists (409)."""
    client = await aiohttp_client(app)
    data = {
        "id": "dup",
        "name": "Duplicate",
        "width_mm": 10,
        "height_mm": 10,
        "width_px": 10,
        "height_px": 10,
        "colour_type": "MONO",
    }
    await client.post("/api/display_type", json=data)
    resp = await client.post("/api/display_type", json=data)
    assert resp.status == 409


@pytest.mark.asyncio
async def test_create_item_invalid_schema(aiohttp_client, app):
    """Test schema validation during creation."""
    client = await aiohttp_client(app)
    # Missing required field 'name'
    invalid_data = {"id": "invalid", "width_mm": 10}
    resp = await client.post("/api/display_type", json=invalid_data)
    assert resp.status == 400
    result = await resp.json()
    assert "Validation failed" in result["error"]


@pytest.mark.asyncio
async def test_update_item(aiohttp_client, app):
    """Test updating an existing item."""
    client = await aiohttp_client(app)
    data = {
        "id": "update_me",
        "name": "Original",
        "width_mm": 10,
        "height_mm": 10,
        "width_px": 10,
        "height_px": 10,
        "colour_type": "MONO",
    }
    await client.post("/api/display_type", json=data)

    data["name"] = "Updated"
    resp = await client.put("/api/display_type/update_me", json=data)
    assert resp.status == 200
    assert (await resp.json())["name"] == "Updated"


@pytest.mark.asyncio
async def test_update_item_id_mismatch(aiohttp_client, app):
    """Test update with ID mismatch between URL and body."""
    client = await aiohttp_client(app)
    data = {"id": "wrong_id", "name": "Name"}
    resp = await client.put("/api/display_type/correct_id", json=data)
    assert resp.status == 400


@pytest.mark.asyncio
async def test_delete_item(aiohttp_client, app):
    """Test item deletion."""
    client = await aiohttp_client(app)
    data = {
        "id": "del_me",
        "name": "Delete",
        "width_mm": 10,
        "height_mm": 10,
        "width_px": 10,
        "height_px": 10,
        "colour_type": "MONO",
    }
    await client.post("/api/display_type", json=data)

    resp = await client.delete("/api/display_type/del_me")
    assert resp.status == 200
    assert (await resp.json())["status"] == "deleted"

    # Verify gone
    resp = await client.get("/api/display_type/del_me")
    assert resp.status == 404


@pytest.mark.asyncio
async def test_not_found(aiohttp_client, app):
    """Test 404 for non-existent resources."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/display_type/non_existent")
    assert resp.status == 404

    # Valid schema but non-existent ID
    valid_data = {
        "id": "non_existent",
        "name": "Non-existent",
        "width_mm": 10,
        "height_mm": 10,
        "width_px": 10,
        "height_px": 10,
        "colour_type": "MONO",
    }
    resp = await client.put("/api/display_type/non_existent", json=valid_data)
    assert resp.status == 404

    resp = await client.delete("/api/display_type/non_existent")
    assert resp.status == 404
