import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.middlewares import request_logger_middleware


@pytest.mark.asyncio
async def test_request_logger_middleware_success():
    """Test that middleware logs request and calls handler."""
    mock_request = MagicMock()
    mock_request.method = "GET"
    mock_request.path = "/api/test"

    mock_handler = AsyncMock(return_value="response")

    with patch("builtins.print") as mock_print:
        response = await request_logger_middleware(mock_request, mock_handler)

        assert response == "response"
        mock_handler.assert_called_once_with(mock_request)

        # Verify it logged the request
        mock_print.assert_any_call("REQUEST: GET /api/test")


@pytest.mark.asyncio
async def test_request_logger_middleware_exception():
    """Test that middleware logs exception and reraises it."""
    mock_request = MagicMock()
    mock_request.method = "POST"
    mock_request.path = "/api/fail"

    error = ValueError("Something went wrong")
    mock_handler = AsyncMock(side_effect=error)

    with (
        patch("builtins.print") as mock_print,
        patch("traceback.print_exc") as mock_traceback,
    ):

        with pytest.raises(ValueError, match="Something went wrong"):
            await request_logger_middleware(mock_request, mock_handler)

        # Verify it logged the exception
        mock_print.assert_any_call(
            "EXCEPTION in /api/fail: Something went wrong"
        )
        mock_traceback.assert_called_once()
