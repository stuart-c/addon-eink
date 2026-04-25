import pytest
from backend.utils.validation import validate_id, load_schema


def test_validate_id_success():
    """Test valid IDs are returned unchanged."""
    assert validate_id("valid-id_123") == "valid-id_123"


def test_validate_id_invalid_type():
    """Test non-string IDs are rejected."""
    with pytest.raises(ValueError, match="Invalid ID: Must be a non-empty string"):
        validate_id(None)
    with pytest.raises(ValueError, match="Invalid ID: Must be a non-empty string"):
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
    with pytest.raises(ValueError, match="Invalid ID format"):
        validate_id("data/../../etc/shadow")
    with pytest.raises(ValueError, match="Invalid ID format"):
        validate_id("./relative")


def test_validate_id_empty():
    """Test empty string is rejected."""
    with pytest.raises(ValueError, match="Invalid ID: Must be a non-empty string"):
        validate_id("")


def test_load_schema_success():
    """Test loading a valid schema."""
    schema = load_schema("display_type")
    assert isinstance(schema, dict)
    assert schema["title"] == "DisplayType"
    assert "properties" in schema
    assert "id" in schema["properties"]
    assert "width_mm" in schema["properties"]

    schema = load_schema("image")
    assert schema["title"] == "Image"
    assert "colour_depth" in schema["properties"]


def test_load_schema_not_found():
    """Unknown schema names are now rejected by the allowlist, not the FS."""
    with pytest.raises(ValueError, match="Unknown schema"):
        load_schema("non_existent_schema")


def test_load_schema_rejects_path_traversal():
    """Security: path-traversal attempts must be rejected by the allowlist."""
    traversal_attempts = [
        "../etc/passwd",
        "../../etc/shadow",
        "/etc/passwd",
        "display_type/../../../etc/passwd",
        "display_type\x00evil",
    ]
    for attempt in traversal_attempts:
        with pytest.raises(ValueError, match="Unknown schema"):
            load_schema(attempt)


def test_load_schema_rejects_unlisted_names():
    """Security: names not in the allowlist must be rejected."""
    for name in ["status", "unknown", "display", "layout_extra", ""]:
        with pytest.raises(ValueError, match="Unknown schema"):
            load_schema(name)
