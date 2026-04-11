import os
from aiohttp import web

from . import database
from .middlewares import request_logger_middleware
from .routes import setup_routes
from .utils.storage import get_storage_path


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

    # Register routes
    setup_routes(app)

    return app


if __name__ == "__main__":
    port_env = os.environ.get("INGRESS_PORT")
    port = int(port_env) if port_env and port_env.strip() else 8099
    app = init_app()
    web.run_app(app, port=port)
