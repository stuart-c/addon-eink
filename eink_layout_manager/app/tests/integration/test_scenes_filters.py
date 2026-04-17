import pytest


@pytest.mark.asyncio
async def test_get_scenes_filtered_by_layout(aiohttp_client, app):
    """Test filtering scenes by layout (exact match)."""
    client = await aiohttp_client(app)

    # Create two scenes with different layouts
    scene1 = {"name": "Scene 1", "layout": "layout-a"}
    scene2 = {"name": "Scene 2", "layout": "layout-b"}
    
    await client.post("/api/scene", json=scene1)
    await client.post("/api/scene", json=scene2)

    # Filter by layout-a
    resp = await client.get("/api/scene", params={"layout": "layout-a"})
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 1
    assert data[0]["name"] == "Scene 1"
    assert data[0]["layout"] == "layout-a"

    # Filter by layout-b
    resp = await client.get("/api/scene", params={"layout": "layout-b"})
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 1
    assert data[0]["name"] == "Scene 2"
    assert data[0]["layout"] == "layout-b"

    # Filter by non-existent layout
    resp = await client.get("/api/scene", params={"layout": "non-existent"})
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 0


@pytest.mark.asyncio
async def test_get_scenes_filtered_by_title(aiohttp_client, app):
    """Test filtering scenes by title (case-insensitive substring match)."""
    client = await aiohttp_client(app)

    # Create scenes with different names
    await client.post("/api/scene", json={"name": "Morning Routine", "layout": "l1"})
    await client.post("/api/scene", json={"name": "Evening Setup", "layout": "l1"})
    await client.post("/api/scene", json={"name": "Night Mode", "layout": "l1"})

    # Substring match (case-insensitive)
    resp = await client.get("/api/scene", params={"title": "routine"})
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 1
    assert data[0]["name"] == "Morning Routine"

    # Case insensitive
    resp = await client.get("/api/scene", params={"title": "NIGHT"})
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 1
    assert data[0]["name"] == "Night Mode"

    # Substring in multiple items
    resp = await client.get("/api/scene", params={"title": "e"})
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 3 # Morning RoutinE, Evening sEtup, Night ModE (if they all contain 'e')
    # Let's check: 'Morning Routine' (e), 'Evening Setup' (e), 'Night Mode' (e) - Yes.


@pytest.mark.asyncio
async def test_get_scenes_combined_filters(aiohttp_client, app):
    """Test combining layout and title filters."""
    client = await aiohttp_client(app)

    await client.post("/api/scene", json={"name": "Alpha One", "layout": "layout-1"})
    await client.post("/api/scene", json={"name": "Alpha Two", "layout": "layout-2"})
    await client.post("/api/scene", json={"name": "Beta One", "layout": "layout-1"})

    # Combined filters
    resp = await client.get("/api/scene", params={"title": "Alpha", "layout": "layout-1"})
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 1
    assert data[0]["name"] == "Alpha One"

    resp = await client.get("/api/scene", params={"title": "One", "layout": "layout-1"})
    assert resp.status == 200
    data = await resp.json()
    assert len(data) == 2
    names = [d["name"] for d in data]
    assert "Alpha One" in names
    assert "Beta One" in names
