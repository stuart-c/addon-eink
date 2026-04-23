import pytest
import uuid
from backend import database, models


@pytest.mark.asyncio
async def test_image_list_filter_status_ready(aiohttp_client, app):
    """Test that only ACTIVE images are returned by default."""
    client = await aiohttp_client(app)

    async with database.get_session() as session:
        img1 = models.Image(
            id=uuid.uuid4().hex,
            name="active",
            file_type="PNG",
            width=100,
            height=100,
            file_path="active.png",
            status="ACTIVE",
            file_hash="h1",
        )
        img2 = models.Image(
            id=uuid.uuid4().hex,
            name="uploaded",
            file_type="PNG",
            width=100,
            height=100,
            file_path="uploaded.png",
            status="UPLOADED",
            file_hash="h2",
        )
        session.add_all([img1, img2])
        await session.commit()

    resp = await client.get("/api/image")
    assert resp.status == 200
    result = await resp.json()
    assert len(result["items"]) == 1
    assert result["items"][0]["name"] == "active"


@pytest.mark.asyncio
async def test_image_list_filter_dimensions(aiohttp_client, app):
    """Test min/max width/height filters."""
    client = await aiohttp_client(app)

    async with database.get_session() as session:
        img1 = models.Image(
            id=uuid.uuid4().hex,
            name="small",
            file_type="PNG",
            width=100,
            height=100,
            file_path="s.png",
            status="ACTIVE",
            file_hash="h3",
        )
        img2 = models.Image(
            id=uuid.uuid4().hex,
            name="large",
            file_type="PNG",
            width=500,
            height=500,
            file_path="l.png",
            status="ACTIVE",
            file_hash="h4",
        )
        session.add_all([img1, img2])
        await session.commit()

    # Min width
    resp = await client.get("/api/image?min_width=200")
    result = await resp.json()
    assert len(result["items"]) == 1
    assert result["items"][0]["name"] == "large"

    # Max height
    resp = await client.get("/api/image?max_height=200")
    result = await resp.json()
    assert len(result["items"]) == 1
    assert result["items"][0]["name"] == "small"


@pytest.mark.asyncio
async def test_image_list_filter_text(aiohttp_client, app):
    """Test text search filters (title, artist, etc)."""
    client = await aiohttp_client(app)

    async with database.get_session() as session:
        img1 = models.Image(
            id=uuid.uuid4().hex,
            name="Sunset",
            artist="Bob",
            collection="Nature",
            file_type="PNG",
            width=100,
            height=100,
            file_path="1.png",
            status="ACTIVE",
            file_hash="h5",
        )
        img2 = models.Image(
            id=uuid.uuid4().hex,
            name="City",
            artist="Alice",
            collection="Urban",
            file_type="PNG",
            width=100,
            height=100,
            file_path="2.png",
            status="ACTIVE",
            file_hash="h6",
        )
        session.add_all([img1, img2])
        await session.commit()

    # Case-insensitive title search
    resp = await client.get("/api/image?title=set")
    result = await resp.json()
    assert len(result["items"]) == 1
    assert result["items"][0]["name"] == "Sunset"

    # Artist search
    resp = await client.get("/api/image?artist=Alice")
    result = await resp.json()
    assert len(result["items"]) == 1
    assert result["items"][0]["name"] == "City"


@pytest.mark.asyncio
async def test_image_list_filter_keywords(aiohttp_client, app):
    """Test keyword exact search with OR logic (Union)."""
    client = await aiohttp_client(app)

    async with database.get_session() as session:
        img1 = models.Image(
            id=uuid.uuid4().hex,
            name="i1",
            keywords=["tag1", "tag2"],
            file_type="PNG",
            width=100,
            height=100,
            file_path="k1.png",
            status="ACTIVE",
            file_hash="hk1",
        )
        img2 = models.Image(
            id=uuid.uuid4().hex,
            name="i2",
            keywords=["tag1", "tag3"],
            file_type="PNG",
            width=100,
            height=100,
            file_path="k2.png",
            status="ACTIVE",
            file_hash="hk2",
        )
        session.add_all([img1, img2])
        await session.commit()

    # Single keyword
    resp = await client.get("/api/image?keyword=tag2")
    result = await resp.json()
    assert len(result["items"]) == 1
    assert result["items"][0]["name"] == "i1"

    # Multiple keywords (Union/OR)
    resp = await client.get("/api/image?keyword=tag2,tag3")
    result = await resp.json()
    assert len(result["items"]) == 2
    names = [i["name"] for i in result["items"]]
    assert "i1" in names
    assert "i2" in names

    # keywords that none have
    resp = await client.get("/api/image?keyword=tag4,tag5")
    result = await resp.json()
    assert len(result["items"]) == 0
