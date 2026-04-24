import pytest


@pytest.mark.asyncio
async def test_create_scene_display_not_in_layout(aiohttp_client, app):
    """Test creating a scene with a display ID that doesn't exist in the layout."""
    client = await aiohttp_client(app)

    # 1. Create a layout
    layout_data = {
        "name": "Validation Layout",
        "canvas_width_mm": 500,
        "canvas_height_mm": 500,
        "items": [
            {
                "id": "display-1",
                "display_type_id": "epd_2in13",
                "x_mm": 0,
                "y_mm": 0,
                "orientation": "landscape",
            }
        ],
    }
    resp = await client.post("/api/layout", json=layout_data)
    assert resp.status == 201
    layout_id = (await resp.json())["id"]

    # 2. Try to create a scene with an invalid display ID
    scene_data = {
        "name": "Invalid Scene",
        "layout": layout_id,
        "items": [
            {
                "id": "item-1",
                "type": "image",
                "displays": ["display-NONEXISTENT"],
                "images": [
                    {
                        "image_id": "img-1",
                        "scaling_factor": 1.0,
                        "offset": {"x": 0, "y": 0},
                    }
                ],
            }
        ],
    }
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 400
    result = await resp.json()
    assert "not in layout" in result.get("message", "").lower()


@pytest.mark.asyncio
async def test_create_scene_duplicate_display(aiohttp_client, app):
    """Test creating a scene where a display is mentioned twice."""
    client = await aiohttp_client(app)

    # 1. Create a layout
    layout_data = {
        "name": "Validation Layout",
        "canvas_width_mm": 500,
        "canvas_height_mm": 500,
        "items": [
            {
                "id": "display-1",
                "display_type_id": "epd_2in13",
                "x_mm": 0,
                "y_mm": 0,
                "orientation": "landscape",
            }
        ],
    }
    resp = await client.post("/api/layout", json=layout_data)
    assert resp.status == 201
    layout_id = (await resp.json())["id"]

    # 2. Try to create a scene with a duplicate display ID in different items
    scene_data = {
        "name": "Duplicate Scene",
        "layout": layout_id,
        "items": [
            {
                "id": "item-1",
                "type": "image",
                "displays": ["display-1"],
                "images": [
                    {
                        "image_id": "img-1",
                        "scaling_factor": 1.0,
                        "offset": {"x": 0, "y": 0},
                    }
                ],
            },
            {
                "id": "item-2",
                "type": "image",
                "displays": ["display-1"],
                "images": [
                    {
                        "image_id": "img-2",
                        "scaling_factor": 1.0,
                        "offset": {"x": 0, "y": 0},
                    }
                ],
            },
        ],
    }
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 400
    result = await resp.json()
    assert "mentioned more than once" in result.get("message", "").lower()


@pytest.mark.asyncio
async def test_update_scene_validation(aiohttp_client, app):
    """Test that validation also applies to scene updates."""
    client = await aiohttp_client(app)

    # 1. Create a layout
    layout_data = {
        "name": "Validation Layout",
        "canvas_width_mm": 500,
        "canvas_height_mm": 500,
        "items": [
            {
                "id": "display-1",
                "display_type_id": "epd_2in13",
                "x_mm": 0,
                "y_mm": 0,
                "orientation": "landscape",
            }
        ],
    }
    resp = await client.post("/api/layout", json=layout_data)
    assert resp.status == 201
    layout_id = (await resp.json())["id"]

    # 2. Create a valid scene
    scene_data = {
        "name": "Initial Scene",
        "layout": layout_id,
        "items": [],
    }
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201
    scene_id = (await resp.json())["id"]

    # 3. Update with invalid display (non-existent)
    update_data = {
        "items": [
            {
                "id": "item-1",
                "type": "image",
                "displays": ["display-NONEXISTENT"],
                "images": [
                    {
                        "image_id": "img-1",
                        "scaling_factor": 1.0,
                        "offset": {"x": 0, "y": 0},
                    }
                ],
            }
        ],
    }
    resp = await client.put(f"/api/scene/{scene_id}", json=update_data)
    assert resp.status == 400
    result = await resp.json()
    assert "not in layout" in result.get("message", "").lower()

    # 4. Update with duplicate display
    update_data = {
        "items": [
            {
                "id": "item-1",
                "type": "image",
                "displays": ["display-1"],
                "images": [
                    {
                        "image_id": "img-1",
                        "scaling_factor": 1.0,
                        "offset": {"x": 0, "y": 0},
                    }
                ],
            },
            {
                "id": "item-2",
                "type": "image",
                "displays": ["display-1"],
                "images": [
                    {
                        "image_id": "img-2",
                        "scaling_factor": 1.0,
                        "offset": {"x": 0, "y": 0},
                    }
                ],
            },
        ],
    }
    resp = await client.put(f"/api/scene/{scene_id}", json=update_data)
    assert resp.status == 400
    result = await resp.json()
    assert "mentioned more than once" in result.get("message", "").lower()


@pytest.mark.asyncio
async def test_create_scene_invalid_color(aiohttp_client, app):
    """Test that invalid hex colors are rejected."""
    client = await aiohttp_client(app)

    # 1. Create a layout
    layout_data = {
        "name": "Validation Layout",
        "canvas_width_mm": 500,
        "canvas_height_mm": 500,
        "items": [
            {
                "id": "display-1",
                "display_type_id": "epd_2in13",
                "x_mm": 0,
                "y_mm": 0,
                "orientation": "landscape",
            }
        ],
    }
    resp = await client.post("/api/layout", json=layout_data)
    assert resp.status == 201
    layout_id = (await resp.json())["id"]

    # 2. Try to create a scene with an invalid hex color
    scene_data = {
        "name": "Invalid Color Scene",
        "layout": layout_id,
        "items": [
            {
                "id": "item-1",
                "type": "image",
                "displays": ["display-1"],
                "images": [
                    {
                        "image_id": "img-1",
                        "scaling_factor": 1.0,
                        "offset": {"x": 0, "y": 0},
                        "background_color": "not-a-color",
                    }
                ],
            }
        ],
    }
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 400
    result = await resp.json()
    assert "Validation failed" in result["error"]
