import os
from aiohttp import web


async def handle_ping(request):
    return web.Response(text="pong")


def init_app():
    app = web.Application()
    app.router.add_get("/ping", handle_ping)
    # Placeholder for static Lit frontend files
    # app.router.add_static('/', 'static/')
    return app


if __name__ == "__main__":
    port = int(os.environ.get("INGRESS_PORT", 8099))
    app = init_app()
    web.run_app(app, port=port)
