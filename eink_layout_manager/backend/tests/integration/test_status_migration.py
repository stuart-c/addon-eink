"""Tests for database status migrations."""

import pytest
from sqlalchemy import text, select
from backend import database, models


@pytest.mark.asyncio
async def test_ready_to_active_status_migration(tmp_path):
    """Test that READY images are migrated to ACTIVE status."""
    import os
    os.environ["DATA_DIR"] = str(tmp_path)

    # 1. Initialize DB once to create schema
    await database.init_db()

    try:
        # 2. Manually insert a READY image using raw SQL
        async with database._engine.begin() as conn:
            stmt = text(
                "INSERT INTO images (id, name, file_type, width, height, "
                "file_path, status, file_hash, brightness, contrast, "
                "saturation) VALUES ('legacy-id', 'Legacy Image', 'PNG', "
                "'100', '100', 'legacy.png', 'READY', 'h1', 1.0, 1.0, 1.0)"
            )
            await conn.execute(stmt)

        # 3. Trigger ensure_schema_up_to_date by calling it manually
        async with database._engine.begin() as conn:
            await database.ensure_schema_up_to_date(conn)

        # 4. Verify image status is now ACTIVE
        async with database.get_session() as session:
            stmt = select(models.Image).where(models.Image.id == "legacy-id")
            result = await session.execute(stmt)
            image = result.scalar_one()
            assert image.status == "ACTIVE"

    finally:
        await database.close_db()
