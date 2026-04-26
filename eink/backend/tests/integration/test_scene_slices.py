import pytest
from backend import models, database


@pytest.mark.asyncio
async def test_get_scene_slices_not_found(aiohttp_client, app):
    """Test GET /api/scene/{id}/slice for a non-existent scene."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/scene/non-existent/slice")
    assert resp.status == 404
    assert (await resp.json())["error"] == "Scene Not Found"


@pytest.mark.asyncio
async def test_get_scene_slices_empty(aiohttp_client, app):
    """Test GET /api/scene/{id}/slice for a scene with no slices."""
    client = await aiohttp_client(app)

    # Create a scene
    scene_data = {"name": "Empty Slice Scene", "layout": "l1"}
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201
    scene_id = (await resp.json())["id"]

    resp = await client.get(f"/api/scene/{scene_id}/slice")
    assert resp.status == 200
    assert await resp.json() == []


@pytest.mark.asyncio
async def test_get_scene_slices_with_data(aiohttp_client, app):
    """Test GET /api/scene/{id}/slice with existing slice data."""
    client = await aiohttp_client(app)

    # 1. Create a scene
    scene_data = {"name": "Slice Scene", "layout": "l1"}
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201
    scene_id = (await resp.json())["id"]

    # 2. Directly insert slice data into the DB
    async with database.get_session() as session:
        slice1 = models.SceneDisplayImage(
            scene_id=scene_id,
            display_id="display-1",
            image_id="img-1",
            image_hash="hash-1",
            scene_hash="scene-hash-1",
            file_hash="file-hash-1",
            filename="slice-1.png",
        )
        slice2 = models.SceneDisplayImage(
            scene_id=scene_id,
            display_id="display-2",
            image_id="img-2",
            image_hash="hash-2",
            scene_hash="scene-hash-2",
            file_hash=None,  # Test null file_hash
            filename="slice-2.png",
        )
        session.add(slice1)
        session.add(slice2)
        await session.commit()

    # 3. Call the API
    resp = await client.get(f"/api/scene/{scene_id}/slice")
    assert resp.status == 200
    data = await resp.json()

    assert len(data) == 2
    # Sort by display_id for consistent assertion
    data.sort(key=lambda x: x["display_id"])

    assert data[0]["display_id"] == "display-1"
    assert data[0]["image_id"] == "img-1"
    assert data[0]["file_hash"] == "file-hash-1"

    assert data[1]["display_id"] == "display-2"
    assert data[1]["image_id"] == "img-2"
    assert data[1]["file_hash"] is None
