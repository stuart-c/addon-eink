import io
import os
import pytest
import aiohttp
from PIL import Image as PILImage


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
    assert "file_hash" not in result
    assert "file_path" not in result

    # Check for presence of all schema fields
    for field in [
        "artist",
        "collection",
        "colour_depth",
        "keywords",
        "description",
        "original_archive_file",
        "license",
        "source",
    ]:
        assert field in result

    # Verify internal fields are ABSENT
    assert "thumbnail_path" not in result
    assert "file_path" not in result
    assert "file_hash" not in result

    # 5. Verify file exists on disk
    from app import database, models
    from sqlalchemy import select

    async with database.get_session() as session:
        stmt = select(models.Image).where(models.Image.id == result["id"])
        db_result = await session.execute(stmt)
        image = db_result.scalar_one()
        filename = image.file_path

    storage_path = os.path.join(str(tmp_path), "image")
    file_path = os.path.join(storage_path, filename)
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
    data.add_field("wrong_field", io.BytesIO(b"data"))

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


@pytest.mark.asyncio
async def test_image_upload_with_thumbnail(aiohttp_client, app, tmp_path):
    """Test successful image upload with thumbnail generation."""
    client = await aiohttp_client(app)

    # 1. Create a large dummy image (greater than 200x200)
    width, height = 400, 300
    img = PILImage.new("RGB", (width, height), color="red")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    img_data = img_byte_arr.getvalue()

    # 2. Prepare multipart upload
    data = aiohttp.FormData()
    data.add_field(
        "file", img_data, filename="test_thumb.jpg", content_type="image/jpeg"
    )

    # 3. Post to endpoint
    resp = await client.post("/api/image", data=data)
    assert resp.status == 201
    result = await resp.json()

    # 4. Verify internal fields are NOT in response
    assert "thumbnail_path" not in result
    assert "file_path" not in result
    assert "file_hash" not in result

    # Check for presence of all schema fields (ensuring consistency)
    for field in [
        "id",
        "name",
        "artist",
        "collection",
        "file_type",
        "dimensions",
        "colour_depth",
        "keywords",
        "description",
        "original_archive_file",
        "license",
        "source",
        "status",
    ]:
        assert field in result

    # Internal fields should be ABSENT
    for field in ["file_path", "file_hash", "thumbnail_path"]:
        assert field not in result

    # 5. Verify thumbnail file exists on disk
    from app import database, models
    from sqlalchemy import select

    async with database.get_session() as session:
        stmt = select(models.Image).where(models.Image.id == result["id"])
        db_result = await session.execute(stmt)
        image = db_result.scalar_one()
        filename = image.file_path

    thumb_storage_path = os.path.join(str(tmp_path), "thumbnail")
    thumb_file_path = os.path.join(thumb_storage_path, filename)
    assert os.path.exists(thumb_file_path)

    # 6. Verify thumbnail dimensions
    with PILImage.open(thumb_file_path) as thumb_img:
        tw, th = thumb_img.size
        # For 400x300, thumbnail (200, 200) should be 200x150
        assert tw <= 200
        assert th <= 200
        assert tw == 200
        assert th == 150


@pytest.mark.asyncio
async def test_image_delete_success(aiohttp_client, app, tmp_path):
    """Test successful image and thumbnail deletion."""
    client = await aiohttp_client(app)

    # 1. Upload an image
    width, height = 400, 300
    img = PILImage.new("RGB", (width, height), color="green")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    img_data = img_byte_arr.getvalue()

    data = aiohttp.FormData()
    data.add_field(
        "file", img_data, filename="delete_me.jpg", content_type="image/jpeg"
    )
    resp = await client.post("/api/image", data=data)
    assert resp.status == 201
    result = await resp.json()
    image_id = result["id"]

    # Retrieve full record from DB to get internal path for file verification
    from app import database, models
    from sqlalchemy import select

    async with database.get_session() as session:
        stmt = select(models.Image).where(models.Image.id == image_id)
        db_result = await session.execute(stmt)
        image = db_result.scalar_one()
        filename = image.file_path

    # 2. Verify files exist
    storage_path = os.path.join(str(tmp_path), "image")
    thumb_storage_path = os.path.join(str(tmp_path), "thumbnail")
    file_path = os.path.join(storage_path, filename)
    thumb_file_path = os.path.join(thumb_storage_path, filename)

    assert os.path.exists(file_path)
    assert os.path.exists(thumb_file_path)

    # 3. Delete the image
    del_resp = await client.delete(f"/api/image/{image_id}")
    assert del_resp.status == 200
    assert (await del_resp.json())["status"] == "deleted"

    # 4. Verify files are gone
    assert not os.path.exists(file_path)
    assert not os.path.exists(thumb_file_path)

    # 5. Verify 404 on subsequent get
    get_resp = await client.get(f"/api/image/{image_id}")
    assert get_resp.status == 404


