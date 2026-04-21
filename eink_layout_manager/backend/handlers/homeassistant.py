import os
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
    # Supervisor API uses the HOST address for the core API
    # Standard endpoint for addons to talk to HA Core
    base_url = "http://supervisor/core/api"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    try:
        # 1. Fetch config entries to find OpenDisplay entry ID
        entries_url = f"{base_url}/config/config_entries/get_entries"
        async with session.get(entries_url, headers=headers) as resp:
            if resp.status != 200:
                logger.error(f"Failed to fetch config entries: {resp.status}")
                return web.json_response(
                    {"error": "Failed to fetch config entries from HA"},
                    status=502,
                )

            entries = await resp.json()
            opendisplay_entry_ids = [
                entry["entry_id"]
                for entry in entries
                if entry.get("domain") == "opendisplay"
            ]

        if not opendisplay_entry_ids:
            logger.info("No OpenDisplay integration found in Home Assistant")
            return web.json_response([])

        # 2. Fetch device registry
        registry_url = f"{base_url}/config/device_registry/list"
        async with session.get(registry_url, headers=headers) as resp:
            if resp.status != 200:
                logger.error(f"Failed to fetch device registry: {resp.status}")
                return web.json_response(
                    {"error": "Failed to fetch device registry from HA"},
                    status=502,
                )

            devices = await resp.json()

        # 3. Filter devices
        filtered_devices = []
        for device in devices:
            # Check if any of the device's config entries match OpenDisplay
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
