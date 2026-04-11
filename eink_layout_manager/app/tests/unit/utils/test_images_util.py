import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.utils.images import delete_image_files_and_record
from app import models


@pytest.mark.asyncio
async def test_delete_image_files_and_record_success():
    """Test successful deletion from DB and disk."""
    mock_session = AsyncMock()
    mock_image = MagicMock(spec=models.Image)
    mock_image.id = "test-id"
    mock_image.file_path = "test.png"
    mock_image.thumbnail_path = "thumb.png"

    with patch("app.utils.images.get_storage_path") as mock_get_path, patch(
        "os.path.exists", return_value=True
    ), patch("os.remove") as mock_remove:

        mock_get_path.side_effect = lambda t: f"/data/{t}"

        await delete_image_files_and_record(mock_image, mock_session)

        # Verify DB deletion
        mock_session.delete.assert_called_once_with(mock_image)
        mock_session.commit.assert_called_once()

        # Verify disk deletion
        assert mock_remove.call_count == 2
        mock_remove.assert_any_call("/data/image/test.png")
        mock_remove.assert_any_call("/data/thumbnail/thumb.png")


@pytest.mark.asyncio
async def test_delete_image_files_and_record_no_thumbnail():
    """Test deletion when no thumbnail exists."""
    mock_session = AsyncMock()
    mock_image = MagicMock(spec=models.Image)
    mock_image.id = "test-id"
    mock_image.file_path = "test.png"
    mock_image.thumbnail_path = None

    with patch("app.utils.images.get_storage_path") as mock_get_path, patch(
        "os.path.exists", return_value=True
    ), patch("os.remove") as mock_remove:

        mock_get_path.side_effect = lambda t: f"/data/{t}"

        await delete_image_files_and_record(mock_image, mock_session)

        # Verify disk deletion - only main image
        mock_remove.assert_called_once_with("/data/image/test.png")


@pytest.mark.asyncio
async def test_delete_image_files_and_record_file_missing():
    """Test deletion when files are missing on disk (should not fail)."""
    mock_session = AsyncMock()
    mock_image = MagicMock(spec=models.Image)
    mock_image.file_path = "test.png"
    mock_image.thumbnail_path = "thumb.png"

    with patch("app.utils.images.get_storage_path"), patch(
        "os.path.exists", return_value=False
    ), patch("os.remove") as mock_remove:

        await delete_image_files_and_record(mock_image, mock_session)

        # Verify DB deletion was still called
        mock_session.delete.assert_called_once()
        # Verify remove was NOT called
        mock_remove.assert_not_called()


@pytest.mark.asyncio
async def test_delete_image_files_and_record_error_path():
    """Test that filesystem errors are caught and logged, not raised."""
    mock_session = AsyncMock()
    mock_image = MagicMock(spec=models.Image)
    mock_image.id = "test-id"
    mock_image.file_path = "test.png"
    mock_image.thumbnail_path = "thumb.png"

    with patch("app.utils.images.get_storage_path"), patch(
        "os.path.exists", return_value=True
    ), patch("os.remove", side_effect=OSError("Permission denied")), patch(
        "builtins.print"
    ) as mock_print:

        # This should NOT reraise the OSError
        await delete_image_files_and_record(mock_image, mock_session)

        # Verify DB deletion was still called
        mock_session.delete.assert_called_once()

        # Verify error was logged to stdout (as per current implementation)
        mock_print.assert_called()
        args, _ = mock_print.call_args
        assert "Error deleting image files" in args[0]
        assert "Permission denied" in args[0]
