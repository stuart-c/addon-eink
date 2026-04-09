import json
import os
import re
import traceback

from aiohttp import web
from jsonschema import validate, ValidationError

# Base directory for data persistence
SCHEMAS_DIR = os.path.join(os.path.dirname(__file__), "schemas")


def get_storage_path(resource_type):
    """
    Get the filesystem path for a specific resource type.
    Creates the directory if it does not exist.
    """
    # Security: Whitelist allowed resource types to prevent
    # arbitrary directory creation
    allowed_types = {"display_type", "layout"}
    if resource_type not in allowed_types:
        raise ValueError(f"Invalid resource type: {resource_type}")

    data_dir = os.environ.get("DATA_DIR", "/data")
    path = os.path.join(data_dir, resource_type)
    os.makedirs(path, exist_ok=True)
    return path


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


# --- Middlewares ---


@web.middleware
async def request_logger_middleware(request, handler):
    """Log every incoming request for debugging."""
    print(f"REQUEST: {request.method} {request.path}")
    try:
        return await handler(request)
    except Exception as e:
        print(f"EXCEPTION in {request.path}: {str(e)}")
        traceback.print_exc()
        raise


# --- Handlers ---


async def ping(request):
    """Health check endpoint. Returns 'pong'."""
    return web.Response(text="pong")


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
                # Security: Validate the base ID to break the
                # taint from os.listdir
                item_id = filename[:-5]
                try:
                    validate_id(item_id)
                except ValueError:
                    continue

                file_path = os.path.join(storage_path, filename)
                # Ensure we only open files within the intended directory
                if os.path.dirname(file_path) != storage_path:
                    continue
                with open(file_path, "r") as f:
                    try:
                        items.append(json.load(f))
                    except json.JSONDecodeError:
                        continue
    return web.json_response(items)


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

    if not os.path.exists(file_path):
        return web.json_response({"error": "Not Found"}, status=404)

    with open(file_path, "r") as f:
        return web.json_response(json.load(f))


async def create_item(request):
    """Create a new resource. Returns 409 if ID already exists."""
    resource_type = request.match_info["resource_type"]
    try:
        data = await request.json()
    except json.JSONDecodeError:
        return web.json_response({"error": "Invalid JSON"}, status=400)

    # Validation
    try:
        is_display = resource_type == "display_type"
        schema_name = "display_type" if is_display else "layout"
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

    if os.path.exists(file_path):
        return web.json_response(
            {"error": "Resource already exists"}, status=409
        )

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

    return web.json_response(data, status=201)


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
        is_display = resource_type == "display_type"
        schema_name = "display_type" if is_display else "layout"
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

    if not os.path.exists(file_path):
        return web.json_response({"error": "Not Found"}, status=404)

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

    return web.json_response(data, status=200)


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

    if not os.path.exists(file_path):
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
                    file_path_layout = os.path.join(layout_path, filename)
                    with open(file_path_layout, "r") as f:
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

    os.remove(file_path)
    return web.json_response({"status": "deleted"})


# --- App Init ---


def init_app():
    """Initialise the aiohttp application with routes and storage setup."""
    app = web.Application(middlewares=[request_logger_middleware])

    # Data directory setup
    try:
        os.makedirs(get_storage_path("display_type"), exist_ok=True)
        os.makedirs(get_storage_path("layout"), exist_ok=True)
    except ValueError as e:
        print(f"Error initialising storage: {str(e)}")

    # RESTful API
    # Valid resource types: display_type, layout
    api_prefix = "/api/{resource_type:(?:display_type|layout)}"

    app.router.add_get(f"{api_prefix}", get_collection)
    app.router.add_get(f"{api_prefix}/{{id}}", get_item)
    app.router.add_post(f"{api_prefix}", create_item)
    app.router.add_put(f"{api_prefix}/{{id}}", update_item)
    app.router.add_delete(f"{api_prefix}/{{id}}", delete_item)

    # Health check
    app.router.add_get("/api/ping", ping)

    # Static Lit frontend files
    static_dist = os.path.join(os.path.dirname(__file__), "static_dist")
    if os.path.exists(static_dist):
        # Serve index.html at the root
        async def index(request):
            return web.FileResponse(os.path.join(static_dist, "index.html"))

        app.router.add_get("/", index)
        # Serve other static files (assets, etc.)
        app.router.add_static("/", static_dist)

    return app


if __name__ == "__main__":
    port_env = os.environ.get("INGRESS_PORT")
    port = int(port_env) if port_env and port_env.strip() else 8099
    app = init_app()
    web.run_app(app, port=port)
