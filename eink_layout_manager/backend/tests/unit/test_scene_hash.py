"""Unit tests for scene hash calculation and migration."""

import hashlib
import json
import os

import pytest
from sqlalchemy import text

from backend import database, models


@pytest.mark.asyncio
async def test_scene_migration_adds_hash_column(tmp_path):
    """Test that init_db adds scene_hash column to an existing scenes table."""
    # 1. Setup a manual data directory and DB
    os.environ["DATA_DIR"] = str(tmp_path)
    db_url = database.get_db_url()

    # 2. Pre-create the table without scene_hash
    from sqlalchemy.ext.asyncio import create_async_engine

    engine = create_async_engine(db_url)

    async with engine.begin() as conn:
        await conn.execute(
            text(
                "CREATE TABLE scenes ("
                "id VARCHAR PRIMARY KEY, "
                "name VARCHAR NOT NULL, "
                "layout_id VARCHAR NOT NULL, "
                "status VARCHAR NOT NULL, "
                "items JSON, "
                "created_at DATETIME DEFAULT CURRENT_TIMESTAMP, "
                "updated_at DATETIME DEFAULT CURRENT_TIMESTAMP"
                ")"
            )
        )
        # Insert a scene without hash
        items = [
            {"id": "item1", "type": "image", "displays": ["d1"], "images": []}
        ]
        await conn.execute(
            text(
                "INSERT INTO scenes (id, name, layout_id, status, items) "
                "VALUES (:id, :name, :layout_id, :status, :items)"
            ),
            {
                "id": "scene1",
                "name": "Test Scene",
                "layout_id": "layout1",
                "status": "draft",
                "items": json.dumps(items),
            },
        )

    await engine.dispose()

    # 3. Run init_db which should trigger the migration
    await database.init_db()

    # 4. Verify columns now exist and hash is populated
    async with database.get_session() as session:
        conn = await session.connection()
        result = await conn.execute(text("PRAGMA table_info(scenes)"))
        columns = [row[1] for row in result.fetchall()]
        assert "scene_hash" in columns

        result = await conn.execute(
            text(
                "SELECT id, scene_hash, items FROM scenes WHERE id = 'scene1'"
            )
        )
        row = result.fetchone()
        assert row is not None
        scene_id, scene_hash, items_raw = row
        assert scene_hash is not None

        # Verify hash value
        expected_hash = hashlib.sha256(
            json.dumps(items, sort_keys=True).encode()
        ).hexdigest()
        assert scene_hash == expected_hash

    await database.close_db()


@pytest.mark.asyncio
async def test_scene_model_updates_hash_on_save(tmp_path):
    """Test that the Scene model updates its hash automatically when saved."""
    # Ensure fresh DB for this test too
    os.environ["DATA_DIR"] = str(tmp_path)
    await database.init_db()

    # This requires a database session
    async with database.get_session() as session:
        items = [
            {"id": "item1", "type": "image", "displays": ["d1"], "images": []}
        ]
        scene = models.Scene(
            id="test_scene_save",
            name="Test Scene Save",
            layout_id="layout1",
            items=items,
        )
        session.add(scene)
        await session.commit()
        await session.refresh(scene)

        assert scene.scene_hash is not None
        expected_hash = hashlib.sha256(
            json.dumps(items, sort_keys=True).encode()
        ).hexdigest()
        assert scene.scene_hash == expected_hash

        # Update items
        new_items = [
            {
                "id": "item1",
                "type": "image",
                "displays": ["d1"],
                "images": [{"image_id": "img1"}],
            }
        ]
        scene.items = new_items
        await session.commit()
        await session.refresh(scene)

        new_expected_hash = hashlib.sha256(
            json.dumps(new_items, sort_keys=True).encode()
        ).hexdigest()
        assert scene.scene_hash == new_expected_hash
        assert scene.scene_hash != expected_hash

    await database.close_db()
