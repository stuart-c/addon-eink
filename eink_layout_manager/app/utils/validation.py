# Unified schema validation for API requests and responses
import json
import logging
import os
import re
from aiohttp import web
from jsonschema import validate, ValidationError

# Base directory for data persistence
# Moving one level up from utils/ to app/ then to schemas/
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
    """Load a JSON schema from the schemas directory."""
    schema_path = os.path.join(SCHEMAS_DIR, f"{name}.json")
    try:
        with open(schema_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"Schema not found: {schema_path}")
        raise


def validate_response(data, schema_name):
    """
    Validate data against a named schema.
    Returns the data if valid, otherwise raises ValidationError.
    """
    schema = load_schema(schema_name)
    validate(instance=data, schema=schema)
    return data


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
                        # Some handlers might return errors, we shouldn't validate
                        # those against the success schema.
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
                            f"FATAL: status_response validation failed: {str(e)}"
                        )
                        return response

                    logger.error(
                        f"Response validation failed for {actual_schema}: {str(e)}"
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
