import traceback
from aiohttp import web


@web.middleware
async def request_logger_middleware(request, handler):
    """Log every incoming request for debugging."""
    print(f"REQUEST: {request.method} {request.path}")
    try:
        return await handler(request)
    except Exception as e:
        print(f"EXCEPTION in {request.path}: {str(e)}")
        traceback.print_exc()
        raise
