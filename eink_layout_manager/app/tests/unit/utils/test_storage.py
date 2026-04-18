import os
import pytest
from app.utils.storage import get_storage_path


def test_get_storage_path_valid(tmp_path):
    """Test get_storage_path correctly creates and returns the directory."""
    os.environ["DATA_DIR"] = str(tmp_path)
    path = get_storage_path("image")
    assert path == os.path.join(str(tmp_path), "image")
    assert os.path.exists(path)


def test_get_storage_path_invalid():
    """Test get_storage_path raises ValueError for invalid types."""
    with pytest.raises(ValueError) as excinfo:
        get_storage_path("invalid_type")
    assert "Invalid resource type" in str(excinfo.value)
