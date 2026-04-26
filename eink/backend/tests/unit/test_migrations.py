import pytest
import os
from sqlalchemy import text
from backend import database


@pytest.mark.asyncio
async def test_migration_adds_missing_columns(tmp_path):
    """Test that init_db adds missing columns to an existing table."""
    # 1. Setup a manual data directory and DB
    os.environ["DATA_DIR"] = str(tmp_path)
    db_url = database.get_db_url()

    # 2. Pre-create the table with only partial columns
    from sqlalchemy.ext.asyncio import create_async_engine

    engine = create_async_engine(db_url)

    async with engine.begin() as conn:
        await conn.execute(
            text(
                "CREATE TABLE images ("
                "id VARCHAR PRIMARY KEY, "
                "name VARCHAR NOT NULL, "
                "file_type VARCHAR NOT NULL, "
                "width INTEGER NOT NULL, "
                "height INTEGER NOT NULL, "
                "file_path VARCHAR NOT NULL, "
                "status VARCHAR NOT NULL, "
                "file_hash VARCHAR NOT NULL"
                ")"
            )
        )

        # Verify columns are missing
        result = await conn.execute(text("PRAGMA table_info(images)"))
        columns = [row[1] for row in result.fetchall()]
        assert "thumbnail_path" not in columns
        assert "created_at" not in columns
        assert "updated_at" not in columns

    await engine.dispose()

    # 3. Run init_db which should trigger the migration
    await database.init_db()

    # 4. Verify columns now exist
    async with database.get_session() as session:
        conn = await session.connection()
        result = await conn.execute(text("PRAGMA table_info(images)"))
        columns = [row[1] for row in result.fetchall()]

        assert "thumbnail_path" in columns
        assert "created_at" in columns
        assert "updated_at" in columns

    await database.close_db()
