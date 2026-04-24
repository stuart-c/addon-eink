import os
import pytest
from backend.main import init_app


@pytest.fixture
def app(tmp_path):
    """
    Fixture to initialise the application for testing
    using a temporary data directory.
    """
    # Override DATA_DIR and SHARE_DIR for tests
    os.environ["DATA_DIR"] = str(tmp_path)
    os.environ["SHARE_DIR"] = os.path.join(tmp_path, "share")
    return init_app()
