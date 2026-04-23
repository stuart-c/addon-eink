import asyncio
import json
import logging
import os
import signal
import uuid
from datetime import datetime

from gmqtt import Client as MQTTClient
from sqlalchemy import select

from backend import database, models

# Configuration
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()
MQTT_HOST = os.environ.get("MQTT_HOST")
MQTT_PORT = int(os.environ.get("MQTT_PORT", 1883))
MQTT_USER = os.environ.get("MQTT_USER")
MQTT_PASSWORD = os.environ.get("MQTT_PASSWORD")
MQTT_CLIENT_ID = os.environ.get("MQTT_CLIENT_ID", f"eink_layout_manager_{uuid.uuid4().hex[:8]}")

# Home Assistant Discovery Prefix
DISCOVERY_PREFIX = "homeassistant"
BASE_TOPIC = "eink_layout_manager"

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("mqtt_manager")

class MQTTManager:
    def __init__(self):
        self.client = MQTTClient(MQTT_CLIENT_ID)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.client.on_subscribe = self.on_subscribe
        
        self.running = True
        self.layout_states = {}  # layout_id -> { "current_scene": str, "last_updated": str }

    def on_connect(self, client, flags, rc, properties):
        logger.info("Connected to MQTT broker")
        # Subscribe to command topics for all layouts
        self.client.subscribe(f"{BASE_TOPIC}/layout/+/+/set")

    def on_message(self, client, topic, payload, qos, properties):
        logger.info(f"Received message on {topic}: {payload.decode()}")
        # As per requirement: "changes to them should not result in any action"
        pass

    def on_disconnect(self, client, packet, exc=None):
        logger.info("Disconnected from MQTT broker")

    def on_subscribe(self, client, mid, qos, properties):
        logger.info(f"Subscribed: {mid}")

    async def connect(self):
        if not MQTT_HOST:
            logger.error("MQTT_HOST not set. Cannot connect.")
            return False
            
        if MQTT_USER and MQTT_PASSWORD:
            self.client.set_auth_credentials(MQTT_USER, MQTT_PASSWORD)
            
        try:
            await self.client.connect(MQTT_HOST, MQTT_PORT)
            return True
        except Exception as e:
            logger.error(f"Failed to connect to MQTT: {e}")
            return False

    async def publish_discovery(self, layout, scenes):
        layout_id = layout.id
        device = {
            "identifiers": [f"eink_layout_manager_{layout_id}"],
            "name": f"Layout: {layout.name}",
            "manufacturer": "eInk Layout Manager",
            "model": "Layout",
            "sw_version": "0.1.0"
        }

        # 1. Last Updated Sensor
        sensor_config = {
            "name": "Last Updated",
            "unique_id": f"eink_layout_manager_{layout_id}_last_updated",
            "state_topic": f"{BASE_TOPIC}/layout/{layout_id}/last_updated/state",
            "device": device,
            "device_class": "timestamp",
            "entity_category": "diagnostic"
        }
        self.client.publish(
            f"{DISCOVERY_PREFIX}/sensor/{BASE_TOPIC}/{layout_id}_last_updated/config",
            json.dumps(sensor_config),
            retain=True
        )

        # 2. Scene Selector
        scene_options = [s.name for s in scenes]
        select_config = {
            "name": "Active Scene",
            "unique_id": f"eink_layout_manager_{layout_id}_scene",
            "state_topic": f"{BASE_TOPIC}/layout/{layout_id}/scene/state",
            "command_topic": f"{BASE_TOPIC}/layout/{layout_id}/scene/set",
            "options": scene_options,
            "device": device,
            "icon": "mdi:palette-outline"
        }
        self.client.publish(
            f"{DISCOVERY_PREFIX}/select/{BASE_TOPIC}/{layout_id}_scene/config",
            json.dumps(select_config),
            retain=True
        )

        # 3. Refresh Button
        button_config = {
            "name": "Refresh",
            "unique_id": f"eink_layout_manager_{layout_id}_refresh",
            "command_topic": f"{BASE_TOPIC}/layout/{layout_id}/refresh/set",
            "device": device,
            "icon": "mdi:refresh"
        }
        self.client.publish(
            f"{DISCOVERY_PREFIX}/button/{BASE_TOPIC}/{layout_id}_refresh/config",
            json.dumps(button_config),
            retain=True
        )

    async def update_state(self, layout, scenes):
        layout_id = layout.id
        timestamp = layout.updated_at.isoformat() if layout.updated_at else datetime.now().isoformat()
        
        # Publish timestamp
        self.client.publish(
            f"{BASE_TOPIC}/layout/{layout_id}/last_updated/state",
            timestamp,
            retain=True
        )

        # Publish current scene (default to first one if not set)
        if layout_id not in self.layout_states:
             current_scene = scenes[0].name if scenes else "None"
             self.layout_states[layout_id] = {"current_scene": current_scene}
        
        self.client.publish(
            f"{BASE_TOPIC}/layout/{layout_id}/scene/state",
            self.layout_states[layout_id]["current_scene"],
            retain=True
        )

    async def run_loop(self):
        await database.init_db()
        
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
                            models.Scene.status == "active"
                        )
                        scene_result = await session.execute(scene_stmt)
                        scenes = scene_result.scalars().all()

                        await self.publish_discovery(layout, scenes)
                        await self.update_state(layout, scenes)
                
                # Poll every 30 seconds
                await asyncio.sleep(30)
            except Exception as e:
                logger.error(f"Error in MQTT loop: {e}")
                await asyncio.sleep(10)

    async def stop(self):
        self.running = False
        await self.client.disconnect()

async def main():
    manager = MQTTManager()
    
    # Handle signals
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, lambda: asyncio.create_task(manager.stop()))

    if await manager.connect():
        await manager.run_loop()

if __name__ == "__main__":
    asyncio.run(main())
