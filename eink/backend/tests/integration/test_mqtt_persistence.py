import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime
from sqlalchemy import select
from backend import database, models
from backend.background.mqtt import MQTTManager

@pytest.mark.asyncio
async def test_mqtt_persistence_saves_to_db(aiohttp_client, app):
    """Test that MQTT layout updates are saved to the database."""
    await aiohttp_client(app)
    
    async with database.get_session() as session:
        # Create a Layout
        layout = models.Layout(
            id="test-layout",
            name="Test Layout",
            canvas_width_mm=100,
            canvas_height_mm=100,
            items=[],
            status="active",
        )
        session.add(layout)
        
        # Create a Scene
        scene = models.Scene(
            id="test-scene",
            name="Test Scene",
            layout_id="test-layout",
            status="active",
        )
        session.add(scene)
        await session.commit()

    manager = MQTTManager(app=MagicMock())
    manager.client = MagicMock()
    manager._call_ha_upload = AsyncMock()

    # Trigger update
    await manager._handle_layout_update("test-layout", scene_name="Test Scene")

    # Verify database state
    async with database.get_session() as session:
        stmt = select(models.LayoutState).where(models.LayoutState.layout_id == "test-layout")
        result = await session.execute(stmt)
        state = result.scalar_one_or_none()
        
        assert state is not None
        assert state.scene_id == "test-scene"
        assert isinstance(state.last_change_date, datetime)

@pytest.mark.asyncio
async def test_mqtt_persistence_loads_from_db(aiohttp_client, app):
    """Test that MQTTManager loads state from the database on startup."""
    await aiohttp_client(app)
    
    async with database.get_session() as session:
        # Create a Layout
        layout = models.Layout(
            id="persist-layout",
            name="Persist Layout",
            canvas_width_mm=100,
            canvas_height_mm=100,
            items=[],
            status="active",
        )
        session.add(layout)
        
        # Create a Scene
        scene = models.Scene(
            id="persist-scene",
            name="Persist Scene",
            layout_id="persist-layout",
            status="active",
        )
        session.add(scene)
        
        # Add pre-existing state
        state = models.LayoutState(
            layout_id="persist-layout",
            scene_id="persist-scene",
            last_change_date=datetime.now()
        )
        session.add(state)
        await session.commit()

    manager = MQTTManager(app=MagicMock())
    manager.client = MagicMock()
    
    # Mock run_loop dependencies
    # We use a side effect to stop the loop after one iteration
    async def stop_loop(*args, **kwargs):
        manager.running = False

    with patch("asyncio.sleep", side_effect=stop_loop):
        await manager.run_loop()

    # Verify manager internal state
    assert "persist-layout" in manager.layout_states
    assert manager.layout_states["persist-layout"]["current_scene"] == "Persist Scene"
