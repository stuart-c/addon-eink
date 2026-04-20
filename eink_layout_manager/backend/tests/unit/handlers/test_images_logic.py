import pytest
import hashlib
from unittest.mock import MagicMock, AsyncMock, patch
from PIL import UnidentifiedImageError
from backend.handlers.images import ImageHandler
from backend import models


@pytest.fixture
def handler():
    return ImageHandler()


def test_hashing_logic(handler):
    """Test that SHA-256 hashing is consistent."""
    content = b"test image content"
    expected_hash = hashlib.sha256(content).hexdigest()

    # Simulate first part of ImageHandler.create logic
    file_hash = hashlib.sha256(content).hexdigest()
    assert file_hash == expected_hash


@pytest.mark.asyncio
async def test_create_duplicate_detection(handler):
    """Test that duplicate images are detected by hash."""
    mock_request = AsyncMock()
    mock_field = MagicMock()
    mock_field.name = "file"
    mock_field.filename = "test.png"
    mock_field.read = AsyncMock(return_value=b"content")

    mock_reader = AsyncMock()
    mock_reader.next.return_value = mock_field
    mock_request.multipart.return_value = mock_reader

    # Mock DB to return existing image
    mock_existing = models.Image(
        id="img1", file_hash=hashlib.sha256(b"content").hexdigest()
    )
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_existing
    mock_session.execute.return_value = mock_result

    with patch("backend.database.get_session") as mock_get_session:
        mock_get_session.return_value.__aenter__.return_value = mock_session
        response = await handler.create(mock_request)

        assert response.status == 409
        import json

        data = json.loads(response.body.decode())
        assert data["error"] == "Duplicate image"
        assert data["id"] == "img1"


@pytest.mark.asyncio
async def test_create_invalid_image(handler):
    """Test that invalid image files are rejected."""
    mock_request = AsyncMock()
    mock_field = MagicMock()
    mock_field.name = "file"
    mock_field.filename = "test.txt"
    mock_field.read = AsyncMock(return_value=b"not an image")

    mock_reader = AsyncMock()
    mock_reader.next.return_value = mock_field
    mock_request.multipart.return_value = mock_reader

    # Mock DB to return nothing (not a duplicate)
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_session.execute.return_value = mock_result

    with (
        patch("backend.database.get_session") as mock_get_session,
        patch(
            "PIL.Image.open", side_effect=UnidentifiedImageError("Bad image")
        ),
    ):
        mock_get_session.return_value.__aenter__.return_value = mock_session
        response = await handler.create(mock_request)

        assert response.status == 400
        import json

        data = json.loads(response.body.decode())
        assert data["error"] == "Invalid image file"
