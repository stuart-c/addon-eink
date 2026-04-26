import pytest


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
        "width_mm": 100,
        "height_mm": 50,
        "panel_width_mm": 50,
        "panel_height_mm": 25,
        "width_px": 250,
        "height_px": 122,
        "colour_type": "BWR",
        "frame": {"border_width_mm": 5, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }

    # Create
    resp = await client.post("/api/display_type", json=display_data)
    assert resp.status == 201
    created_data = await resp.json()
    item_id = created_data["id"]
    assert item_id != display_data["id"]
    assert created_data["name"] == display_data["name"]

    # Read
    resp = await client.get(f"/api/display_type/{item_id}")
    assert resp.status == 200
    assert await resp.json() == created_data

    # Read Collection
    resp = await client.get("/api/display_type")
    assert resp.status == 200
    assert await resp.json() == [created_data]


@pytest.mark.asyncio
async def test_create_display_type_portrait_swap(aiohttp_client, app):
    """Test that portrait display type is swapped to landscape on creation."""
    client = await aiohttp_client(app)

    # Portrait data (height > width)
    portrait_data = {
        "id": "portrait_epd",
        "name": "Portrait EPD",
        "width_mm": 50,
        "height_mm": 100,
        "panel_width_mm": 25,
        "panel_height_mm": 50,
        "width_px": 122,
        "height_px": 250,
        "colour_type": "BWR",
        "frame": {"border_width_mm": 5, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }

    # Expected swapped data
    expected_data = portrait_data.copy()
    expected_data.update(
        {
            "width_mm": 100,
            "height_mm": 50,
            "panel_width_mm": 50,
            "panel_height_mm": 25,
            "width_px": 250,
            "height_px": 122,
        }
    )

    resp = await client.post("/api/display_type", json=portrait_data)
    assert resp.status == 201
    created_data = await resp.json()
    item_id = created_data["id"]
    assert item_id != portrait_data["id"]
    assert created_data["width_mm"] == 100
    assert created_data["height_mm"] == 50

    # Verify storage
    resp = await client.get(f"/api/display_type/{item_id}")
    assert resp.status == 200
    assert await resp.json() == created_data


@pytest.mark.asyncio
async def test_create_item_duplicate(aiohttp_client, app):
    """Test creating an item that already exists (409)."""
    client = await aiohttp_client(app)
    data = {
        "id": "dup",
        "name": "Duplicate",
        "width_mm": 50,
        "height_mm": 50,
        "panel_width_mm": 10,
        "panel_height_mm": 10,
        "width_px": 10,
        "height_px": 10,
        "colour_type": "MONO",
        "frame": {"border_width_mm": 5, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }
    await client.post("/api/display_type", json=data)
    resp = await client.post("/api/display_type", json=data)
    # 409 is no longer returned because client-provided IDs are ignored
    assert resp.status == 201


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
        "width_mm": 50,
        "height_mm": 50,
        "panel_width_mm": 10,
        "panel_height_mm": 10,
        "width_px": 10,
        "height_px": 10,
        "colour_type": "MONO",
        "frame": {"border_width_mm": 5, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }
    resp = await client.post("/api/display_type", json=data)
    item_id = (await resp.json())["id"]

    update_payload = data.copy()
    update_payload["id"] = item_id
    update_payload["name"] = "Updated"
    resp = await client.put(f"/api/display_type/{item_id}", json=update_payload)
    assert resp.status == 200
    assert (await resp.json())["name"] == "Updated"


@pytest.mark.asyncio
async def test_update_item_id_mismatch(aiohttp_client, app):
    """Test update with ID mismatch between URL and body."""
    client = await aiohttp_client(app)
    # Create the item first so we don't get a 404
    resp = await client.post(
        "/api/display_type",
        json={
            "name": "Name",
            "width_mm": 100,
            "height_mm": 100,
            "panel_width_mm": 50,
            "panel_height_mm": 50,
            "width_px": 100,
            "height_px": 100,
            "colour_type": "MONO",
            "frame": {"border_width_mm": 5, "colour": "#000000"},
            "mat": {"colour": "#FFFFFF"},
        },
    )
    correct_id = (await resp.json())["id"]
    data = {
        "id": "wrong_id",
        "name": "Name",
        "width_mm": 100,
        "height_mm": 100,
        "panel_width_mm": 50,
        "panel_height_mm": 50,
        "width_px": 100,
        "height_px": 100,
        "colour_type": "MONO",
        "frame": {"border_width_mm": 5, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }
    resp = await client.put(f"/api/display_type/{correct_id}", json=data)
    assert resp.status == 400
    result = await resp.json()
    assert "ID in body does not match ID in URL" in result["error"]


@pytest.mark.asyncio
async def test_delete_item(aiohttp_client, app):
    """Test item deletion."""
    client = await aiohttp_client(app)
    data = {
        "id": "del_me",
        "name": "Delete",
        "width_mm": 50,
        "height_mm": 50,
        "panel_width_mm": 10,
        "panel_height_mm": 10,
        "width_px": 10,
        "height_px": 10,
        "colour_type": "MONO",
        "frame": {"border_width_mm": 5, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }
    resp = await client.post("/api/display_type", json=data)
    item_id = (await resp.json())["id"]

    resp = await client.delete(f"/api/display_type/{item_id}")
    assert resp.status == 200
    assert (await resp.json())["status"] == "deleted"

    # Verify gone
    resp = await client.get(f"/api/display_type/{item_id}")
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
        "width_mm": 50,
        "height_mm": 50,
        "panel_width_mm": 10,
        "panel_height_mm": 10,
        "width_px": 10,
        "height_px": 10,
        "colour_type": "MONO",
        "frame": {"border_width_mm": 5, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }
    update_payload = valid_data.copy()
    del update_payload["id"]
    resp = await client.put("/api/display_type/non_existent", json=update_payload)
    assert resp.status == 404

    resp = await client.delete("/api/display_type/non_existent")
    assert resp.status == 404


@pytest.mark.asyncio
async def test_delete_display_type_protection(aiohttp_client, app):
    """Test that a display type cannot be deleted if used in a layout."""
    client = await aiohttp_client(app)

    # 1. Create a display type
    dt_data = {
        "id": "protected_dt",
        "name": "Protected",
        "width_mm": 100,
        "height_mm": 50,
        "panel_width_mm": 50,
        "panel_height_mm": 25,
        "width_px": 250,
        "height_px": 122,
        "colour_type": "MONO",
        "frame": {"border_width_mm": 5, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }
    resp = await client.post("/api/display_type", json=dt_data)
    assert resp.status == 201
    dt_id = (await resp.json())["id"]

    # 2. Create a layout referencing it
    layout_data = {
        "name": "Using Layout",
        "canvas_width_mm": 100,
        "canvas_height_mm": 100,
        "items": [
            {
                "display_type_id": dt_id,
                "x_mm": 0,
                "y_mm": 0,
                "orientation": "landscape",
            }
        ],
    }
    resp = await client.post("/api/layout", json=layout_data)
    assert resp.status == 201
    layout_id = (await resp.json())["id"]

    # Verify display type exists before delete attempt
    resp = await client.get(f"/api/display_type/{dt_id}")
    assert resp.status == 200, "Display type should exist before delete"

    # 3. Attempt to delete display type (should fail)
    resp = await client.delete(f"/api/display_type/{dt_id}")
    assert resp.status == 400
    result = await resp.json()
    assert "Conflict" in result["error"]
    assert "Using Layout" in result["message"]

    # 4. Delete the layout
    resp = await client.delete(f"/api/layout/{layout_id}")
    assert resp.status == 200

    # 5. Attempt to delete display type again (should succeed)
    resp = await client.delete(f"/api/display_type/{dt_id}")
    assert resp.status == 200
    assert (await resp.json())["status"] == "deleted"


@pytest.mark.asyncio
async def test_delete_layout_protection(aiohttp_client, app):
    """Test that a layout cannot be deleted if used in a scene."""
    client = await aiohttp_client(app)

    # 1. Create a layout
    layout_data = {
        "id": "protected_layout",
        "name": "Protected Layout",
        "canvas_width_mm": 100,
        "canvas_height_mm": 100,
        "items": [],
    }
    resp = await client.post("/api/layout", json=layout_data)
    assert resp.status == 201
    layout_id = (await resp.json())["id"]

    # 2. Create a scene referencing it
    scene_data = {
        "name": "Using Scene",
        "layout": layout_id,
    }
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201
    scene_id = (await resp.json())["id"]

    # 3. Attempt to delete layout (should fail)
    resp = await client.delete(f"/api/layout/{layout_id}")
    assert resp.status == 400
    result = await resp.json()
    assert "Conflict" in result["error"]
    assert "Using Scene" in result["message"]

    # 4. Delete the scene
    resp = await client.delete(f"/api/scene/{scene_id}")
    assert resp.status == 200

    # 5. Attempt to delete layout again (should succeed)
    resp = await client.delete(f"/api/layout/{layout_id}")
    assert resp.status == 200
    assert (await resp.json())["status"] == "deleted"


@pytest.mark.asyncio
async def test_create_layout_with_extra_fields(aiohttp_client, app):
    """Test that creating a layout with extra fields doesn't crash."""
    client = await aiohttp_client(app)

    layout_data = {
        "name": "Extra Fields Layout",
        "canvas_width_mm": 500,
        "canvas_height_mm": 500,
        "items": [],
        "grid_snap_mm": 10,  # Frontend-only field
        "unknown_extra_field": "some_value",
    }

    resp = await client.post("/api/layout", json=layout_data)
    assert resp.status == 201
    created_data = await resp.json()

    assert created_data["name"] == layout_data["name"]
    # Verify extra fields are not in the response (optional but good)
    assert "grid_snap_mm" not in created_data
    assert "unknown_extra_field" not in created_data

    # Verify ID
    item_id = created_data["id"]
    resp = await client.get(f"/api/layout/{item_id}")
    assert resp.status == 200
    fetched_data = await resp.json()
    assert "grid_snap_mm" not in fetched_data
