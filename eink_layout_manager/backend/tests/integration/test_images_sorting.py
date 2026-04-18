import pytest
from backend import database, models
import uuid


@pytest.fixture
async def sample_images(app):
    """Fixture to populate the database with sample images for tests."""
    images = [
        models.Image(
            id=uuid.uuid4().hex,
            name="Alpha",
            artist="Zebra",
            collection="C1",
            file_type="PNG",
            width=100,
            height=200,
            file_path="1.png",
            status="READY",
            file_hash="h1",
        ),
        models.Image(
            id=uuid.uuid4().hex,
            name="beta",
            artist="apple",
            collection="C2",
            file_type="PNG",
            width=300,
            height=100,
            file_path="2.png",
            status="READY",
            file_hash="h2",
        ),
        models.Image(
            id=uuid.uuid4().hex,
            name="Gamma",
            artist="Apple",
            collection="C1",
            file_type="PNG",
            width=200,
            height=300,
            file_path="3.png",
            status="READY",
            file_hash="h3",
        ),
    ]
    # Ensure database is initialised
    await database.init_db()
    async with database.get_session() as session:
        session.add_all(images)
        await session.commit()
    return images


@pytest.mark.asyncio
async def test_image_list_sort_default(aiohttp_client, app, sample_images):
    """Test default sorting (name:asc, case-insensitive)."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/image")
    assert resp.status == 200
    result = await resp.json()
    items = result["items"]
    # Expected order: Alpha, beta, Gamma
    assert items[0]["name"] == "Alpha"
    assert items[1]["name"] == "beta"
    assert items[2]["name"] == "Gamma"


@pytest.mark.asyncio
async def test_image_list_sort_name_desc(aiohttp_client, app, sample_images):
    """Test explicit name descending sort."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/image?sort=name:desc")
    assert resp.status == 200
    result = await resp.json()
    items = result["items"]
    # Expected order: Gamma, beta, Alpha
    assert items[0]["name"] == "Gamma"
    assert items[1]["name"] == "beta"
    assert items[2]["name"] == "Alpha"


@pytest.mark.asyncio
async def test_image_list_sort_multi_field(aiohttp_client, app, sample_images):
    """Test multi-field sorting (artist:asc, name:desc)."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/image?sort=artist:asc,name:desc")
    assert resp.status == 200
    result = await resp.json()
    items = result["items"]

    # artist: apple/Apple -> name:desc -> Gamma (G), beta (b)
    # then Zebra -> Alpha
    assert items[0]["name"] == "Gamma"
    assert items[1]["name"] == "beta"
    assert items[2]["name"] == "Alpha"


@pytest.mark.asyncio
async def test_image_list_sort_numeric(aiohttp_client, app, sample_images):
    """Test numeric field sorting."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/image?sort=width:asc")
    assert resp.status == 200
    result = await resp.json()
    items = result["items"]
    # widths: 100 (Alpha), 200 (Gamma), 300 (beta)
    assert items[0]["name"] == "Alpha"
    assert items[1]["name"] == "Gamma"
    assert items[2]["name"] == "beta"


@pytest.mark.asyncio
async def test_image_list_sort_invalid_field(
    aiohttp_client, app, sample_images
):
    """Test that invalid fields are ignored and fallback to default."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/image?sort=invalid:asc")
    assert resp.status == 200
    result = await resp.json()
    items = result["items"]
    # Should fallback to name:asc
    assert items[0]["name"] == "Alpha"
