import os
import aiohttp
import logging
from aiohttp import web
from ..utils.validation import response_schema

logger = logging.getLogger(__name__)


@response_schema("homeassistant_device_list")
async def handle_device_list(request):
    """Fetch a list of OpenDisplay devices from Home Assistant."""
    token = os.environ.get("SUPERVISOR_TOKEN")
    if not token:
        logger.warning(
            "SUPERVISOR_TOKEN not found, returning empty list (local development)"
        )
        return web.json_response([])

    session = request.app["client_session"]
    ws_url = "ws://supervisor/core/websocket"

    try:
        async with session.ws_connect(ws_url) as ws:
            # 1. Wait for auth_required
            msg = await ws.receive_json()
            if msg.get("type") != "auth_required":
                logger.error(f"Unexpected message from HA websocket: {msg}")
                return web.json_response(
                    {"error": "Failed to authenticate with Home Assistant"},
                    status=502,
                )
            
            # 2. Send auth
            await ws.send_json({"type": "auth", "access_token": token})
            auth_ok = await ws.receive_json()
            if auth_ok.get("type") != "auth_ok":
                logger.error(f"Authentication failed: {auth_ok}")
                return web.json_response(
                    {"error": "Authentication failed with Home Assistant"},
                    status=502,
                )
            
            # 3. Request config entries
            await ws.send_json({"id": 1, "type": "config_entries/get"})
            entries_msg = await ws.receive_json()
            if not entries_msg.get("success"):
                logger.error(f"Failed to get config entries: {entries_msg}")
                return web.json_response(
                    {"error": "Failed to fetch config entries from HA"},
                    status=502,
                )
            
            entries = entries_msg.get("result", [])
            opendisplay_entry_ids = [
                entry["entry_id"]
                for entry in entries
                if entry.get("domain") == "opendisplay"
            ]

            if not opendisplay_entry_ids:
                logger.info("No OpenDisplay integration found in Home Assistant")
                return web.json_response([])

            # 4. Request device registry
            await ws.send_json({"id": 2, "type": "config/device_registry/list"})
            devices_msg = await ws.receive_json()
            if not devices_msg.get("success"):
                logger.error(f"Failed to get device registry: {devices_msg}")
                return web.json_response(
                    {"error": "Failed to fetch device registry from HA"},
                    status=502,
                )
            
            devices = devices_msg.get("result", [])
            
            # 5. Filter Devices
            filtered_devices = []
            for device in devices:
                device_entries = device.get("config_entries", [])
                if any(eid in opendisplay_entry_ids for eid in device_entries):
                    filtered_devices.append(
                        {
                            "id": device["id"],
                            "name": device.get("name_by_user")
                            or device.get("name")
                            or "Unknown Device",
                            "model": device.get("model"),
                            "manufacturer": device.get("manufacturer"),
                        }
                    )
            
            return web.json_response(filtered_devices)

    except Exception as e:
        logger.exception("Error fetching devices from Home Assistant")
        return web.json_response({"error": str(e)}, status=500)
