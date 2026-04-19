from aiohttp import web
from .base import BaseCRUDHandler
from .. import models
from ..utils.converters import generic_model_to_dict
from ..utils.validation import response_schema, validate_id  # noqa: F401


class DisplayTypeHandler(BaseCRUDHandler):
    model_class = models.DisplayType
    schema_name = "display_type"

    def model_to_dict(self, item):
        """Standard model to dict for display types."""
        return generic_model_to_dict(
            item,
            include_fields={
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
            },
        )

    async def pre_create(self, data):
        """Ensure landscape orientation for display types."""
        return self._ensure_landscape(data)

    async def pre_update(self, data, existing_item):
        """Ensure landscape orientation for display types."""
        return self._ensure_landscape(data)

    def _ensure_landscape(self, data):
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

    async def pre_delete(self, item, session):
        """Referential Integrity: Don't delete display_type if used in any layout."""
        from sqlalchemy import select

        result = await session.execute(select(models.Layout))
        layouts = result.scalars().all()
        for layout in layouts:
            for layout_item in layout.items:
                if layout_item.get("display_type_id") == item.id:
                    raise web.HTTPConflict(
                        reason=f"Display type in use: {layout.name}"
                    )


class LayoutHandler(BaseCRUDHandler):
    model_class = models.Layout
    schema_name = "layout"

    def model_to_dict(self, item):
        """Standard model to dict for layouts."""
        return generic_model_to_dict(
            item,
            include_fields={
                "id",
                "name",
                "canvas_width_mm",
                "canvas_height_mm",
                "items",
            },
        )

    async def pre_delete(self, item, session):
        """Referential Integrity: Don't delete layout if used in any scene."""
        from sqlalchemy import select

        stmt = select(models.Scene).where(models.Scene.layout_id == item.id)
        result = await session.execute(stmt)
        scene = result.scalars().first()
        if scene:
            raise web.HTTPConflict(reason=f"Layout in use: {scene.name}")


# Instantiate handlers for use in routes
display_type_handler = DisplayTypeHandler()
layout_handler = LayoutHandler()


# Helper for response validation
def get_resource_schema(request, data):
    """Helper to determine the schema name from the request."""
    return request.match_info["resource_type"]


# Map generic routes to the instances
@response_schema("item_list_response")
async def get_collection(request):
    resource_type = request.match_info["resource_type"]
    if resource_type == "display_type":
        return await display_type_handler.list(request)
    elif resource_type == "layout":
        return await layout_handler.list(request)
    return web.json_response(
        {"error": f"Invalid resource: {resource_type}"}, status=400
    )


@response_schema(get_resource_schema)
async def get_item(request):
    resource_type = request.match_info["resource_type"]
    if resource_type == "display_type":
        return await display_type_handler.get(request)
    elif resource_type == "layout":
        return await layout_handler.get(request)
    return web.json_response(
        {"error": f"Invalid resource: {resource_type}"}, status=400
    )


@response_schema(get_resource_schema)
async def create_item(request):
    resource_type = request.match_info["resource_type"]
    if resource_type == "display_type":
        return await display_type_handler.create(request)
    elif resource_type == "layout":
        return await layout_handler.create(request)
    return web.json_response(
        {"error": f"Invalid resource: {resource_type}"}, status=400
    )


@response_schema(get_resource_schema)
async def update_item(request):
    resource_type = request.match_info["resource_type"]
    if resource_type == "display_type":
        return await display_type_handler.update(request)
    elif resource_type == "layout":
        return await layout_handler.update(request)
    return web.json_response(
        {"error": f"Invalid resource: {resource_type}"}, status=400
    )


@response_schema("status_response")
async def delete_item(request):
    resource_type = request.match_info["resource_type"]
    if resource_type == "display_type":
        return await display_type_handler.delete(request)
    elif resource_type == "layout":
        return await layout_handler.delete(request)
    return web.json_response(
        {"error": f"Invalid resource: {resource_type}"}, status=400
    )
