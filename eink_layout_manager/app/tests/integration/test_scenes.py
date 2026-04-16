import pytest


@pytest.mark.asyncio
async def test_get_scenes_empty(aiohttp_client, app):
    """Test GET /api/scene with no data."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/scene")
    assert resp.status == 200
    assert await resp.json() == []


@pytest.mark.asyncio
async def test_create_and_get_scene(aiohttp_client, app):
    """Test creating and then fetching a scene."""
    client = await aiohttp_client(app)

    scene_data = {
        "id": "morning-routine",
        "name": "Morning Routine",
        "layout": "main-living-room",
    }

    # Create
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201
    created_data = await resp.json()
    scene_id = created_data["id"]
    assert scene_id != scene_data["id"]
    assert created_data["name"] == scene_data["name"]
    assert created_data["status"] == "draft"

    # Read specific
    resp = await client.get(f"/api/scene/{scene_id}")
    assert resp.status == 200
    assert await resp.json() == created_data

    # Read Collection
    resp = await client.get("/api/scene")
    assert resp.status == 200
    assert await resp.json() == [created_data]


@pytest.mark.asyncio
async def test_create_scene_invalid_schema(aiohttp_client, app):
    """Test schema validation during scene creation."""
    client = await aiohttp_client(app)
    # Missing required field 'name'
    invalid_data = {"id": "invalid"}
    resp = await client.post("/api/scene", json=invalid_data)
    assert resp.status == 400
    result = await resp.json()
    assert "Validation failed" in result["error"]


@pytest.mark.asyncio
async def test_create_scene_with_items(aiohttp_client, app):
    """Test creating a scene with complex items."""
    client = await aiohttp_client(app)

    scene_data = {
        "id": "complex-scene",
        "name": "Complex Scene",
        "layout": "living-room",
        "items": [
            {
                "id": "comp-1",
                "type": "image",
                "displays": ["display-1", "display-2"],
                "images": [
                    {
                        "image_id": "img-123",
                        "scaling_factor": 1.5,
                        "offset": {"x": 10.5, "y": 20.0},
                    }
                ],
            }
        ],
    }

    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201

    result = await resp.json()
    assert result["id"] != "complex-scene"
    assert result["name"] == "Complex Scene"
    assert result["items"][0]["id"] == "comp-1"
    assert result["items"][0]["type"] == "image"
    assert result["items"][0]["images"][0]["scaling_factor"] == 1.5
    assert result["status"] == "draft"


@pytest.mark.asyncio
async def test_delete_scene(aiohttp_client, app):
    """Test scene deletion."""
    client = await aiohttp_client(app)
    scene_data = {
        "id": "del_me",
        "name": "Delete Me",
        "layout": "temp-layout",
    }
    resp = await client.post("/api/scene", json=scene_data)
    scene_id = (await resp.json())["id"]

    resp = await client.delete(f"/api/scene/{scene_id}")
    assert resp.status == 200
    assert (await resp.json())["status"] == "deleted"

    # Verify gone
    resp = await client.get(f"/api/scene/{scene_id}")
    assert resp.status == 404
