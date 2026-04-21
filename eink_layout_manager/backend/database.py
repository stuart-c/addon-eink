import os
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text, select
import logging
import json


class Base(DeclarativeBase):
    """Base class for all database models."""

    pass


# Import models here so they are registered with Base.metadata
try:
    from . import models  # noqa: F401, E402
except ImportError:
    import models  # noqa: F401, E402


def get_db_url():
    """Construct the database URL from environment or defaults."""
    data_dir = os.environ.get("DATA_DIR", "/data")
    db_path = os.path.join(data_dir, "eink_layout_manager.db")
    return f"sqlite+aiosqlite:///{db_path}"


# The engine will be initialised on app startup
_engine = None
_session_factory = None


async def migrate_json_to_db():
    """Migrate display_type and layout JSON files to the database."""

    logger = logging.getLogger(__name__)

    async def _migrate_resource(resource_type, model_class):
        data_dir = os.environ.get("DATA_DIR", "/data")
        storage_path = os.path.join(data_dir, resource_type)

        if not os.path.exists(storage_path):
            return

        for filename in os.listdir(storage_path):
            if filename.endswith(".json"):
                file_path = os.path.join(storage_path, filename)
                try:
                    with open(file_path, "r") as f:
                        data = json.load(f)

                    item_id = data.get("id")
                    if not item_id:
                        continue

                    async with get_session() as session:
                        stmt = select(model_class).where(
                            model_class.id == item_id
                        )
                        result = await session.execute(stmt)
                        if result.scalars().first():
                            logger.debug(
                                f"{resource_type} {item_id} already in DB"
                            )
                        else:
                            item = model_class(**data)
                            session.add(item)
                            await session.commit()
                            logger.info(
                                f"Migrated {resource_type} {item_id} to DB"
                            )

                    # Rename file to prevent re-migration
                    os.rename(file_path, file_path + ".migrated")
                except Exception as e:
                    logger.error(f"Failed to migrate {file_path}: {str(e)}")

    await _migrate_resource("display_type", models.DisplayType)
    await _migrate_resource("layout", models.Layout)


async def ensure_schema_up_to_date(conn):
    """Ensure the database schema matches the models by adding missing
    columns."""
    # Check 'images' table for recently added columns
    result = await conn.execute(text("PRAGMA table_info(images)"))
    columns = [row[1] for row in result.fetchall()]

    if "description" not in columns:
        await conn.execute(
            text("ALTER TABLE images ADD COLUMN description VARCHAR")
        )

    if "conversion" not in columns:
        await conn.execute(
            text("ALTER TABLE images ADD COLUMN conversion JSON")
        )

    if "thumbnail_path" not in columns:
        await conn.execute(
            text("ALTER TABLE images ADD COLUMN thumbnail_path VARCHAR")
        )

    if "created_at" not in columns:
        await conn.execute(
            text(
                "ALTER TABLE images ADD COLUMN created_at DATETIME "
                "DEFAULT CURRENT_TIMESTAMP"
            )
        )

    if "updated_at" not in columns:
        await conn.execute(
            text(
                "ALTER TABLE images ADD COLUMN updated_at DATETIME "
                "DEFAULT CURRENT_TIMESTAMP"
            )
        )

    # Check 'scenes' table for recently added columns
    result = await conn.execute(text("PRAGMA table_info(scenes)"))
    columns = [row[1] for row in result.fetchall()]

    if "layout_id" not in columns:
        await conn.execute(
            text("ALTER TABLE scenes ADD COLUMN layout_id VARCHAR DEFAULT ''")
        )

    if "status" not in columns:
        await conn.execute(
            text(
                "ALTER TABLE scenes ADD COLUMN status VARCHAR DEFAULT 'draft'"
            )
        )

    if "items" not in columns:
        await conn.execute(text("ALTER TABLE scenes ADD COLUMN items JSON"))

    if "created_at" not in columns:
        await conn.execute(
            text(
                "ALTER TABLE scenes ADD COLUMN created_at DATETIME "
                "DEFAULT CURRENT_TIMESTAMP"
            )
        )

    if "updated_at" not in columns:
        await conn.execute(
            text(
                "ALTER TABLE scenes ADD COLUMN updated_at DATETIME "
                "DEFAULT CURRENT_TIMESTAMP"
            )
        )

    # Check 'display_types' table for recently added columns
    result = await conn.execute(text("PRAGMA table_info(display_types)"))
    columns = [row[1] for row in result.fetchall()]

    if "created_at" not in columns:
        await conn.execute(
            text(
                "ALTER TABLE display_types ADD COLUMN created_at DATETIME "
                "DEFAULT CURRENT_TIMESTAMP"
            )
        )

    if "updated_at" not in columns:
        await conn.execute(
            text(
                "ALTER TABLE display_types ADD COLUMN updated_at DATETIME "
                "DEFAULT CURRENT_TIMESTAMP"
            )
        )

    # Check 'layouts' table for recently added columns
    result = await conn.execute(text("PRAGMA table_info(layouts)"))
    columns = [row[1] for row in result.fetchall()]

    if "created_at" not in columns:
        await conn.execute(
            text(
                "ALTER TABLE layouts ADD COLUMN created_at DATETIME "
                "DEFAULT CURRENT_TIMESTAMP"
            )
        )

    if "updated_at" not in columns:
        await conn.execute(
            text(
                "ALTER TABLE layouts ADD COLUMN updated_at DATETIME "
                "DEFAULT CURRENT_TIMESTAMP"
            )
        )


async def init_db():
    """Initialise the database engine and create tables."""
    global _engine, _session_factory

    url = get_db_url()
    _engine = create_async_engine(url, echo=False)
    _session_factory = async_sessionmaker(
        _engine, expire_on_commit=False, class_=AsyncSession
    )

    # Create tables if they don't exist
    async with _engine.begin() as conn:
        await conn.execute(text("PRAGMA journal_mode=WAL"))
        await conn.run_sync(Base.metadata.create_all)
        await ensure_schema_up_to_date(conn)

    # Perform migration
    await migrate_json_to_db()

    return _engine


async def close_db():
    """Close the database engine connections."""
    global _engine
    if _engine:
        await _engine.dispose()
        _engine = None


def get_session():
    """Get a new async session."""
    if _session_factory is None:
        raise RuntimeError("Database not initialised. Call init_db() first.")
    return _session_factory()
