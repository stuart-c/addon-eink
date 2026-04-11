import pytest


@pytest.mark.asyncio
async def test_ping(aiohttp_client, app):
    """Test the /ping health check."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/ping")
    assert resp.status == 200
    assert await resp.text() == "pong"
