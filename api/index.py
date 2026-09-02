import sys
import os

# Add the services/quantum-sim directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '../services/quantum-sim'))

# Import the FastAPI app from main.py
from main import app
