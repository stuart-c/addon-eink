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

    scene_data = {"id": "morning-routine", "name": "Morning Routine"}

    # Create
    resp = await client.post("/api/scene", json=scene_data)
    assert resp.status == 201
    assert await resp.json() == scene_data

    # Read specific
    resp = await client.get("/api/scene/morning-routine")
    assert resp.status == 200
    assert await resp.json() == scene_data

    # Read Collection
    resp = await client.get("/api/scene")
    assert resp.status == 200
    assert await resp.json() == [scene_data]


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
async def test_delete_scene(aiohttp_client, app):
    """Test scene deletion."""
    client = await aiohttp_client(app)
    scene_data = {"id": "del_me", "name": "Delete Me"}
    await client.post("/api/scene", json=scene_data)

    resp = await client.delete("/api/scene/del_me")
    assert resp.status == 200
    assert (await resp.json())["status"] == "deleted"

    # Verify gone
    resp = await client.get("/api/scene/del_me")
    assert resp.status == 404
