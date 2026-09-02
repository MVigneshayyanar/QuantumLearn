from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ComplexAmplitude(BaseModel):
    re: float = Field(..., description="Real component")
    im: float = Field(..., description="Imaginary component")
    magnitude: float = Field(..., description="Absolute amplitude |a|")
    phase: float = Field(0.0, description="Phase angle in radians")

class BlochVector(BaseModel):
    qubit: int
    x: float
    y: float
    z: float
    theta: float = Field(0.0, description="Polar angle from +Z (|0>) in radians [0, pi]")
    phi: float = Field(0.0, description="Azimuthal angle from +X in XY plane in radians [0, 2pi)")
    purity: float = Field(1.0, description="Purity Tr(rho^2), 1.0 for pure state, <1.0 for mixed/entangled")
    is_pure: bool = Field(True, description="True if state is unentangled / pure")

class StepSnapshot(BaseModel):
    step: int
    label: str
    description_simple: Optional[str] = None
    description_technical: Optional[str] = None
    gate_applied: Optional[str] = None
    qubits_affected: List[int] = Field(default_factory=list)
    statevector: List[ComplexAmplitude] = Field(default_factory=list)
    probabilities: Dict[str, float] = Field(default_factory=dict)
    bloch_vectors: List[Optional[BlochVector]] = Field(default_factory=list)

class SimulationResponse(BaseModel):
    num_qubits: int
    statevector: List[ComplexAmplitude]
    probabilities: Dict[str, float]
    measurement_counts: Dict[str, int]
    bloch_vectors: List[Optional[BlochVector]]
    circuit_diagram_ascii: str
    warnings: List[str] = Field(default_factory=list)
    qasm: Optional[str] = None
    step_by_step: Optional[List[StepSnapshot]] = None
    execution_time_ms: float = 0.0

class HealthResponse(BaseModel):
    status: str
    version: str
    qiskit_version: str
    backend: str
