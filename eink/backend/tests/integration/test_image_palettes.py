import pytest
from sqlalchemy import select
from backend import models


@pytest.mark.asyncio
async def test_image_palette_population_on_scene_create(aiohttp_client, app):
    """Test that image_palettes table is populated when a scene is created."""
    client = await aiohttp_client(app)

    # 1. Create a display type
    dt_data = {
        "id": "dt-mono",
        "name": "Mono Display",
        "width_mm": 100,
        "height_mm": 100,
        "panel_width_mm": 100,
        "panel_height_mm": 100,
        "width_px": 800,
        "height_px": 800,
        "colour_type": "MONO",
        "frame": {"border_width_mm": 0, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }
    resp = await client.post("/api/display_type", json=dt_data)
    assert resp.status == 201, await resp.text()
    dt_id = (await resp.json())["id"]

    # 2. Create a layout
    layout_data = {
        "id": "layout-1",
        "name": "Test Layout",
        "canvas_width_mm": 500,
        "canvas_height_mm": 500,
        "items": [
            {
                "id": "display-1",
                "display_type_id": dt_id,
                "x_mm": 0,
                "y_mm": 0,
                "orientation": "landscape",
            }
        ],
    }
    resp = await client.post("/api/layout", json=layout_data)
    assert resp.status == 201, await resp.text()
    layout_id = (await resp.json())["id"]

    # 3. Create a scene with an image
    scene_data = {
        "name": "Test Scene",
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
            }
        ],
    }
    print(f"DEBUG TEST: Creating scene with layout {layout_id}")
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201, await resp.text()

    # 4. Verify image_palettes table
    from backend.database import get_session

    async with get_session() as session:
        stmt = select(models.ImagePalette).where(
            models.ImagePalette.image_id == "img-1",
            models.ImagePalette.palette == "MONO",
        )
        result = await session.execute(stmt)
        entry = result.scalars().first()
        assert entry is not None
        assert entry.image_id == "img-1"
        assert entry.palette == "MONO"
        assert entry.filename == ""


@pytest.mark.asyncio
async def test_image_palette_no_duplicates(aiohttp_client, app):
    """Test that duplicate entries are not created in image_palettes."""
    client = await aiohttp_client(app)

    # Setup display type and layout
    dt_data = {
        "id": "dt-color",
        "name": "Color Display",
        "width_mm": 100,
        "height_mm": 100,
        "panel_width_mm": 100,
        "panel_height_mm": 100,
        "width_px": 800,
        "height_px": 800,
        "colour_type": "BWGBRY",
        "frame": {"border_width_mm": 0, "colour": "#000000"},
        "mat": {"colour": "#FFFFFF"},
    }
    resp = await client.post("/api/display_type", json=dt_data)
    assert resp.status == 201
    dt_id = (await resp.json())["id"]

    layout_data = {
        "name": "Test Layout",
        "canvas_width_mm": 500,
        "canvas_height_mm": 500,
        "items": [
            {
                "id": "display-1",
                "display_type_id": dt_id,
                "x_mm": 0,
                "y_mm": 0,
                "orientation": "landscape",
            }
        ],
    }
    resp = await client.post("/api/layout", json=layout_data)
    layout_id = (await resp.json())["id"]

    scene_data = {
        "name": "Test Scene",
        "layout": layout_id,
        "items": [
            {
                "id": "item-1",
                "type": "image",
                "displays": ["display-1"],
                "images": [
                    {
                        "image_id": "img-2",
                        "scaling_factor": 1.0,
                        "offset": {"x": 0, "y": 0},
                    }
                ],
            }
        ],
    }

    # Create twice
    resp1 = await client.post("/api/scene", json=scene_data)
    scene_id = (await resp1.json())["id"]

    # Update once
    await client.put(f"/api/scene/{scene_id}", json=scene_data)

    # Verify only one entry exists
    from backend.database import get_session

    async with get_session() as session:
        stmt = select(models.ImagePalette).where(
            models.ImagePalette.image_id == "img-2",
            models.ImagePalette.palette == "BWGBRY",
        )
        result = await session.execute(stmt)
        entries = result.scalars().all()
        assert len(entries) == 1
