import pytest
import os
import signal
import subprocess
import time
import requests
import sys

# Add eink_layout_manager to sys.path
python_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(python_path)


@pytest.fixture(scope="session")
def app_url():
    """Start the application and return its URL."""
    # python_path is eink_layout_manager
    python_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # root_dir is eink_layout_manager/app
    root_dir = os.path.join(python_path, "app")
    
    env = os.environ.copy()
    env["INGRESS_PORT"] = "8123"
    env["PYTHONPATH"] = python_path

    # Ensure storage directories exist
    os.makedirs("/tmp/eink-data", exist_ok=True)
    env["DATA_DIR"] = "/tmp/eink-data"

    process = subprocess.Popen(
        ["python3", "main.py"],
        env=env,
        cwd=root_dir,
        preexec_fn=os.setsid,
    )

    url = "http://localhost:8123"

    # Wait for app to start
    max_retries = 30
    for _ in range(max_retries):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                break
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(1)
    else:
        os.killpg(os.getpgid(process.pid), signal.SIGTERM)
        pytest.fail("Application failed to start")

    yield url

    # Shutdown app
    os.killpg(os.getpgid(process.pid), signal.SIGTERM)
