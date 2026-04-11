from aiohttp import web


async def ping(request):
    """Health check endpoint. Returns 'pong'."""
    return web.Response(text="pong")
