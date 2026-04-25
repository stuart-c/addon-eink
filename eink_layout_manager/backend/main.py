import os
import logging
import aiohttp
from aiohttp import web

from backend import database
from backend.middlewares import request_logger_middleware
from backend.routes import setup_routes
from backend.utils.storage import get_storage_path
from backend.background.cleanup import (
    schedule_image_cleanup,
    stop_image_cleanup,
)
from backend.background.mqtt import (
    start_mqtt,
    stop_mqtt,
)
from backend.background.scene_processor import (
    schedule_scene_processing,
    stop_scene_processing,
)


def init_app():
    """Initialise the aiohttp application with routes and storage setup."""
    app = web.Application(middlewares=[request_logger_middleware])

    async def on_startup(app):
        """Database and storage initialisation on start."""
        await database.init_db()
        app["client_session"] = aiohttp.ClientSession()

    async def on_cleanup(app):
        """Cleanup on app shutdown."""
        await database.close_db()
        if "client_session" in app:
            await app["client_session"].close()

    app.on_startup.append(on_startup)
    app.on_startup.append(schedule_image_cleanup)
    app.on_startup.append(start_mqtt)
    app.on_startup.append(schedule_scene_processing)
    app.on_cleanup.append(stop_image_cleanup)
    app.on_cleanup.append(stop_mqtt)
    app.on_cleanup.append(stop_scene_processing)
    app.on_cleanup.append(on_cleanup)

    # Data directory setup
    try:
        os.makedirs(get_storage_path("image"), exist_ok=True)
        os.makedirs(get_storage_path("thumbnail"), exist_ok=True)
        os.makedirs(get_storage_path("scene_display"), exist_ok=True)
    except ValueError as e:
        print(f"Error initialising storage: {str(e)}")

    # Register routes
    setup_routes(app)

    return app


if __name__ == "__main__":
    port_env = os.environ.get("INGRESS_PORT")
    port = int(port_env) if port_env and port_env.strip() else 8099
    # Configure logging
    log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(
        level=getattr(logging, log_level, logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    app = init_app()
    web.run_app(app, port=port, access_log=None)
