from .base import BaseCRUDHandler
from .. import models
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
        return data

    async def pre_update(self, data, existing_item):
        """Map layout to layout_id for updates if present."""
        if "layout" in data:
            data["layout_id"] = data.pop("layout")
        return data


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
