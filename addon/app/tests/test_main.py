import pytest
from app.main import init_app


@pytest.fixture
def app():
    return init_app()


@pytest.mark.asyncio
async def test_ping(aiohttp_client, app):
    client = await aiohttp_client(app)
    resp = await client.get("/ping")
    assert resp.status == 200
    text = await resp.text()
    assert text == "pong"
