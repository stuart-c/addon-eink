"""Unit tests for scene slice retrieval."""

import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from aiohttp import web
from backend.handlers.scenes import SceneHandler
from backend import models


@pytest.fixture
def handler():
    return SceneHandler()


@pytest.mark.asyncio
async def test_slice_get_success(handler, tmp_path):
    """Test successful retrieval of a scene slice."""
    scene_id = "scene1"
    display_id = "display1"
    image_id = "image1"
    filename = "slice_scene1_image1_display1.png"

    # Create a dummy file
    slice_dir = tmp_path / "scene_display"
    slice_dir.mkdir()
    slice_file = slice_dir / filename
    slice_file.write_bytes(b"dummy image data")

    mock_request = MagicMock()
    mock_request.match_info = {
        "scene_id": scene_id,
        "display_id": display_id,
        "image_id": image_id,
    }

    mock_record = models.SceneDisplayImage(
        scene_id=scene_id,
        display_id=display_id,
        image_id=image_id,
        filename=filename,
        image_hash="ihash",
        scene_hash="shash",
    )

    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_record
    mock_session.execute.return_value = mock_result

    # Note: we need to patch os.path.exists because the real code calls it
    with (
        patch("backend.database.get_session") as mock_get_session,
        patch("backend.handlers.scenes.get_storage_path", return_value=str(slice_dir)),
        patch(
            "os.path.exists",
            side_effect=lambda p: str(p) == str(slice_file) or str(p) == str(slice_dir),
        ),
    ):
        mock_get_session.return_value.__aenter__.return_value = mock_session
        response = await handler.slice_get(mock_request)

        assert isinstance(response, web.FileResponse)
        # In aiohttp, FileResponse stores the path in _path
        assert str(response._path) == str(slice_file)


@pytest.mark.asyncio
async def test_slice_get_not_found_db(handler):
    """Test 404 when record is missing from database."""
    mock_request = MagicMock()
    mock_request.match_info = {"scene_id": "s1", "display_id": "d1", "image_id": "i1"}

    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_session.execute.return_value = mock_result

    with patch("backend.database.get_session") as mock_get_session:
        mock_get_session.return_value.__aenter__.return_value = mock_session
        response = await handler.slice_get(mock_request)

        assert response.status == 404


@pytest.mark.asyncio
async def test_slice_get_not_found_file(handler, tmp_path):
    """Test 404 when file is missing from disk."""
    scene_id = "scene1"
    display_id = "display1"
    image_id = "image1"
    filename = "missing.png"

    mock_request = MagicMock()
    mock_request.match_info = {
        "scene_id": scene_id,
        "display_id": display_id,
        "image_id": image_id,
    }

    mock_record = models.SceneDisplayImage(
        scene_id=scene_id,
        display_id=display_id,
        image_id=image_id,
        filename=filename,
        image_hash="ihash",
        scene_hash="shash",
    )

    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_record
    mock_session.execute.return_value = mock_result

    slice_dir = tmp_path / "scene_display"
    slice_dir.mkdir()

    with (
        patch("backend.database.get_session") as mock_get_session,
        patch("backend.handlers.scenes.get_storage_path", return_value=str(slice_dir)),
        patch("os.path.exists", return_value=False),
    ):
        mock_get_session.return_value.__aenter__.return_value = mock_session
        response = await handler.slice_get(mock_request)

        assert response.status == 404


@pytest.mark.asyncio
async def test_slice_get_invalid_id(handler):
    """Test 400 when invalid IDs are provided."""
    mock_request = MagicMock()
    mock_request.match_info = {
        "scene_id": "invalid path!!",
        "display_id": "d1",
        "image_id": "i1",
    }

    response = await handler.slice_get(mock_request)
    assert response.status == 400
