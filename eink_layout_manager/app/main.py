import json
import os
import re
import traceback
import hashlib
import uuid
import io
from PIL import Image as PILImage

from sqlalchemy import select
from aiohttp import web
from jsonschema import validate, ValidationError

try:
    from . import database, models
except ImportError:
    import database
    import models

# Base directory for data persistence
SCHEMAS_DIR = os.path.realpath(
    os.path.join(os.path.dirname(__file__), "schemas")
)


def get_storage_path(resource_type):
    """
    Get the filesystem path for a specific resource type.
    Creates the directory if it does not exist.
    """
    # Security: Whitelist allowed resource types to prevent
    # arbitrary directory creation
    allowed_types = {"display_type", "layout", "image", "thumbnail"}
    if resource_type not in allowed_types:
        raise ValueError(f"Invalid resource type: {resource_type}")

    data_dir = os.environ.get("DATA_DIR", "/data")
    data_root_canonical = os.path.realpath(data_dir)

    path = os.path.join(data_dir, resource_type)
    real_path = os.path.realpath(path)

    # Security: Canonical path validation (Good pattern)
    if not real_path.startswith(data_root_canonical):
        raise ValueError(f"Invalid storage path (traversal): {path}")

    os.makedirs(real_path, exist_ok=True)
    return real_path


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


# --- Helpers ---
def image_model_to_dict(image):
    """Convert an Image model instance to a dictionary according to schema."""
    return {
        "id": image.id,
        "name": image.name,
        "artist": image.artist,
        "collection": image.collection,
        "file_type": image.file_type,
        "dimensions": {
            "width": image.width,
            "height": image.height,
        },
        "colour_depth": image.colour_depth,
        "keywords": image.keywords if image.keywords is not None else [],
        "description": image.description,
        "file_path": image.file_path,
        "original_archive_file": image.original_archive_file,
        "license": image.license,
        "source": image.source,
        "status": image.status,
        "file_hash": image.file_hash,
    }


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


async def handle_image_create(request):
    try:
        reader = await request.multipart()
        field = await reader.next()
        if not field or field.name != "file":
            return web.json_response(
                {"error": 'Missing "file" field'}, status=400
            )
        filename = field.filename
        content = await field.read()
    except Exception as e:
        return web.json_response(
            {"error": f"Failed to read: {str(e)}"}, status=400
        )

    image_id = uuid.uuid4().hex
    try:
        file_hash = hashlib.sha256(content).hexdigest()

        # Check for duplicate image by hash
        async with database.get_session() as session:
            stmt = select(models.Image).where(
                models.Image.file_hash == file_hash
            )
            result = await session.execute(stmt)
            existing_image = result.scalar_one_or_none()
            if existing_image:
                return web.json_response(
                    {
                        "error": "Duplicate image",
                        "message": "This image has already been uploaded.",
                        "id": existing_image.id,
                    },
                    status=409,
                )

        with PILImage.open(io.BytesIO(content)) as img:
            width, height = img.size
            file_type = img.format
    except Exception as e:
        if isinstance(e, web.HTTPException):
            raise
        return web.json_response({"error": "Invalid image"}, status=400)

    try:
        ext = file_type.lower() if file_type else "bin"
        storage_path = get_storage_path("image")
        filename_on_disk = f"{image_id}.{ext}"
        file_path = os.path.join(storage_path, filename_on_disk)
        with open(file_path, "wb") as f:
            f.write(content)

        # Generate thumbnail
        thumb_storage_path = get_storage_path("thumbnail")
        thumb_path = os.path.join(thumb_storage_path, filename_on_disk)
        with PILImage.open(io.BytesIO(content)) as img:
            img.thumbnail((200, 200))
            img.save(thumb_path)
    except Exception:
        return web.json_response({"error": "Failed to save"}, status=500)

    try:
        async with database.get_session() as session:
            new_image = models.Image(
                id=image_id,
                name=filename or "unnamed",
                file_type=file_type,
                width=width,
                height=height,
                file_path=filename_on_disk,
                status="UPLOADED",
                file_hash=file_hash,
                thumbnail_path=filename_on_disk,
            )
            session.add(new_image)
            await session.commit()
            return web.json_response(
                {
                    "id": image_id,
                    "name": new_image.name,
                    "file_type": file_type,
                    "dimensions": {"width": width, "height": height},
                    "file_path": filename_on_disk,
                    "thumbnail_path": filename_on_disk,
                    "status": "UPLOADED",
                    "file_hash": file_hash,
                },
                status=201,
            )
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        return web.json_response(
            {"error": "DB fail", "details": str(e)}, status=500
        )


