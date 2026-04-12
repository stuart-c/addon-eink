import os
import pytest
from app import database
from sqlalchemy import text


@pytest.fixture
async def db_setup(tmp_path):
    """Fixture to set up and tear down a temporary test database."""
    # Use temporary directory for the DB file
    os.environ["DATA_DIR"] = str(tmp_path)
    await database.init_db()
    yield
    await database.close_db()


@pytest.mark.asyncio
async def test_init_db_creates_file(tmp_path):
    """Test that init_db creates the database file."""
    os.environ["DATA_DIR"] = str(tmp_path)
    db_file = os.path.join(str(tmp_path), "eink_layout_manager.db")

    # Ensure it doesn't exist yet
    if os.path.exists(db_file):
        os.remove(db_file)

    await database.init_db()
    assert os.path.exists(db_file)
    await database.close_db()


@pytest.mark.asyncio
async def test_get_session_connectivity(db_setup):
    """Test that we can get a session and run a simple query."""
    async with database.get_session() as session:
        result = await session.execute(text("SELECT 1"))
        assert result.scalar() == 1

        # Verify redundant tables are gone
        for table in ["display_types", "layouts"]:
            res = await session.execute(
                text(
                    "SELECT name FROM sqlite_master "
                    f"WHERE type='table' AND name='{table}'"
                )
            )
            assert res.scalar() is None


@pytest.mark.asyncio
async def test_get_session_without_init():
    """Test that get_session raises error if not initialised."""
    await database.close_db()  # Ensure closed
    # Reset internal factory for test
    database._session_factory = None

    with pytest.raises(RuntimeError) as excinfo:
        database.get_session()
    assert "Database not initialised" in str(excinfo.value)
