# Unified schema validation for API requests and responses
import json
import logging
import os
import re
from aiohttp import web
from jsonschema import validate, ValidationError, RefResolver


def get_resolver(schema):
    """Create a RefResolver for the schemas directory."""
    return RefResolver(f"file://{SCHEMAS_DIR}/", schema)


def get_readonly_fields(schema, resolver=None):
    """
    Recursively find all fields marked as readOnly in a JSON schema.
    Returns a set of field paths (e.g., {"id", "dimensions.width"}).
    """
    if resolver is None:
        resolver = get_resolver(schema)

    readonly_fields = set()

    def _find_readonly(subschema, path=""):
        if not isinstance(subschema, dict):
            return

        # Handle $ref
        if "$ref" in subschema:
            try:
                _, resolved = resolver.resolve(subschema["$ref"])
                _find_readonly(resolved, path)
            except Exception as e:
                logger.error(f"Failed to resolve ref {subschema['$ref']}: {e}")
            return

        # Handle allOf (useful for adding descriptions/readOnly to refs)
        if "allOf" in subschema:
            for item in subschema["allOf"]:
                _find_readonly(item, path)
            return

        if subschema.get("readOnly"):
            readonly_fields.add(path)

        properties = subschema.get("properties", {})
        for prop, details in properties.items():
            new_path = f"{path}.{prop}" if path else prop
            _find_readonly(details, new_path)

    _find_readonly(schema)
    return readonly_fields


def validate_read_only(data, schema_name, existing_data=None):
    """
    Check if any fields in data are marked as readOnly in the named schema.
    If existing_data is provided, only raise ValidationError if the value provided
    differs from the existing value.
    """
    schema = load_schema(schema_name)
    readonly_paths = get_readonly_fields(schema)

    found_readonly_changes = []

    def _get_value_at_path(obj, path):
        parts = path.split(".")
        curr = obj
        for part in parts:
            if isinstance(curr, dict) and part in curr:
                curr = curr[part]
            else:
                return None
        return curr

    def _check_data(subdata, path=""):
        if not isinstance(subdata, dict):
            return

        for key, value in subdata.items():
            current_path = f"{path}.{key}" if path else key
            if current_path in readonly_paths:
                if existing_data is not None:
                    # Compare with existing value
                    existing_val = _get_value_at_path(
                        existing_data, current_path
                    )
                    # Use standard equality; works for strings, ints, and even
                    # dicts/lists
                    if value != existing_val:
                        found_readonly_changes.append(current_path)
                else:
                    # No existing data (e.g. POST), presence of field is enough
                    # to reject
                    found_readonly_changes.append(current_path)

            if isinstance(value, dict):
                _check_data(value, current_path)

    _check_data(data)

    if found_readonly_changes:
        fields_str = ", ".join(sorted(found_readonly_changes))
        if existing_data is not None:
            msg = (
                "Attempted to update read-only fields with changed values: "
                f"{fields_str}"
            )
        else:
            msg = f"Attempted to include read-only fields in request: {fields_str}"
        raise ValidationError(msg)


# Base directory for data persistence
# Moving one level up from utils/ to backend/ then to schemas/
SCHEMAS_DIR = os.path.realpath(
    os.path.join(os.path.dirname(__file__), "..", "schemas")
)

logger = logging.getLogger(__name__)


def validate_id(item_id):
    """
    Validate and sanitise a resource ID to prevent path traversal.
    Returns the sanitised ID if valid, otherwise raises ValueError.
    """
    if not item_id or not isinstance(item_id, str):
        raise ValueError("Invalid ID: Must be a non-empty string")

    # Security: Ensure the ID doesn't contain path traversal characters
    # and matches our expected format (alphanumeric, hyphens, underscores)
    if not re.match(r"^[a-zA-Z0-9\-_]+$", item_id):
        raise ValueError(f"Invalid ID format: {item_id}")

    # Extra safety: use os.path.basename to ensure no
    # directory components remain
    sanitised_id = os.path.basename(item_id)
    if not sanitised_id or sanitised_id != item_id:
        raise ValueError(f"Invalid ID (potential traversal): {item_id}")

    return sanitised_id


def load_schema(name):
    """Load a JSON schema from the schemas directory.

    Security: ``name`` is validated against a strict allowlist of known schemas
    and the resolved path is verified to remain within SCHEMAS_DIR before the
    file is opened.  This prevents path-traversal / path-injection attacks
    (CWE-022) when the caller passes a user-controlled value (e.g. a URL
    path segment) as the schema name.
    """
    # Security: Allowlist of schema names that may ever be loaded.
    # Any name not in this set is rejected before touching the filesystem.
    allowed_schemas = {
        "common",
        "display_type",
        "homeassistant_device_list",
        "image",
        "image_list_response",
        "item_list_response",
        "keyword_list_response",
        "layout",
        "pagination",
        "scene",
        "status_response",
    }
    if name not in allowed_schemas:
        raise ValueError(f"Unknown schema: {name!r}")

    schema_path = os.path.normpath(os.path.join(SCHEMAS_DIR, f"{name}.json"))

    # Defence-in-depth: ensure the resolved path is still inside SCHEMAS_DIR
    # even after normalisation (guards against symlink or separator tricks).
    if not schema_path.startswith(SCHEMAS_DIR + os.sep):
        raise ValueError(f"Schema path traversal detected for: {name!r}")

    try:
        with open(schema_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"Schema not found: {schema_path}")
        raise


def validate_data(data, schema_name):
    """
    Validate data against a named schema.
    Returns the data if valid, otherwise raises ValidationError.
    """
    schema = load_schema(schema_name)
    resolver = get_resolver(schema)
    validate(instance=data, schema=schema, resolver=resolver)
    return data


def validate_response(data, schema_name):
    """
    Validate response data against a named schema.
    Returns the data if valid, otherwise raises ValidationError.
    """
    return validate_data(data, schema_name)


def response_schema(schema_name_or_func):
    """
    Decorator to validate the response of a handler.
    schema_name_or_func: Either a string name of a schema, or a
                        callable that takes (request, data) and returns
                        the schema name.
    """

    def decorator(handler):
        async def wrapper(request):
            response = await handler(request)

            # Only validate JSON responses
            if (
                isinstance(response, web.Response)
                and response.content_type == "application/json"
            ):
                try:
                    # Parse data from response for validation
                    data = json.loads(response.body)

                    # Determine schema name
                    if callable(schema_name_or_func):
                        # Some handlers might return errors, we shouldn't
                        # validate those against the success schema.
                        if response.status >= 400:
                            actual_schema = "status_response"
                        else:
                            actual_schema = schema_name_or_func(request, data)
                    else:
                        actual_schema = schema_name_or_func

                        # Handle error responses generically
                        if response.status >= 400:
                            actual_schema = "status_response"

                    if actual_schema:
                        validate_response(data, actual_schema)
                except (ValidationError, json.JSONDecodeError) as e:
                    # Special case: don't loop if status_response fails
                    if response.status >= 400 and "status_response" in str(e):
                        logger.error(
                            f"FATAL: status_response validation failed: "
                            f"{str(e)}"
                        )
                        return response

                    logger.error(
                        f"Response validation failed for {actual_schema}: "
                        f"{str(e)}"
                    )
                    return web.json_response(
                        {
                            "error": "Internal Server Error",
                            "message": "Response validation failed",
                            "details": (
                                str(e)
                                if isinstance(e, ValidationError)
                                else "Invalid JSON"
                            ),
                        },
                        status=500,
                    )
            return response

        return wrapper

    return decorator
