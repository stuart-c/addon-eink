import json
import os

from aiohttp import web
from jsonschema import validate, ValidationError

# Base directory for data persistence
DATA_DIR = os.environ.get("DATA_DIR", "/data")
SCHEMAS_DIR = os.path.join(os.path.dirname(__file__), "schemas")


def get_storage_path(resource_type):
    path = os.path.join(DATA_DIR, resource_type)
    os.makedirs(path, exist_ok=True)
    return path


def load_schema(name):
    schema_path = os.path.join(SCHEMAS_DIR, f"{name}.json")
    with open(schema_path, "r") as f:
        return json.load(f)


# --- Handlers ---


async def handle_ping(request):
    return web.Response(text="pong")


async def get_collection(request):
    resource_type = request.match_info["resource_type"]
    storage_path = get_storage_path(resource_type)

    items = []
    for filename in sorted(os.listdir(storage_path)):
        if filename.endswith(".json"):
            with open(os.path.join(storage_path, filename), "r") as f:
                items.append(json.load(f))

    return web.json_response(items)


async def get_item(request):
    resource_type = request.match_info["resource_type"]
    item_id = request.match_info["id"]
    storage_path = get_storage_path(resource_type)
    file_path = os.path.join(storage_path, f"{item_id}.json")

    if not os.path.exists(file_path):
        return web.json_response({"error": "Not Found"}, status=404)

    with open(file_path, "r") as f:
        return web.json_response(json.load(f))


async def create_item(request):
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

    storage_path = get_storage_path(resource_type)
    file_path = os.path.join(storage_path, f"{item_id}.json")

    if os.path.exists(file_path):
        return web.json_response({"error": "Resource already exists"}, status=409)

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

    return web.json_response(data, status=201)


async def update_item(request):
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

    storage_path = get_storage_path(resource_type)
    file_path = os.path.join(storage_path, f"{item_id}.json")

    if not os.path.exists(file_path):
        return web.json_response({"error": "Not Found"}, status=404)

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

    return web.json_response(data, status=200)


async def delete_item(request):
    resource_type = request.match_info["resource_type"]
    item_id = request.match_info["id"]
    storage_path = get_storage_path(resource_type)
    file_path = os.path.join(storage_path, f"{item_id}.json")

    if os.path.exists(file_path):
        os.remove(file_path)
        return web.Response(status=204)

    return web.json_response({"error": "Not Found"}, status=404)


# --- App Init ---


def init_app():
    app = web.Application()

    # Health check
    app.router.add_get("/ping", handle_ping)

    # RESTful API
    # Valid resource types: display_type, layout
    api_prefix = "/api/{resource_type:(?:display_type|layout)}"

    app.router.add_get(f"{api_prefix}", get_collection)
    app.router.add_get(f"{api_prefix}/{{id}}", get_item)
    app.router.add_post(f"{api_prefix}", create_item)
    app.router.add_put(f"{api_prefix}/{{id}}", update_item)
    app.router.add_delete(f"{api_prefix}/{{id}}", delete_item)

    # Placeholder for static Lit frontend files
    # if os.path.exists('static'):
    #     app.router.add_static('/', 'static/')

    return app


if __name__ == "__main__":
    port = int(os.environ.get("INGRESS_PORT", 8099))
    app = init_app()
    web.run_app(app, port=port)
