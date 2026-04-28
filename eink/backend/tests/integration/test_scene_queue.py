import os
import pytest
from sqlalchemy import select
from backend import models, database
from backend.utils.storage import get_storage_path


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


@pytest.mark.asyncio
async def test_scene_save_populates_queue(aiohttp_client, app):
    """Test that creating or updating an active scene populates the queue."""
    client = await aiohttp_client(app)

    # 1. Create a layout and an image
    layout_data = {
        "name": "Queue Layout",
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
    layout_id = (await resp.json())["id"]

    # Manually add an image to DB
    async with database.get_session() as session:
        img = models.Image(
            id="img-1",
            name="Test Image",
            file_type="png",
            width=100,
            height=100,
            file_path="test.png",
            status="ACTIVE",
            file_hash="hash1",
        )
        session.add(img)
        await session.commit()

    # 2. Create an active scene
    scene_data = {
        "name": "Auto Queue Scene",
        "layout": layout_id,
        "items": [
            {
                "id": "comp-1",
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
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201
    scene_json = await resp.json()
    scene_id = scene_json["id"]
    assert scene_json["status"] == "active"

    # 3. Verify queue is populated
    resp = await client.get(f"/api/scene/{scene_id}/queue")
    assert resp.status == 200
    assert (await resp.json())["count"] == 1

    # 4. Update the scene (e.g. change name, but hashes stay same)
    # The queue should still exist (it's cleared and re-added because it's still "needs work"
    # as no SceneDisplayImage record exists yet)
    update_data = {
        "name": "Updated Auto Queue Scene",
        "layout": layout_id,
        "items": scene_data["items"],
    }
    resp = await client.put(f"/api/scene/{scene_id}", json=update_data)
    assert resp.status == 200

    resp = await client.get(f"/api/scene/{scene_id}/queue")
    assert (await resp.json())["count"] == 1

    # 5. Simulate work completed
    async with database.get_session() as session:
        # Fetch the updated scene to get its current scene_hash
        stmt = select(models.Scene).where(models.Scene.id == scene_id)
        result = await session.execute(stmt)
        scene_db = result.scalar_one()

        # Add SceneDisplayImage record
        sdi = models.SceneDisplayImage(
            scene_id=scene_id,
            display_id="display-1",
            image_id="img-1",
            file_hash="out-hash",
            scene_hash=scene_db.scene_hash,
            image_hash=img.settings_hash,
            filename="slice.png",
        )
        session.add(sdi)
        await session.commit()

    # Create dummy file to pass the existence check in update_scene_queue
    path = os.path.join(get_storage_path("scene_display"), "slice.png")
    with open(path, "w") as f:
        f.write("dummy")

    # 6. Save scene again - should now have 0 in queue as it's up to date
    resp = await client.put(f"/api/scene/{scene_id}", json=update_data)
    assert resp.status == 200

    resp = await client.get(f"/api/scene/{scene_id}/queue")
    assert (await resp.json())["count"] == 0

    # 7. Update image settings (which changes settings_hash)
    # This should make it "need work" again
    async with database.get_session() as session:
        stmt = select(models.Image).where(models.Image.id == "img-1")
        result = await session.execute(stmt)
        img_db = result.scalar_one()
        img_db.brightness = 1.5
        # Event listener will update settings_hash
        await session.commit()

    # Save scene - should be in queue again
    resp = await client.put(f"/api/scene/{scene_id}", json=update_data)
    assert resp.status == 200

    resp = await client.get(f"/api/scene/{scene_id}/queue")
    assert (await resp.json())["count"] == 1
