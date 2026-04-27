import pytest
from backend import models, database


@pytest.mark.asyncio
async def test_scene_queue_count(aiohttp_client, app):
    """Test GET /api/scene/{scene_id}/queue."""
    client = await aiohttp_client(app)

    # 1. Setup: Create a scene
    scene_data = {
        "name": "Queue Test Scene",
        "layout": "test-layout",
    }
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201
    scene_id = (await resp.json())["id"]

    # 2. Test empty queue
    resp = await client.get(f"/api/scene/{scene_id}/queue")
    assert resp.status == 200
    assert await resp.json() == {"count": 0}

    # 3. Setup: Add items to queue
    async with database.get_session() as session:
        queue_items = [
            models.SceneQueue(scene_id=scene_id, image_id="img1", display_id="disp1"),
            models.SceneQueue(scene_id=scene_id, image_id="img2", display_id="disp1"),
            models.SceneQueue(scene_id=scene_id, image_id="img1", display_id="disp2"),
        ]
        session.add_all(queue_items)
        await session.commit()

    # 4. Test queue with items
    resp = await client.get(f"/api/scene/{scene_id}/queue")
    assert resp.status == 200
    assert await resp.json() == {"count": 3}

    # 5. Test another scene (should be isolated)
    scene_data2 = {
        "name": "Queue Test Scene 2",
        "layout": "test-layout",
    }
    resp = await client.post("/api/scene", json=scene_data2)
    assert resp.status == 201
    scene_id2 = (await resp.json())["id"]

    resp = await client.get(f"/api/scene/{scene_id2}/queue")
    assert resp.status == 200
    assert await resp.json() == {"count": 0}


@pytest.mark.asyncio
async def test_scene_queue_count_not_found(aiohttp_client, app):
    """Test GET /api/scene/{scene_id}/queue with non-existent scene."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/scene/non-existent-scene/queue")
    assert resp.status == 404
    assert (await resp.json())["error"] == "Scene Not Found"


@pytest.mark.asyncio
async def test_scene_queue_count_invalid_id(aiohttp_client, app):
    """Test GET /api/scene/{scene_id}/queue with invalid ID format."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/scene/invalid!id/queue")
    assert resp.status == 400
    assert "Invalid ID format" in (await resp.json())["error"]
