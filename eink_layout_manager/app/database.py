import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """Base class for all database models."""
    pass

def get_db_url():
    """Construct the database URL from environment or defaults."""
    data_dir = os.environ.get("DATA_DIR", "/data")
    db_path = os.path.join(data_dir, "eink_layout_manager.db")
    return f"sqlite+aiosqlite:///{db_path}"

# The engine will be initialised on app startup
_engine = None
_session_factory = None

async def init_db():
    """Initialise the database engine and create tables."""
    global _engine, _session_factory
    
    url = get_db_url()
    _engine = create_async_engine(url, echo=False)
    _session_factory = async_sessionmaker(
        _engine, 
        expire_on_commit=False,
        class_=AsyncSession
    )
    
    # Create tables if they don't exist
    async with _engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
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