@pytest.mark.asyncio
async def test_image_delete_not_found(aiohttp_client, app):
    """Test deleting a non-existent image returns 404."""
    client = await aiohttp_client(app)
    resp = await client.delete("/api/image/nonexistent_id")
    assert resp.status == 404


@pytest.mark.asyncio
async def test_image_get_thumbnail_success(aiohttp_client, app):
    """Test successful thumbnail retrieval."""
    client = await aiohttp_client(app)

    # 1. Upload an image (large enough to definitely have a thumbnail)
    width, height = 400, 300
    img = PILImage.new("RGB", (width, height), color="blue")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    img_data = img_byte_arr.getvalue()

    data = aiohttp.FormData()
    data.add_field(
        "file", img_data, filename="thumb_test.jpg", content_type="image/jpeg"
    )
    resp = await client.post("/api/image", data=data)
    assert resp.status == 201
    result = await resp.json()
    image_id = result["id"]

    # 2. Get the thumbnail
    thumb_resp = await client.get(f"/api/image/{image_id}/thumbnail")
    assert thumb_resp.status == 200
    assert thumb_resp.content_type in [
        "image/jpeg",
        "application/octet-stream",
    ]

    # 3. Verify it's actually an image and has correct dimensions
    thumb_data = await thumb_resp.read()
    with PILImage.open(io.BytesIO(thumb_data)) as thumb_img:
        tw, th = thumb_img.size
        assert tw <= 200
        assert th <= 200


@pytest.mark.asyncio
async def test_image_get_thumbnail_not_found(aiohttp_client, app):
    """Test thumbnail retrieval for non-existent image returns 404."""
    client = await aiohttp_client(app)
    resp = await client.get("/api/image/nonexistent_id/thumbnail")
    assert resp.status == 404


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

    # Verify internal fields are ABSENT
    assert "file_hash" not in result
    assert "file_path" not in result
    assert "thumbnail_path" not in result

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
    # ID with invalid characters should be rejected by validate_id
    resp = await client.get("/api/image/invalid!id")
    assert resp.status == 400
    result = await resp.json()
    assert "Invalid ID" in result["error"]


@pytest.mark.asyncio
async def test_image_list_success(aiohttp_client, app):
    """Test retrieving the list of images (summary objects)."""
    client = await aiohttp_client(app)

    # 1. Retrieve list when empty
    resp_empty = await client.get("/api/image")
    assert resp_empty.status == 200
    assert await resp_empty.json() == []

    # 2. Upload an image to populate
    width, height = 50, 50
    img = PILImage.new("RGB", (width, height), color="red")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")

    data = aiohttp.FormData()
    data.add_field(
        "file",
        img_byte_arr.getvalue(),
        filename="list_test.png",
        content_type="image/png",
    )
    await client.post("/api/image", data=data)

    # 3. Retrieve list with content
    resp = await client.get("/api/image")
    assert resp.status == 200
    result = await resp.json()
    assert len(result) == 1

    # 4. Verify summary fields
    img_summary = result[0]
    expected_fields = {"id", "name", "artist", "collection", "description"}
    assert set(img_summary.keys()) == expected_fields
    assert img_summary["name"] == "list_test.png"

    # Verify internal fields are EXCLUDED
    for field in ["thumbnail_path", "file_path", "file_hash"]:
        assert field not in img_summary
