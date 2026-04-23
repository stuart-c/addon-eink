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

    # Pre-requisite: Create the layout
    layout_data = {
        "id": "living-room",
        "name": "Living Room",
        "canvas_width_mm": 500,
        "canvas_height_mm": 500,
        "items": [
            {
                "id": "display-1",
                "display_type_id": "epd_2in13",
                "x_mm": 0,
                "y_mm": 0,
                "orientation": "landscape",
            },
            {
                "id": "display-2",
                "display_type_id": "epd_2in13",
                "x_mm": 100,
                "y_mm": 0,
                "orientation": "landscape",
            },
        ],
    }
    resp = await client.post("/api/layout", json=layout_data)
    assert resp.status == 201
    layout_id = (await resp.json())["id"]

    scene_data = {
        "id": "complex-scene",
        "name": "Complex Scene",
        "layout": layout_id,
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
    assert result["status"] == "active"


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


@pytest.mark.asyncio
async def test_update_scene(aiohttp_client, app):
    """Test updating a scene's name and attempting to update its layout."""
    client = await aiohttp_client(app)

    # 1. Create a scene
    scene_data = {
        "name": "Original Name",
        "layout": "layout-1",
    }
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201
    created_data = await resp.json()
    scene_id = created_data["id"]

    # 2. Update name (should succeed)
    update_data = {
        "name": "Updated Name",
        "layout": "layout-1",  # Same layout should be fine
    }
    resp = await client.put(f"/api/scene/{scene_id}", json=update_data)
    assert resp.status == 200
    updated_data = await resp.json()
    assert updated_data["name"] == "Updated Name"
    assert updated_data["layout"] == "layout-1"

    # 3. Attempt to update layout (should fail)
    invalid_update = {
        "name": "Updated Name Again",
        "layout": "layout-2",  # Different layout should fail
    }
    resp = await client.put(f"/api/scene/{scene_id}", json=invalid_update)
    assert resp.status == 400
    result = await resp.json()
    assert "Attempted to update read-only fields" in result["error"]
    assert "layout" in result["error"]

    # 4. Verify name was NOT updated in the failed attempt (optional but good)
    resp = await client.get(f"/api/scene/{scene_id}")
    final_data = await resp.json()
    assert final_data["name"] == "Updated Name"
    assert final_data["layout"] == "layout-1"
