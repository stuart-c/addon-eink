"""API and static routes for the eInk Layout Manager."""

import os
from aiohttp import web
from .handlers import common, items, images, scenes, homeassistant


def setup_routes(app):
    """Register all API and static routes."""
    # RESTful API
    # Valid resource types: display_type, layout
    api_prefix = "/api/{resource_type:(?:display_type|layout)}"

    # Image specific routes (more specific routes first)
    app.router.add_get("/api/image/keywords", images.handle_image_keywords_get)
    app.router.add_get("/api/image", images.handle_image_list)
    app.router.add_get("/api/image/{id}", images.handle_image_get)
    app.router.add_get("/api/image/{id}/thumbnail", images.handle_image_thumbnail_get)
    app.router.add_get("/api/image/{id}/file", images.handle_image_file_get)
    app.router.add_post("/api/image", images.handle_image_create)
    app.router.add_put("/api/image/{id}", images.handle_image_update)
    app.router.add_delete("/api/image/{id}", images.handle_image_delete)

    # Scene specific routes
    app.router.add_get("/api/scene", scenes.handle_scene_list)
    app.router.add_get("/api/scene/{id}", scenes.handle_scene_get)
    app.router.add_get(
        "/api/scene/{scene_id}/slice/{display_id}/{image_id}",
        scenes.handle_scene_slice_get,
    )
    app.router.add_get("/api/scene/{id}/slice", scenes.handle_scene_slice_list)
    app.router.add_get(
        "/api/scene/{id}/queue", scenes.handle_scene_queue_count
    )
    app.router.add_post("/api/scene", scenes.handle_scene_create)
    app.router.add_put("/api/scene/{id}", scenes.handle_scene_update)
    app.router.add_delete("/api/scene/{id}", scenes.handle_scene_delete)

    # Generic item routes
    app.router.add_get(f"{api_prefix}", items.get_collection)
    app.router.add_get(f"{api_prefix}/{{id}}", items.get_item)
    app.router.add_post(f"{api_prefix}", items.create_item)
    app.router.add_put(f"{api_prefix}/{{id}}", items.update_item)
    app.router.add_delete(f"{api_prefix}/{{id}}", items.delete_item)

    # Health check
    app.router.add_get("/api/ping", common.ping)

    # Home Assistant integration
    app.router.add_get("/api/homeassistant/device", homeassistant.handle_device_list)

    # Static Lit frontend files
    # Try new structure first (eink/frontend/dist)
    # Then fallback to Docker/Legacy structure
    # (eink/backend/static_dist)
    root_dir = os.path.dirname(os.path.dirname(__file__))
    static_dist = os.path.join(root_dir, "frontend", "dist")
    if not os.path.exists(static_dist):
        static_dist = os.path.join(os.path.dirname(__file__), "static_dist")

    if os.path.exists(static_dist):
        # Serve index.html at the root
        async def index(_):  # noqa: U101
            return web.FileResponse(os.path.join(static_dist, "index.html"))

        app.router.add_get("/", index)
        # Serve other static files (assets, etc.)
        app.router.add_static("/", static_dist)
