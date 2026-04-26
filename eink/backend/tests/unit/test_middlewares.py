import logging
import pytest
from unittest.mock import AsyncMock, MagicMock
from backend.middlewares import request_logger_middleware


@pytest.mark.asyncio
async def test_request_logger_middleware_success(caplog):
    """Test that middleware logs request and calls handler."""
    mock_request = MagicMock()
    mock_request.method = "GET"
    mock_request.path = "/api/test"

    mock_handler = AsyncMock(return_value="response")

    with caplog.at_level(logging.INFO):
        response = await request_logger_middleware(mock_request, mock_handler)

        assert response == "response"
        mock_handler.assert_called_once_with(mock_request)

        # Verify it logged the request
        assert "REQUEST: GET /api/test" in caplog.text


@pytest.mark.asyncio
async def test_request_logger_middleware_exception(caplog):
    """Test that middleware logs exception and reraises it."""
    mock_request = MagicMock()
    mock_request.method = "POST"
    mock_request.path = "/api/fail"

    error = ValueError("Something went wrong")
    mock_handler = AsyncMock(side_effect=error)

    with caplog.at_level(logging.ERROR):
        with pytest.raises(ValueError, match="Something went wrong"):
            await request_logger_middleware(mock_request, mock_handler)

        # Verify it logged the exception
        assert "EXCEPTION in /api/fail: Something went wrong" in caplog.text
