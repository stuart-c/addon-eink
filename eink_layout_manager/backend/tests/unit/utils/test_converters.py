from backend.utils.converters import image_model_to_dict
from unittest.mock import MagicMock


def test_image_model_to_dict():
    """Test converting an Image model instance to a dictionary."""
    mock_image = MagicMock()
    mock_image.id = "test-id"
    mock_image.name = "test.png"
    mock_image.artist = "Artist"
    mock_image.collection = "Collection"
    mock_image.file_type = "PNG"
    mock_image.width = 100
    mock_image.height = 200
    mock_image.colour_depth = 8
    mock_image.keywords = ["a", "b"]
    mock_image.description = "Desc"
    mock_image.file_path = "path.png"
    mock_image.original_archive_file = "orig.zip"
    mock_image.license = "MIT"
    mock_image.source = "Web"
    mock_image.status = "UPLOADED"
    mock_image.file_hash = "abc123"
    mock_image.thumbnail_path = "thumb.png"

    result = image_model_to_dict(mock_image)

    assert result["id"] == "test-id"
    assert result["dimensions"] == {"width": 100, "height": 200}
    assert result["keywords"] == ["a", "b"]
    assert "thumbnail_path" not in result
    assert "file_path" not in result
    assert "file_hash" not in result


def test_image_model_to_dict_null_keywords():
    """Test converting an Image model with null keywords."""
    mock_image = MagicMock()
    mock_image.keywords = None

    result = image_model_to_dict(mock_image)
    assert result["keywords"] == []
