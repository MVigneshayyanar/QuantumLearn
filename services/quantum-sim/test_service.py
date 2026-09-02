import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("Health check passed:", data)

def test_custom_circuit_bell_state():
    # H on 0, CX on 0->1
    payload = {
        "num_qubits": 2,
        "gates": [
            {"type": "h", "qubits": [0], "step": 0},
            {"type": "cx", "qubits": [0, 1], "step": 1}
        ],
        "shots": 1024
    }
    response = client.post("/simulate/custom", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["statevector"]) == 4
    # |00> amplitude ~ 0.7071, |11> amplitude ~ 0.7071
    assert data["probabilities"]["00"] > 0.45
    assert data["probabilities"]["11"] > 0.45
    # Since qubits are entangled, bloch_vectors should be null / warnings present
    assert len(data["warnings"]) > 0
    print("Bell State test passed. Entanglement warning:", data["warnings"])

def test_grover():
    payload = {
        "algorithm": "grover",
        "params": {"num_qubits": 2, "marked_state": "11"},
        "shots": 1024
    }
    response = client.post("/simulate/algorithm", json=payload)
    assert response.status_code == 200
    data = response.json()
    # 2-qubit Grover marks '11' with 100% probability
    assert data["probabilities"]["11"] > 0.99
    assert len(data["step_by_step"]) > 0
    print("Grover test passed. Step snapshots count:", len(data["step_by_step"]))

def test_teleportation():
    payload = {
        "algorithm": "teleportation",
        "params": {"state_prep": "plus"},
        "shots": 1024
    }
    response = client.post("/simulate/algorithm", json=payload)
    assert response.status_code == 200
    data = response.json()
    print("Teleportation test passed.")

if __name__ == "__main__":
    test_health()
    test_custom_circuit_bell_state()
    test_grover()
    test_teleportation()
    print("ALL PYTHON MICROSERVICE TESTS PASSED SUCCESSFULLY!")
