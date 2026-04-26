from aiohttp import web
from ..utils.validation import response_schema


@response_schema("status_response")
async def ping(request):
    """Health check endpoint. Returns 'pong' via JSON."""
    return web.json_response({"status": "pong"})
