import os
import pytest
from backend.utils.storage import get_storage_path


def test_get_storage_path_valid(tmp_path):
    """Test get_storage_path correctly creates and returns the directory."""
    os.environ["DATA_DIR"] = str(tmp_path)
    path = get_storage_path("image")
    assert path == os.path.join(str(tmp_path), "image")
    assert os.path.exists(path)


def test_get_storage_path_scene_display_default(tmp_path):
    """Test scene_display default path."""
    os.environ["MEDIA_DIR"] = str(tmp_path)
    if "MEDIA_SUBDIRECTORY" in os.environ:
        del os.environ["MEDIA_SUBDIRECTORY"]

    path = get_storage_path("scene_display")
    expected = os.path.join(str(tmp_path), "eink/scene_display")
    # Join handles slashes, but we check canonical path
    assert os.path.realpath(path) == os.path.realpath(expected)
    assert os.path.exists(path)


def test_get_storage_path_scene_display_custom(tmp_path):
    """Test scene_display custom subdirectory."""
    os.environ["MEDIA_DIR"] = str(tmp_path)
    os.environ["MEDIA_SUBDIRECTORY"] = "custom/path"

    path = get_storage_path("scene_display")
    expected = os.path.join(str(tmp_path), "custom/path")
    assert os.path.realpath(path) == os.path.realpath(expected)
    assert os.path.exists(path)


def test_get_storage_path_invalid():
    """Test get_storage_path raises ValueError for invalid types."""
    with pytest.raises(ValueError) as excinfo:
        get_storage_path("invalid_type")
    assert "Invalid resource type" in str(excinfo.value)


def test_get_storage_path_traversal(tmp_path):
    """Test traversal protection."""
    os.environ["MEDIA_DIR"] = str(tmp_path)
    # Outside tmp_path
    os.environ["MEDIA_SUBDIRECTORY"] = "../traversal"

    with pytest.raises(ValueError) as excinfo:
        get_storage_path("scene_display")
    assert "Invalid storage path (traversal)" in str(excinfo.value)
