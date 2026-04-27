import asyncio
import contextlib
import json
import logging
import os
import uuid
from datetime import datetime

from gmqtt import Client as MQTTClient
from sqlalchemy import select

from .. import database, models

# Home Assistant Discovery Prefix
DISCOVERY_PREFIX = "homeassistant"
BASE_TOPIC = "eink"

logger = logging.getLogger("mqtt_manager")


class MQTTManager:
    def __init__(self, app=None):
        mqtt_client_id = os.environ.get(
            "MQTT_CLIENT_ID", f"eink_{uuid.uuid4().hex[:8]}"
        )
        self.client = MQTTClient(mqtt_client_id)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.client.on_subscribe = self.on_subscribe

        self.app = app
        self.running = True
        self.layout_states = (
            {}
        )  # layout_id -> { "current_scene": str, "last_updated": str }
        self.task = None

    def on_connect(self, client, flags, rc, properties):
        logger.info("Connected to MQTT broker")
        # Subscribe to command topics for all layouts
        self.client.subscribe(f"{BASE_TOPIC}/layout/+/+/set")

    def on_message(self, client, topic, payload, qos, properties):
        message = payload.decode()
        logger.info(f"Received message on {topic}: {message}")

        # Topic format: eink/layout/{layout_id}/{command}/set
        parts = topic.split("/")
        if len(parts) >= 5 and parts[1] == "layout" and parts[4] == "set":
            layout_id = parts[2]
            command = parts[3]

            if command == "scene":
                self.layout_states.setdefault(layout_id, {})["current_scene"] = message
                asyncio.create_task(
                    self._handle_layout_update(layout_id, scene_name=message)
                )
            elif command == "refresh":
                asyncio.create_task(self._handle_layout_update(layout_id))

    def on_disconnect(self, client, packet, exc=None):
        logger.info("Disconnected from MQTT broker")

    def on_subscribe(self, client, mid, qos, properties):
        logger.info(f"Subscribed: {mid}")

    async def connect(self):
        mqtt_host = os.environ.get("MQTT_HOST")
        mqtt_port = int(os.environ.get("MQTT_PORT", 1883))
        mqtt_user = os.environ.get("MQTT_USER")
        mqtt_password = os.environ.get("MQTT_PASSWORD")

        if not mqtt_host:
            logger.info("MQTT_HOST not set. MQTT Manager will not start.")
            return False

        if mqtt_user and mqtt_password:
            self.client.set_auth_credentials(mqtt_user, mqtt_password)

        try:
            await self.client.connect(mqtt_host, mqtt_port)
            return True
        except Exception as e:
            logger.error(f"Failed to connect to MQTT: {e}")
            return False

    async def publish_discovery(self, layout, scenes):
        layout_id = layout.id
        device = {
            "identifiers": [f"eink_{layout_id}"],
            "name": f"Layout: {layout.name}",
            "manufacturer": "eInk Layout Manager",
            "model": "Layout",
            "sw_version": "0.1.0",
        }

        # 1. Last Updated Sensor
        sensor_config = {
            "name": "Last Updated",
            "unique_id": f"eink_{layout_id}_last_updated",
            "state_topic": (f"{BASE_TOPIC}/layout/{layout_id}/last_updated/state"),
            "device": device,
            "device_class": "timestamp",
            "entity_category": "diagnostic",
        }
        discovery_topic = (
            f"{DISCOVERY_PREFIX}/sensor/{BASE_TOPIC}/"
            f"{layout_id}_last_updated/config"
        )
        self.client.publish(
            discovery_topic,
            json.dumps(sensor_config),
            retain=True,
        )

        # 2. Scene Selector
        scene_options = [s.name for s in scenes]
        select_config = {
            "name": "Active Scene",
            "unique_id": f"eink_{layout_id}_scene",
            "state_topic": f"{BASE_TOPIC}/layout/{layout_id}/scene/state",
            "command_topic": f"{BASE_TOPIC}/layout/{layout_id}/scene/set",
            "options": scene_options,
            "device": device,
            "icon": "mdi:palette-outline",
        }
        self.client.publish(
            f"{DISCOVERY_PREFIX}/select/{BASE_TOPIC}/{layout_id}_scene/config",
            json.dumps(select_config),
            retain=True,
        )

        # 3. Refresh Button
        button_config = {
            "name": "Refresh",
            "unique_id": f"eink_{layout_id}_refresh",
            "command_topic": f"{BASE_TOPIC}/layout/{layout_id}/refresh/set",
            "device": device,
            "icon": "mdi:refresh",
        }
        discovery_topic = (
            f"{DISCOVERY_PREFIX}/button/{BASE_TOPIC}/" f"{layout_id}_refresh/config"
        )
        self.client.publish(
            discovery_topic,
            json.dumps(button_config),
            retain=True,
        )

    async def update_state(self, layout, scenes):
        layout_id = layout.id
        timestamp = (
            layout.updated_at.isoformat()
            if layout.updated_at
            else datetime.now().isoformat()
        )

        # Publish timestamp
        self.client.publish(
            f"{BASE_TOPIC}/layout/{layout_id}/last_updated/state",
            timestamp,
            retain=True,
        )

        # Publish current scene (default to first one if not set)
        if layout_id not in self.layout_states:
            current_scene = scenes[0].name if scenes else "None"
            self.layout_states[layout_id] = {"current_scene": current_scene}

        self.client.publish(
            f"{BASE_TOPIC}/layout/{layout_id}/scene/state",
            self.layout_states[layout_id]["current_scene"],
            retain=True,
        )

    async def run_loop(self):
        while self.running:
            try:
                async with database.get_session() as session:
                    # Get all active layouts
                    stmt = select(models.Layout).where(models.Layout.status == "active")
                    result = await session.execute(stmt)
                    layouts = result.scalars().all()

                    for layout in layouts:
                        # Get all active scenes for this layout
                        scene_stmt = select(models.Scene).where(
                            models.Scene.layout_id == layout.id,
                            models.Scene.status == "active",
                        )
                        scene_result = await session.execute(scene_stmt)
                        scenes = scene_result.scalars().all()

                        await self.publish_discovery(layout, scenes)
                        await self.update_state(layout, scenes)

                # Poll every 30 seconds
                await asyncio.sleep(30)
            except Exception as e:
                if self.running:
                    logger.error(f"Error in MQTT loop: {e}")
                    await asyncio.sleep(10)

    async def start(self):
        if await self.connect():
            self.task = asyncio.create_task(self.run_loop())

    async def _handle_layout_update(self, layout_id, scene_name=None):
        """Trigger update of all displays for a given layout/scene."""
        try:
            async with database.get_session() as session:
                # 1. Fetch the layout
                stmt = select(models.Layout).where(models.Layout.id == layout_id)
                result = await session.execute(stmt)
                layout = result.scalar_one_or_none()
                if not layout:
                    logger.warning(f"Layout {layout_id} not found for update")
                    return

                # 2. Identify the active scene
                if not scene_name:
                    scene_name = self.layout_states.get(layout_id, {}).get(
                        "current_scene"
                    )

                if not scene_name:
                    # Try to find the first active scene if none specified
                    scene_stmt = (
                        select(models.Scene)
                        .where(
                            models.Scene.layout_id == layout_id,
                            models.Scene.status == "active",
                        )
                        .limit(1)
                    )
                    scene_result = await session.execute(scene_stmt)
                    scene = scene_result.scalar_one_or_none()
                else:
                    scene_stmt = select(models.Scene).where(
                        models.Scene.layout_id == layout_id,
                        models.Scene.name == scene_name,
                    )
                    scene_result = await session.execute(scene_stmt)
                    scene = scene_result.scalar_one_or_none()

                if not scene:
                    logger.warning(f"Active scene not found for layout {layout_id}")
                    return

                # 3. Update states and timestamp
                timestamp = datetime.now().isoformat()
                self.client.publish(
                    f"{BASE_TOPIC}/layout/{layout_id}/last_updated/state",
                    timestamp,
                    retain=True,
                )
                self.client.publish(
                    f"{BASE_TOPIC}/layout/{layout_id}/scene/state",
                    scene.name,
                    retain=True,
                )

                # 4. Query SceneDisplayImage for all available images in this scene
                slice_stmt = select(models.SceneDisplayImage).where(
                    models.SceneDisplayImage.scene_id == scene.id
                )
                slice_result = await session.execute(slice_stmt)
                slices = slice_result.scalars().all()

                if not slices:
                    logger.warning(
                        f"No slices found in SceneDisplayImage " f"for scene {scene.id}"
                    )
                    return

                # 5. Group slices to find items
                display_images = {}  # display_id -> set(image_id)
                slice_map = {}  # (display_id, image_id) -> filename
                for s in slices:
                    display_images.setdefault(s.display_id, set()).add(s.image_id)
                    slice_map[(s.display_id, s.image_id)] = s.filename

                # Group displays by their image set (reconstructing clusters/items)
                image_set_to_displays = {}  # frozenset(image_ids) -> [display_id, ...]
                for d_id, i_ids in display_images.items():
                    key = frozenset(i_ids)
                    image_set_to_displays.setdefault(key, []).append(d_id)

                # 6. For each cluster, pick a random image and call HA
                import random

                for i_ids, d_ids in image_set_to_displays.items():
                    chosen_image_id = random.choice(list(i_ids))

                    for d_id in d_ids:
                        filename = slice_map.get((d_id, chosen_image_id))
                        if not filename:
                            continue

                        # Find device_id from layout
                        device_id = next(
                            (
                                item.get("device_id")
                                for item in layout.items
                                if item.get("id") == d_id
                            ),
                            None,
                        )

                        if device_id:
                            await self._call_ha_upload(device_id, filename)
                        else:
                            logger.warning(
                                f"No device_id found in layout {layout_id} "
                                f"for display {d_id}"
                            )

        except Exception as e:
            logger.exception(f"Error handling layout update for {layout_id}: {e}")

    async def _call_ha_upload(self, device_id, filename):
        """Call HA opendisplay.upload_image service."""
        token = os.environ.get("SUPERVISOR_TOKEN")
        if not token or not self.app:
            logger.warning(
                "No SUPERVISOR_TOKEN or app instance, " "skipping HA service call"
            )
            return

        url = "http://supervisor/core/api/services/opendisplay/upload_image"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        payload = {
            "device_id": device_id,
            "image": {
                "media_content_id": (
                    f"media-source://media_source/local/"
                    f"eink/scene_display/{filename}"
                ),
                "media_content_type": "image/png",
            },
            "dither_mode": "none",
            "rotation": 90,
            "fit_mode": "crop",
        }

        try:
            session = self.app["client_session"]
            async with session.post(url, headers=headers, json=payload) as resp:
                if resp.status != 200:
                    text = await resp.text()
                    logger.error(
                        f"Failed to call HA service for device {device_id}: "
                        f"{resp.status} - {text}\n"
                        f"Payload: {payload}"
                    )
                else:
                    logger.info(
                        f"Successfully triggered image upload for "
                        f"device {device_id}"
                    )
        except Exception as e:
            logger.error(f"Error calling HA service for device {device_id}: {e}")

    async def stop(self):
        self.running = False
        if self.task:
            self.task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self.task
        await self.client.disconnect()


_manager = None


async def start_mqtt(app):
    """aiohttp startup hook to start MQTT manager."""
    global _manager
    _manager = MQTTManager(app=app)
    await _manager.start()
    app["mqtt_manager"] = _manager


async def stop_mqtt(app):
    """aiohttp cleanup hook to stop MQTT manager."""
    global _manager
    if _manager:
        await _manager.stop()
        _manager = None