async def handle_image_get(request):
    """Retrieve image metadata from the SQL database."""
    image_id = request.match_info["id"]
    try:
        image_id = validate_id(image_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    try:
        async with database.get_session() as session:
            stmt = select(models.Image).where(models.Image.id == image_id)
            result = await session.execute(stmt)
            image = result.scalar_one_or_none()

            if not image:
                return web.json_response({"error": "Not Found"}, status=404)

            return web.json_response(image_model_to_dict(image))
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )


async def handle_image_thumbnail_get(request):
    """Serve the thumbnail image file from disk."""
    image_id = request.match_info["id"]
    try:
        image_id = validate_id(image_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    try:
        async with database.get_session() as session:
            stmt = select(models.Image).where(models.Image.id == image_id)
            result = await session.execute(stmt)
            image = result.scalar_one_or_none()

            if not image or not image.thumbnail_path:
                return web.json_response({"error": "Not Found"}, status=404)

            thumb_storage_path = get_storage_path("thumbnail")
            thumb_file_path = os.path.join(
                thumb_storage_path, image.thumbnail_path
            )

            if not os.path.exists(thumb_file_path):
                return web.json_response({"error": "Not Found"}, status=404)

            return web.FileResponse(thumb_file_path)
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )


async def handle_image_delete(request):
    """Permanently delete an image record and its files."""
    image_id = request.match_info["id"]
    try:
        image_id = validate_id(image_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    async with database.get_session() as session:
        stmt = select(models.Image).where(models.Image.id == image_id)
        result = await session.execute(stmt)
        image = result.scalar_one_or_none()

        if not image:
            return web.json_response({"error": "Not Found"}, status=404)

        filename = image.file_path
        thumbnail = image.thumbnail_path

        # Delete from DB
        await session.delete(image)
        await session.commit()

        # Delete files from disk
        try:
            # Delete main image
            storage_path = get_storage_path("image")
            file_path = os.path.join(storage_path, filename)
            if os.path.exists(file_path):
                os.remove(file_path)

            # Delete thumbnail if it exists
            if thumbnail:
                thumb_storage_path = get_storage_path("thumbnail")
                thumb_file_path = os.path.join(thumb_storage_path, thumbnail)
                if os.path.exists(thumb_file_path):
                    os.remove(thumb_file_path)
        except Exception as e:
            # Log but don't fail, as DB record is already gone
            print(f"Error deleting image files for {image_id}: {str(e)}")

    return web.json_response({"status": "deleted"})


# --- App Init ---
def init_app():
    """Initialise the aiohttp application with routes and storage setup."""
    app = web.Application(middlewares=[request_logger_middleware])

    async def on_startup(app):
        """Database and storage initialisation on start."""
        await database.init_db()

    async def on_cleanup(app):
        """Cleanup on app shutdown."""
        await database.close_db()

    app.on_startup.append(on_startup)
    app.on_cleanup.append(on_cleanup)

    # Data directory setup
    try:
        os.makedirs(get_storage_path("display_type"), exist_ok=True)
        os.makedirs(get_storage_path("layout"), exist_ok=True)
        os.makedirs(get_storage_path("image"), exist_ok=True)
        os.makedirs(get_storage_path("thumbnail"), exist_ok=True)
    except ValueError as e:
        print(f"Error initialising storage: {str(e)}")

    # RESTful API
    # Valid resource types: display_type, layout, image
    api_prefix = "/api/{resource_type:(?:display_type|layout|image)}"

    app.router.add_get(f"{api_prefix}", get_collection)
    app.router.add_get("/api/image/{id}", handle_image_get)
    app.router.add_get("/api/image/{id}/thumbnail", handle_image_thumbnail_get)
    app.router.add_get(f"{api_prefix}/{{id}}", get_item)
    app.router.add_delete("/api/image/{id}", handle_image_delete)
    app.router.add_post("/api/image", handle_image_create)
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
