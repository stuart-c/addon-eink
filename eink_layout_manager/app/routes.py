import os
from aiohttp import web
from .handlers import common, items, images


def setup_routes(app):
    """Register all API and static routes."""

    # RESTful API
    # Valid resource types: display_type, layout, image
    api_prefix = "/api/{resource_type:(?:display_type|layout|image|scene)}"

    # Image specific routes (more specific routes first)
    app.router.add_get("/api/image/keywords", images.handle_image_keywords_get)
    app.router.add_get("/api/image", images.handle_image_list)
    app.router.add_get("/api/image/{id}", images.handle_image_get)
    app.router.add_get(
        "/api/image/{id}/thumbnail", images.handle_image_thumbnail_get
    )
    app.router.add_post("/api/image", images.handle_image_create)
    app.router.add_put("/api/image/{id}", images.handle_image_update)
    app.router.add_delete("/api/image/{id}", images.handle_image_delete)

    # Generic item routes
    app.router.add_get(f"{api_prefix}", items.get_collection)
    app.router.add_get(f"{api_prefix}/{{id}}", items.get_item)
    app.router.add_post(f"{api_prefix}", items.create_item)
    app.router.add_put(f"{api_prefix}/{{id}}", items.update_item)
    app.router.add_delete(f"{api_prefix}/{{id}}", items.delete_item)

    # Health check
    app.router.add_get("/api/ping", common.ping)

    # Static Lit frontend files
    static_dist = os.path.join(os.path.dirname(__file__), "static_dist")
    if os.path.exists(static_dist):
        # Serve index.html at the root
        async def index(request):
            return web.FileResponse(os.path.join(static_dist, "index.html"))

        app.router.add_get("/", index)
        # Serve other static files (assets, etc.)
        app.router.add_static("/", static_dist)
