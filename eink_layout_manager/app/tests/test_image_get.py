import io
import os
import pytest
import aiohttp
from PIL import Image as PILImage
from app.main import init_app


@pytest.fixture
def app(tmp_path):
    """
    Fixture to initialise the application for testing
    using a temporary data directory.
    """
    # Override DATA_DIR for tests
    os.environ["DATA_DIR"] = str(tmp_path)
    return init_app()


@pytest.mark.asyncio
async def test_get_image_success(aiohttp_client, app):
    """Test successful retrieval of image metadata from DB."""
    client = await aiohttp_client(app)

    # 1. Upload an image first to populate the DB
    width, height = 100, 150
    img = PILImage.new("RGB", (width, height), color="blue")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")
    img_data = img_byte_arr.getvalue()

    data = aiohttp.FormData()
    data.add_field(
        "file", img_data, filename="test_get.png", content_type="image/png"
    )

    upload_resp = await client.post("/api/image", data=data)
    assert upload_resp.status == 201
    upload_result = await upload_resp.json()
    image_id = upload_result["id"]

    # 2. Retrieve the image metadata
    resp = await client.get(f"/api/image/{image_id}")
    assert resp.status == 200
    result = await resp.json()

    # 3. Verify all fields in the schema are present and correct
    assert result["id"] == image_id
    assert result["name"] == "test_get.png"
    assert result["file_type"] == "PNG"
    assert result["dimensions"] == {"width": width, "height": height}
    assert result["status"] == "UPLOADED"
    assert "file_hash" in result
    assert "file_path" in result
    assert result["file_path"].endswith(".png")
    
    # Optional fields should be present (matching None/empty)
    assert "artist" in result
    assert "collection" in result
    assert "keywords" in result
    assert isinstance(result["keywords"], list)


@pytest.mark.asyncio
async def test_get_image_not_found(aiohttp_client, app):
    """Test 404 for non-existent image ID."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/image/non_existent_id")
    assert resp.status == 404
    result = await resp.json()
    assert result["error"] == "Not Found"


@pytest.mark.asyncio
async def test_get_image_invalid_id(aiohttp_client, app):
    """Test 400 for invalid ID format."""
    client = await aiohttp_client(app)
    # ID with path traversal characters should be rejected by validate_id
    resp = await client.get("/api/image/../illegal")
    assert resp.status == 400
    result = await resp.json()
    assert "Invalid ID" in result["error"]
