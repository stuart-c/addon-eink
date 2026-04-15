from sqlalchemy import select
from aiohttp import web
from jsonschema import validate, ValidationError
import json

from .. import database, models
from ..utils.converters import scene_model_to_dict
from ..utils.validation import (
    validate_id,
    load_schema,
    response_schema,
)


@response_schema("item_list_response")
async def handle_scene_list(request):
    """Retrieve all scenes from the database."""
    try:
        async with database.get_session() as session:
            stmt = select(models.Scene).order_by(models.Scene.name)
            result = await session.execute(stmt)
            scenes = result.scalars().all()
            return web.json_response([scene_model_to_dict(s) for s in scenes])
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )


@response_schema("scene")
async def handle_scene_get(request):
    """Retrieve a single scene by ID."""
    scene_id = request.match_info["id"]
    try:
        scene_id = validate_id(scene_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    try:
        async with database.get_session() as session:
            stmt = select(models.Scene).where(models.Scene.id == scene_id)
            result = await session.execute(stmt)
            scene = result.scalar_one_or_none()

            if not scene:
                return web.json_response({"error": "Not Found"}, status=404)

            return web.json_response(scene_model_to_dict(scene))
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )


@response_schema("scene")
async def handle_scene_create(request):
    """Create a new scene in the database."""
    try:
        data = await request.json()
    except json.JSONDecodeError:
        return web.json_response({"error": "Invalid JSON"}, status=400)

    # Validation
    try:
        schema = load_schema("scene")
        validate(instance=data, schema=schema)
    except FileNotFoundError:
        return web.json_response(
            {"error": "Schema for scene not found"}, status=500
        )
    except ValidationError as e:
        return web.json_response(
            {"error": "Validation failed", "message": e.message}, status=400
        )

    scene_id = data.get("id")
    try:
        scene_id = validate_id(scene_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    try:
        async with database.get_session() as session:
            # Check for existing
            stmt = select(models.Scene).where(models.Scene.id == scene_id)
            result = await session.execute(stmt)
            if result.scalar_one_or_none():
                return web.json_response(
                    {"error": "Resource already exists"}, status=409
                )

            new_scene = models.Scene(
                id=scene_id,
                name=data["name"],
                layout_id=data["layout"],
                items=data.get("items"),
            )
            session.add(new_scene)
            await session.commit()
            await session.refresh(new_scene)
            return web.json_response(
                scene_model_to_dict(new_scene), status=201
            )
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )


@response_schema("scene")
async def handle_scene_update(request):
    """Update an existing scene in the database."""
    scene_id = request.match_info["id"]
    try:
        scene_id = validate_id(scene_id)
        data = await request.json()
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)
    except json.JSONDecodeError:
        return web.json_response({"error": "Invalid JSON"}, status=400)

    # Ensure ID in URL matches ID in body (if provided)
    if "id" in data and data["id"] != scene_id:
        return web.json_response(
            {"error": "ID in body does not match ID in URL"}, status=400
        )

    # Ensure ID is present in data for validation
    data["id"] = scene_id

    # Validation
    try:
        schema = load_schema("scene")
        validate(instance=data, schema=schema)
    except FileNotFoundError:
        return web.json_response(
            {"error": "Schema for scene not found"}, status=500
        )
    except ValidationError as e:
        return web.json_response(
            {"error": "Validation failed", "message": e.message}, status=400
        )

    try:
        async with database.get_session() as session:
            stmt = select(models.Scene).where(models.Scene.id == scene_id)
            result = await session.execute(stmt)
            scene = result.scalar_one_or_none()

            if not scene:
                return web.json_response({"error": "Not Found"}, status=404)

            scene.name = data["name"]
            scene.layout_id = data["layout"]
            if "items" in data:
                scene.items = data["items"]
            await session.commit()
            await session.refresh(scene)
            return web.json_response(scene_model_to_dict(scene))
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )


@response_schema("status_response")
async def handle_scene_delete(request):
    """Delete a scene from the database."""
    scene_id = request.match_info["id"]
    try:
        scene_id = validate_id(scene_id)
    except ValueError as e:
        return web.json_response({"error": str(e)}, status=400)

    try:
        async with database.get_session() as session:
            stmt = select(models.Scene).where(models.Scene.id == scene_id)
            result = await session.execute(stmt)
            scene = result.scalar_one_or_none()

            if not scene:
                return web.json_response({"error": "Not Found"}, status=404)

            await session.delete(scene)
            await session.commit()
            return web.json_response({"status": "deleted"})
    except Exception as e:
        return web.json_response(
            {"error": "Database error", "details": str(e)}, status=500
        )
