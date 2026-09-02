import time
import qiskit
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from schemas.requests import CustomCircuitRequest, AlgorithmSimulationRequest
from schemas.responses import SimulationResponse, HealthResponse
from circuits.builder import build_circuit_from_request
from circuits.algorithms import get_algorithm_simulation
from simulate.engine import simulate_circuit

app = FastAPI(
    title="QuantumLearn Simulation Microservice",
    description="High-fidelity quantum circuit simulation powered by Qiskit",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
def health_check():
    """Liveness check for container orchestration and deployment monitoring."""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        qiskit_version=qiskit.__version__,
        backend="qiskit-statevector-engine"
    )

@app.post("/simulate/custom", response_model=SimulationResponse)
def simulate_custom(req: CustomCircuitRequest):
    """
    Simulates a user-designed quantum circuit.
    Calculates exact statevector amplitudes, measurement probabilities,
    Bloch vectors, and step-by-step intermediate snapshots.
    """
    start_time = time.perf_counter()
    try:
        qc, step_snapshots = build_circuit_from_request(req)
        sim_data = simulate_circuit(qc, shots=req.shots)
        
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        
        return SimulationResponse(
            num_qubits=req.num_qubits,
            statevector=sim_data["statevector"],
            probabilities=sim_data["probabilities"],
            measurement_counts=sim_data["measurement_counts"],
            bloch_vectors=sim_data["bloch_vectors"],
            circuit_diagram_ascii=sim_data["circuit_diagram_ascii"],
            warnings=sim_data["warnings"],
            qasm=sim_data.get("qasm"),
            step_by_step=step_snapshots,
            execution_time_ms=round(elapsed_ms, 2)
        )
    except IndexError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Circuit validation error: {str(e)}"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Gate or parameter error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation error: {str(e)}"
        )

@app.post("/simulate/algorithm", response_model=SimulationResponse)
def simulate_algorithm(req: AlgorithmSimulationRequest):
    """
    Simulates one of the 4 pre-built algorithm modules (Deutsch-Jozsa, Grover, Teleportation, Superdense Coding)
    with step-by-step statevector snapshots and pedagogical descriptions.
    """
    start_time = time.perf_counter()
    try:
        qc, snapshots, final_sim = get_algorithm_simulation(
            algorithm=req.algorithm,
            params=req.params,
            shots=req.shots
        )
        
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        
        return SimulationResponse(
            num_qubits=qc.num_qubits,
            statevector=final_sim["statevector"],
            probabilities=final_sim["probabilities"],
            measurement_counts=final_sim["measurement_counts"],
            bloch_vectors=final_sim["bloch_vectors"],
            circuit_diagram_ascii=final_sim["circuit_diagram_ascii"],
            warnings=final_sim["warnings"],
            qasm=final_sim.get("qasm"),
            step_by_step=snapshots,
            execution_time_ms=round(elapsed_ms, 2)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Algorithm simulation error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
