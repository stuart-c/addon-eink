import pytest
from backend import database, models
import uuid


@pytest.mark.asyncio
async def test_get_keywords_empty(aiohttp_client, app):
    """Test getting keywords when no images exist."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/image/keywords")
    assert resp.status == 200
    assert await resp.json() == []


@pytest.mark.asyncio
async def test_get_keywords_ordered(aiohttp_client, app):
    """Test getting keywords ordered by frequency and then alphabetically."""
    client = await aiohttp_client(app)

    # 1. Populate database with some images having keywords
    async with database.get_session() as session:
        img1 = models.Image(
            id=uuid.uuid4().hex,
            name="img1",
            file_type="PNG",
            width=100,
            height=100,
            file_path="img1.png",
            status="ACTIVE",
            file_hash="hash1",
            keywords=["landscape", "nature", "summer"],
        )
        img2 = models.Image(
            id=uuid.uuid4().hex,
            name="img2",
            file_type="PNG",
            width=100,
            height=100,
            file_path="img2.png",
            status="ACTIVE",
            file_hash="hash2",
            keywords=["landscape", "winter"],
        )
        img3 = models.Image(
            id=uuid.uuid4().hex,
            name="img3",
            file_type="PNG",
            width=100,
            height=100,
            file_path="img3.png",
            status="ACTIVE",
            file_hash="hash3",
            keywords=["landscape", "nature", "A_keyword"],
        )
        # Image with no keywords
        img4 = models.Image(
            id=uuid.uuid4().hex,
            name="img4",
            file_type="PNG",
            width=100,
            height=100,
            file_path="img4.png",
            status="ACTIVE",
            file_hash="hash4",
            keywords=None,
        )
        session.add_all([img1, img2, img3, img4])
        await session.commit()

    # 2. Get keywords
    resp = await client.get("/api/image/keywords")
    assert resp.status == 200
    result = await resp.json()

    # Expected order:
    # landscape: 3
    # nature: 2
    # A_keyword: 1 (alphabetical first)
    # summer: 1
    # winter: 1

    expected = [
        {"keyword": "landscape", "count": 3},
        {"keyword": "nature", "count": 2},
        {"keyword": "A_keyword", "count": 1},
        {"keyword": "summer", "count": 1},
        {"keyword": "winter", "count": 1},
    ]

    assert result == expected
