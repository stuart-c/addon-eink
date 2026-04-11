import os
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text


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


async def ensure_schema_up_to_date(conn):
    """Ensure the database schema matches the models by adding missing
    columns."""
    # Check 'images' table for recently added columns
    result = await conn.execute(text("PRAGMA table_info(images)"))
    columns = [row[1] for row in result.fetchall()]

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
        await conn.run_sync(Base.metadata.create_all)
        await ensure_schema_up_to_date(conn)

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
