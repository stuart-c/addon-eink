import json
import os
from aiohttp import web
from jsonschema import validate, ValidationError

from ..utils.storage import get_storage_path
from ..utils.validation import (
    validate_id,
    load_schema,
    response_schema,
)


def get_resource_schema(request, data):
    """Helper to determine the schema name from the request."""
    return request.match_info["resource_type"]


@response_schema("item_list_response")
async def get_collection(request):
    """Fetch all resources for a specific collection type."""
    resource_type = request.match_info["resource_type"]
    try:
        storage_path = get_storage_path(resource_type)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    items = []
    if os.path.exists(storage_path):
        for filename in os.listdir(storage_path):
            if filename.endswith(".json"):
                # Security: Construct and verify canonical path for each file
                file_path = os.path.join(storage_path, filename)
                file_real = os.path.realpath(file_path)

                if not file_real.startswith(storage_path):
                    continue

                with open(file_real, "r") as f:
                    try:
                        items.append(json.load(f))
                    except json.JSONDecodeError:
                        continue
    return web.json_response(items)


@response_schema(get_resource_schema)
async def get_item(request):
    """Fetch a single resource by ID."""
    resource_type = request.match_info["resource_type"]
    item_id = request.match_info["id"]
    try:
        storage_path = get_storage_path(resource_type)
        item_id = validate_id(item_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    file_path = os.path.join(storage_path, f"{item_id}.json")
    file_real = os.path.realpath(file_path)

    # Security: Canonical path validation
    if not file_real.startswith(storage_path):
        return web.json_response({"error": "Access Denied"}, status=403)

    if not os.path.exists(file_real):
        return web.json_response({"error": "Not Found"}, status=404)

    with open(file_real, "r") as f:
        return web.json_response(json.load(f))


@response_schema(get_resource_schema)
async def create_item(request):
    """Create a new resource. Returns 409 if ID already exists."""
    resource_type = request.match_info["resource_type"]
    try:
        data = await request.json()
    except json.JSONDecodeError:
        return web.json_response({"error": "Invalid JSON"}, status=400)

    # Validation
    try:
        schema_name = resource_type
        schema = load_schema(schema_name)
        validate(instance=data, schema=schema)
    except FileNotFoundError:
        return web.json_response(
            {"error": f"Schema for {resource_type} not found"}, status=500
        )
    except ValidationError as e:
        return web.json_response(
            {"error": "Validation failed", "message": e.message}, status=400
        )

    item_id = data.get("id")
    if not item_id:
        return web.json_response({"error": "Missing 'id' field"}, status=400)

    try:
        storage_path = get_storage_path(resource_type)
        item_id = validate_id(item_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    file_path = os.path.join(storage_path, f"{item_id}.json")
    file_real = os.path.realpath(file_path)

    # Security: Canonical path validation
    if not file_real.startswith(storage_path):
        return web.json_response({"error": "Access Denied"}, status=403)

    if os.path.exists(file_real):
        return web.json_response(
            {"error": "Resource already exists"}, status=409
        )

    with open(file_real, "w") as f:
        json.dump(data, f, indent=2)

    return web.json_response(data, status=201)


@response_schema(get_resource_schema)
async def update_item(request):
    """Update an existing resource by ID."""
    resource_type = request.match_info["resource_type"]
    item_id = request.match_info["id"]

    try:
        data = await request.json()
    except json.JSONDecodeError:
        return web.json_response({"error": "Invalid JSON"}, status=400)

    # Ensure ID in URL matches ID in body (if provided)
    if "id" in data and data["id"] != item_id:
        return web.json_response(
            {"error": "ID in body does not match ID in URL"}, status=400
        )

    # Ensure ID is present in body for consistency
    data["id"] = item_id

    # Validation
    try:
        schema_name = resource_type
        schema = load_schema(schema_name)
        validate(instance=data, schema=schema)
    except FileNotFoundError:
        return web.json_response(
            {"error": f"Schema for {resource_type} not found"}, status=500
        )
    except ValidationError as e:
        return web.json_response(
            {"error": "Validation failed", "message": e.message}, status=400
        )

    try:
        storage_path = get_storage_path(resource_type)
        item_id = validate_id(item_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    file_path = os.path.join(storage_path, f"{item_id}.json")
    file_real = os.path.realpath(file_path)

    # Security: Canonical path validation
    if not file_real.startswith(storage_path):
        return web.json_response({"error": "Access Denied"}, status=403)

    if not os.path.exists(file_real):
        return web.json_response({"error": "Not Found"}, status=404)

    with open(file_real, "w") as f:
        json.dump(data, f, indent=2)

    return web.json_response(data, status=200)


@response_schema("status_response")
async def delete_item(request):
    """Permanently delete a resource by ID."""
    resource_type = request.match_info["resource_type"]
    item_id = request.match_info["id"]
    try:
        storage_path = get_storage_path(resource_type)
        item_id = validate_id(item_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    file_path = os.path.join(storage_path, f"{item_id}.json")
    file_real = os.path.realpath(file_path)

    # Security: Canonical path validation
    if not file_real.startswith(storage_path):
        return web.json_response({"error": "Access Denied"}, status=403)

    if not os.path.exists(file_real):
        return web.json_response({"error": "Not Found"}, status=404)

    # Referential Integrity: Don't delete display_type if used in any layout
    if resource_type == "display_type":
        try:
            layout_path = get_storage_path("layout")
        except ValueError as e:
            return web.json_response({"error": str(e)}, status=400)
        if os.path.exists(layout_path):
            for filename in os.listdir(layout_path):
                if filename.endswith(".json"):
                    # Security: Canonical path check for each layout item
                    file_path_layout = os.path.join(layout_path, filename)
                    file_real_layout = os.path.realpath(file_path_layout)
                    if not file_real_layout.startswith(layout_path):
                        continue

                    with open(file_real_layout, "r") as f:
                        try:
                            layout_data = json.load(f)
                            # Check every item in this layout
                            for item in layout_data.get("items", []):
                                if item.get("display_type_id") == item_id:
                                    msg = (
                                        f"Display type in use: "
                                        f"{layout_data.get('name', filename)}"
                                    )
                                    return web.json_response(
                                        {
                                            "error": "Conflict",
                                            "message": msg,
                                        },
                                        status=400,
                                    )
                        except (json.JSONDecodeError, KeyError):
                            continue

    os.remove(file_real)
    return web.json_response({"status": "deleted"})
