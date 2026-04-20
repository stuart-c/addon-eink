from jsonschema import ValidationError
from .base import BaseCRUDHandler
from .. import models, database
from ..utils.converters import scene_model_to_dict
from ..utils.validation import response_schema, validate_id  # noqa: F401


class SceneHandler(BaseCRUDHandler):
    model_class = models.Scene
    schema_name = "scene"

    def model_to_dict(self, item):
        """Use specialized converter for Scene to handle layout_id mapping."""
        return scene_model_to_dict(item)

    async def pre_create(self, data):
        """Set default status and map layout to layout_id."""
        data["status"] = "draft"
        if "layout" in data:
            data["layout_id"] = data.pop("layout")

        # Validation
        if "items" in data and "layout_id" in data:
            await self._validate_scene_items(data["items"], data["layout_id"])

        return data

    async def pre_update(self, data, existing_item):
        """Map layout to layout_id for updates if present."""
        if "layout" in data:
            data["layout_id"] = data.pop("layout")

        # Determine layout_id for validation
        layout_id = data.get("layout_id") or existing_item.layout_id

        # Validation
        if "items" in data:
            await self._validate_scene_items(data["items"], layout_id)

        return data

    async def _validate_scene_items(self, items, layout_id):
        """
        Validate that all displays in scene items exist in the layout
        and are only mentioned once.
        """
        if not items:
            return

        from sqlalchemy import select

        async with database.get_session() as session:
            stmt = select(models.Layout).where(models.Layout.id == layout_id)
            result = await session.execute(stmt)
            layout = result.scalars().first()
            if not layout:
                # Should not happen if schema validation and referential
                # integrity are working, but good for safety.
                raise ValidationError(f"Layout {layout_id} not found")

            # Extract valid IDs from layout items
            valid_display_ids = set()
            for layout_item in layout.items:
                if isinstance(layout_item, dict) and "id" in layout_item:
                    valid_display_ids.add(layout_item["id"])

            seen_display_ids = set()

            for item in items:
                displays = item.get("displays", [])
                for display_id in displays:
                    if display_id not in valid_display_ids:
                        raise ValidationError(
                            f"Display '{display_id}' not in layout '{layout_id}'"
                        )
                    if display_id in seen_display_ids:
                        raise ValidationError(
                            f"Display '{display_id}' mentioned more than once "
                            "in scene"
                        )
                    seen_display_ids.add(display_id)


# Instantiate handler
scene_handler = SceneHandler()


# Map routes to handler methods
@response_schema("item_list_response")
async def handle_scene_list(request):
    return await scene_handler.list(request)


@response_schema("scene")
async def handle_scene_get(request):
    return await scene_handler.get(request)


@response_schema("scene")
async def handle_scene_create(request):
    return await scene_handler.create(request)


@response_schema("scene")
async def handle_scene_update(request):
    return await scene_handler.update(request)


@response_schema("status_response")
async def handle_scene_delete(request):
    return await scene_handler.delete(request)
