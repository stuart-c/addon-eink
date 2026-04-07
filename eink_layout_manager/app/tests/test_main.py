import os
import pytest
from app.main import init_app


@pytest.fixture
def app(tmp_path):
    """
    Fixture to initialize the application for testing
    using a temporary data directory.
    """
    # Override DATA_DIR for tests
    os.environ["DATA_DIR"] = str(tmp_path)
    return init_app()


@pytest.mark.asyncio
async def test_ping(aiohttp_client, app):
    """Test the /ping endpoint to ensure health check works."""
    client = await aiohttp_client(app)
    resp = await client.get("/ping")
    assert resp.status == 200
    text = await resp.text()
    assert text == "pong"
