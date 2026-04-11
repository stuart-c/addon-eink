import os
import pytest
from app.main import init_app


@pytest.fixture
def app(tmp_path):
    """
    Fixture to initialise the application for testing
    using a temporary data directory.
    """
    # Override DATA_DIR for tests
    os.environ["DATA_DIR"] = str(tmp_path)
    return init_app()
