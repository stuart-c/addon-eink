import json
import uuid
from aiohttp import web
from jsonschema import validate, ValidationError
from sqlalchemy import select

from .. import database, models
from ..utils.validation import (
    validate_id,
    load_schema,
    response_schema,
    validate_read_only,
)


def get_resource_schema(request, data):
    """Helper to determine the schema name from the request."""
    return request.match_info["resource_type"]


def get_model_class(resource_type):
    """Map resource type to SQLAlchemy model class."""
    mapping = {
        "display_type": models.DisplayType,
        "layout": models.Layout,
    }
    if resource_type not in mapping:
        raise ValueError(f"Invalid resource type: {resource_type}")
    return mapping[resource_type]


def model_to_dict(item):
    """Convert SQLAlchemy model instance to dictionary for JSON response."""
    # This assumes models have fields matching the schema
    data = {}
    for column in item.__table__.columns:
        value = getattr(item, column.name)
        # Handle cases where value might be a list/dict (JSON column)
        data[column.name] = value

    allowed_fields = {
        "display_type": [
            "id",
            "name",
            "width_mm",
            "height_mm",
            "panel_width_mm",
            "panel_height_mm",
            "width_px",
            "height_px",
            "colour_type",
            "frame",
            "mat",
        ],
        "layout": [
            "id",
            "name",
            "canvas_width_mm",
            "canvas_height_mm",
            "items",
        ],
    }

    resource_type = (
        "display_type" if isinstance(item, models.DisplayType) else "layout"
    )

    return {
        k: v for k, v in data.items() if k in allowed_fields[resource_type]
    }


def ensure_landscape(data):
    """Ensure dimensions are in landscape orientation (width >= height)."""
    if data.get("height_mm", 0) > data.get("width_mm", 0):
        # Swap outer dimensions
        data["width_mm"], data["height_mm"] = (
            data["height_mm"],
            data["width_mm"],
        )
        # Swap panel dimensions
        data["panel_width_mm"], data["panel_height_mm"] = (
            data["panel_height_mm"],
            data["panel_width_mm"],
        )
        # Swap pixel dimensions
        data["width_px"], data["height_px"] = (
            data["height_px"],
            data["width_px"],
        )
    return data


@response_schema("item_list_response")
async def get_collection(request):
    """Fetch all resources for a specific collection type."""
    resource_type = request.match_info["resource_type"]
    try:
        model_class = get_model_class(resource_type)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    async with database.get_session() as session:
        result = await session.execute(select(model_class))
        items = result.scalars().all()
        return web.json_response([model_to_dict(item) for item in items])


@response_schema(get_resource_schema)
async def get_item(request):
    """Fetch a single resource by ID."""
    resource_type = request.match_info["resource_type"]
    item_id = request.match_info["id"]
    try:
        model_class = get_model_class(resource_type)
        item_id = validate_id(item_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    async with database.get_session() as session:
        result = await session.execute(
            select(model_class).where(model_class.id == item_id)
        )
        item = result.scalars().first()
        if not item:
            return web.json_response({"error": "Not Found"}, status=404)
        return web.json_response(model_to_dict(item))


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

    if resource_type == "display_type":
        data = ensure_landscape(data)

    # Generate a new UUID for the resource, ignoring any ID provided by the client
    item_id = str(uuid.uuid4())
    data["id"] = item_id

    try:
        model_class = get_model_class(resource_type)
        # item_id is already validated as a UUID string,
        # but we call validate_id for consistency
        item_id = validate_id(item_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    async with database.get_session() as session:
        # Check for existence
        result = await session.execute(
            select(model_class).where(model_class.id == item_id)
        )
        if result.scalars().first():
            return web.json_response(
                {"error": "Resource already exists"}, status=409
            )

        item = model_class(**data)
        session.add(item)
        response_data = model_to_dict(item)
        await session.commit()
        return web.json_response(response_data, status=201)


@response_schema(get_resource_schema)
async def update_item(request):
    """Update an existing resource by ID."""
    resource_type = request.match_info["resource_type"]
    item_id = request.match_info["id"]

    try:
        data = await request.json()
    except json.JSONDecodeError:
        return web.json_response({"error": "Invalid JSON"}, status=400)

    # Fetch existing item FIRST
    try:
        model_class = get_model_class(resource_type)
        item_id = validate_id(item_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    async with database.get_session() as session:
        result = await session.execute(
            select(model_class).where(model_class.id == item_id)
        )
        item = result.scalars().first()
        if not item:
            return web.json_response({"error": "Not Found"}, status=404)

        existing_data = model_to_dict(item)

        # Ensure ID in URL matches ID in body (if provided)
        if "id" in data and data["id"] != item_id:
            return web.json_response(
                {"error": "ID in body does not match ID in URL"}, status=400
            )

        # Validate read-only fields against EXISTING data
        try:
            validate_read_only(
                data, resource_type, existing_data=existing_data
            )
        except ValidationError as e:
            return web.json_response({"error": str(e)}, status=400)

        # Merge ID into data for base schema validation
        data["id"] = item_id

        # Validation against full schema
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
                {"error": "Validation failed", "message": e.message},
                status=400,
            )

        if resource_type == "display_type":
            data = ensure_landscape(data)

        # Update fields
        for key, value in data.items():
            setattr(item, key, value)

        response_data = model_to_dict(item)
        await session.commit()
        return web.json_response(response_data, status=200)


@response_schema("status_response")
async def delete_item(request):
    """Permanently delete a resource by ID."""
    resource_type = request.match_info["resource_type"]
    item_id = request.match_info["id"]
    try:
        model_class = get_model_class(resource_type)
        item_id = validate_id(item_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    async with database.get_session() as session:
        # Referential Integrity: Don't delete display_type if used in any layout
        if resource_type == "display_type":
            # Check all layouts
            result = await session.execute(select(models.Layout))
            layouts = result.scalars().all()
            for layout in layouts:
                for item in layout.items:
                    if item.get("display_type_id") == item_id:
                        msg = f"Display type in use: {layout.name}"
                        return web.json_response(
                            {"error": "Conflict", "message": msg},
                            status=400,
                        )

        # Referential Integrity: Don't delete layout if used in any scene
        if resource_type == "layout":
            stmt = select(models.Scene).where(
                models.Scene.layout_id == item_id
            )
            result = await session.execute(stmt)
            scene = result.scalars().first()
            if scene:
                msg = f"Layout in use: {scene.name}"
                return web.json_response(
                    {"error": "Conflict", "message": msg},
                    status=400,
                )

        # Perform deletion
        result = await session.execute(
            select(model_class).where(model_class.id == item_id)
        )
        item = result.scalars().first()
        if not item:
            return web.json_response({"error": "Not Found"}, status=404)

        await session.delete(item)
        await session.commit()
        return web.json_response({"status": "deleted"})
