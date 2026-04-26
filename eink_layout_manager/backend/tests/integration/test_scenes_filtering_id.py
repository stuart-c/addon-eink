"""Integration tests for scene ID filtering."""
import pytest


@pytest.mark.asyncio
async def test_get_scenes_filtered_by_id(aiohttp_client, app):
    """Test filtering scenes by ID (exact match)."""
    client = await aiohttp_client(app)

    # Create two scenes
    resp1 = await client.post(
        "/api/scene",
        json={"name": "Scene A", "layout": "l1"}
    )
    resp2 = await client.post(
        "/api/scene",
        json={"name": "Scene B", "layout": "l1"}
    )

    scene1_data = await resp1.json()
    scene2_data = await resp2.json()

    scene1_id = scene1_data["id"]
    scene2_id = scene2_data["id"]

    # Filter by scene1_id
    resp = await client.get("/api/scene", params={"scene_id": scene1_id})
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 1
    assert data[0]["id"] == scene1_id
    assert data[0]["name"] == "Scene A"

    # Filter by scene2_id
    resp = await client.get("/api/scene", params={"scene_id": scene2_id})
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 1
    assert data[0]["id"] == scene2_id
    assert data[0]["name"] == "Scene B"

    # Filter by non-existent ID
    resp = await client.get(
        "/api/scene",
        params={"scene_id": "00000000-0000-0000-0000-000000000000"}
    )
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 0


@pytest.mark.asyncio
async def test_get_scenes_combined_id_filter(aiohttp_client, app):
    """Test combining scene_id filter with layout filter."""
    client = await aiohttp_client(app)

    # Create scene
    resp = await client.post(
        "/api/scene",
        json={"name": "Alpha", "layout": "layout-1"}
    )
    scene_data = await resp.json()
    scene_id = scene_data["id"]

    # Correct ID, correct layout
    resp = await client.get(
        "/api/scene",
        params={"scene_id": scene_id, "layout": "layout-1"}
    )
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 1

    # Correct ID, wrong layout
    resp = await client.get(
        "/api/scene",
        params={"scene_id": scene_id, "layout": "layout-2"}
    )
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 0
