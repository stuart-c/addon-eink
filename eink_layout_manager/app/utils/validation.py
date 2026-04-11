import json
import os
import re

# Base directory for data persistence
# Moving one level up from utils/ to app/ then to schemas/
SCHEMAS_DIR = os.path.realpath(
    os.path.join(os.path.dirname(__file__), "..", "schemas")
)


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
    with open(schema_path, "r") as f:
        return json.load(f)
