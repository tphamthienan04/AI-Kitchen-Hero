from pathlib import Path
import importlib
import sys

# Ensure the root path is in sys.path so backend can be loaded
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

# Import the FastAPI app from the backend module
try:
    backend_app = importlib.import_module('backend.main')
    app = getattr(backend_app, 'app')
except Exception as e:
    raise RuntimeError(f'Unable to load FastAPI app from backend.main: {e}')
