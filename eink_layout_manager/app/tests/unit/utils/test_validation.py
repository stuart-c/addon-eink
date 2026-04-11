import pytest
from app.utils.validation import validate_id, load_schema


def test_validate_id_success():
    """Test valid IDs are returned unchanged."""
    assert validate_id("valid-id_123") == "valid-id_123"


def test_validate_id_invalid_type():
    """Test non-string IDs are rejected."""
    with pytest.raises(
        ValueError, match="Invalid ID: Must be a non-empty string"
    ):
        validate_id(None)
    with pytest.raises(
        ValueError, match="Invalid ID: Must be a non-empty string"
    ):
        validate_id(123)


def test_validate_id_invalid_format():
    """Test IDs with invalid characters are rejected."""
    with pytest.raises(ValueError, match="Invalid ID format"):
        validate_id("invalid!id")
    with pytest.raises(ValueError, match="Invalid ID format"):
        validate_id("spaced id")


def test_validate_id_traversal():
    """Test traversal attempts are rejected."""
    with pytest.raises(ValueError, match="Invalid ID format"):
        validate_id("../etc/passwd")


def test_load_schema_success():
    """Test loading a valid schema."""
    schema = load_schema("display_type")
    assert isinstance(schema, dict)
    assert schema["title"] == "DisplayType"


def test_load_schema_not_found():
    """Test loading a non-existent schema."""
    with pytest.raises(FileNotFoundError):
        load_schema("non_existent_schema")
