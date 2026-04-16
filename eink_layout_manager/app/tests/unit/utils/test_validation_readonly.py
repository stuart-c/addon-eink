import pytest
from jsonschema import ValidationError
from ....utils.validation import get_readonly_fields, validate_read_only


def test_get_readonly_fields():
    schema = {
        "type": "object",
        "properties": {
            "id": {"type": "string", "readOnly": True},
            "name": {"type": "string"},
            "dimensions": {
                "type": "object",
                "readOnly": True,
                "properties": {
                    "width": {"type": "integer", "readOnly": True},
                    "height": {"type": "integer"},
                },
            },
        },
    }
    readonly = get_readonly_fields(schema)
    assert "id" in readonly
    assert "dimensions" in readonly
    assert "dimensions.width" in readonly
    assert "name" not in readonly
    assert "dimensions.height" not in readonly


def test_validate_read_only_pass():
    # Should not raise any error
    validate_read_only({"name": "New Name"}, "image")


def test_validate_read_only_fail_top_level(monkeypatch):
    # Mock load_schema to use a simple schema
    from ....utils import validation

    def mock_load_schema(name):
        return {"properties": {"id": {"readOnly": True}, "name": {}}}

    monkeypatch.setattr(validation, "load_schema", mock_load_schema)

    with pytest.raises(ValidationError) as excinfo:
        validate_read_only({"id": "123", "name": "Test"}, "any")
    assert "Attempted to include read-only fields in request: id" in str(
        excinfo.value
    )


def test_validate_read_only_fail_nested(monkeypatch):
    from ....utils import validation

    def mock_load_schema(name):
        return {
            "properties": {
                "dimensions": {"properties": {"width": {"readOnly": True}}}
            }
        }

    monkeypatch.setattr(validation, "load_schema", mock_load_schema)

    with pytest.raises(ValidationError) as excinfo:
        validate_read_only({"dimensions": {"width": 100}}, "any")
    assert (
        "Attempted to include read-only fields in request: dimensions.width"
        in str(excinfo.value)
    )


def test_validate_read_only_comparison_pass(monkeypatch):
    from ....utils import validation

    def mock_load_schema(name):
        return {"properties": {"id": {"readOnly": True}, "name": {}}}

    monkeypatch.setattr(validation, "load_schema", mock_load_schema)

    # Values match existing_data, should PASS
    validate_read_only(
        {"id": "123", "name": "Updated Name"},
        "any",
        existing_data={"id": "123", "name": "Old Name"},
    )


def test_validate_read_only_comparison_fail(monkeypatch):
    from ....utils import validation

    def mock_load_schema(name):
        return {"properties": {"id": {"readOnly": True}, "name": {}}}

    monkeypatch.setattr(validation, "load_schema", mock_load_schema)

    # Value differs from existing_data, should FAIL
    with pytest.raises(ValidationError) as excinfo:
        validate_read_only(
            {"id": "new_id", "name": "Updated Name"},
            "any",
            existing_data={"id": "old_id", "name": "Old Name"},
        )
    assert (
        "Attempted to update read-only fields with changed values: id"
        in str(excinfo.value)
    )
