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
async def test_image_upload_success(aiohttp_client, app, tmp_path):
    """Test successful image upload with metadata extraction."""
    client = await aiohttp_client(app)

    # 1. Create a dummy image
    width, height = 100, 150
    img = PILImage.new("RGB", (width, height), color="blue")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")
    img_data = img_byte_arr.getvalue()

    # 2. Prepare multipart upload
    data = aiohttp.FormData()
    data.add_field(
        "file", img_data, filename="test_upload.png", content_type="image/png"
    )

    # 3. Post to endpoint
    resp = await client.post("/api/image", data=data)
    assert resp.status == 201
    result = await resp.json()

    # 4. Verify metadata in response
    assert result["name"] == "test_upload.png"
    assert result["file_type"] == "PNG"
    assert result["dimensions"] == {"width": width, "height": height}
    assert result["status"] == "UPLOADED"
    assert "id" in result
    assert "file_hash" in result
    assert result["file_path"].endswith(".png")

    # 5. Verify file exists on disk
    storage_path = os.path.join(str(tmp_path), "image")
    file_path = os.path.join(storage_path, result["file_path"])
    assert os.path.exists(file_path)
    with open(file_path, "rb") as f:
        assert f.read() == img_data


@pytest.mark.asyncio
async def test_image_upload_invalid_file(aiohttp_client, app):
    """Test uploading a non-image file."""
    client = await aiohttp_client(app)

    data = aiohttp.FormData()
    data.add_field(
        "file", b"not an image", filename="test.txt", content_type="text/plain"
    )

    resp = await client.post("/api/image", data=data)
    assert resp.status == 400
    assert "Invalid image" in (await resp.json())["error"]


@pytest.mark.asyncio
async def test_image_upload_missing_field(aiohttp_client, app):
    """Test upload with missing 'file' field."""
    client = await aiohttp_client(app)

    data = aiohttp.FormData()
    data.add_field("wrong_field", b"data")

    resp = await client.post("/api/image", data=data)
    assert resp.status == 400
    assert "file" in (await resp.json())["error"].lower()


@pytest.mark.asyncio
async def test_image_upload_duplicate(aiohttp_client, app):
    """Test uploading the same image twice returns a 409 conflict."""
    client = await aiohttp_client(app)

    # 1. Create a dummy image
    img = PILImage.new("RGB", (50, 50), color="red")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")
    img_data = img_byte_arr.getvalue()

    # 2. Upload for the first time
    data1 = aiohttp.FormData()
    data1.add_field(
        "file", img_data, filename="image.png", content_type="image/png"
    )
    resp1 = await client.post("/api/image", data=data1)
    assert resp1.status == 201
    result1 = await resp1.json()

    # 3. Upload the exact same image again
    data2 = aiohttp.FormData()
    data2.add_field(
        "file", img_data, filename="image_copy.png", content_type="image/png"
    )
    resp2 = await client.post("/api/image", data=data2)

    # 4. Verify rejection
    assert resp2.status == 409
    result2 = await resp2.json()
    assert result2["error"] == "Duplicate image"
    assert result2["id"] == result1["id"]
