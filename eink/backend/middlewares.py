import logging
from aiohttp import web

logger = logging.getLogger(__name__)


@web.middleware
async def request_logger_middleware(request, handler):
    """Log every incoming request for debugging."""
    logger.info(f"REQUEST: {request.method} {request.path}")
    try:
        return await handler(request)
    except Exception as e:
        logger.exception(f"EXCEPTION in {request.path}: {str(e)}")
        raise
