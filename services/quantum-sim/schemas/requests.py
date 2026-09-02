from typing import List, Literal, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator

GateType = Literal["h", "x", "y", "z", "s", "t", "cx", "cz", "swap", "measure"]

class GateOperation(BaseModel):
    type: GateType = Field(..., description="Gate identifier: h, x, y, z, s, t, cx, cz, swap, measure")
    qubits: List[int] = Field(..., description="Qubit indices operated on (1 index for 1-qubit gates, 2 for 2-qubit gates)")
    step: int = Field(0, ge=0, description="Horizontal position/time step in the circuit")
    params: Optional[Dict[str, Any]] = Field(default=None, description="Optional gate parameters, e.g. rotation angle")

    @field_validator("type", mode="before")
    @classmethod
    def normalize_gate_type(cls, v: str) -> str:
        return v.lower().strip() if isinstance(v, str) else v

class CustomCircuitRequest(BaseModel):
    num_qubits: int = Field(..., ge=1, le=5, description="Number of qubits in circuit (MVP default: 2-3)")
    gates: List[GateOperation] = Field(default_factory=list, description="List of gate operations ordered by step")
    shots: int = Field(1024, ge=1, le=8192, description="Number of measurement repetitions for probability sampling")

class AlgorithmSimulationRequest(BaseModel):
    algorithm: Literal["deutsch_jozsa", "grover", "teleportation", "superdense_coding"] = Field(
        ..., description="Pre-built algorithm identifier"
    )
    params: Dict[str, Any] = Field(
        default_factory=dict,
        description="Algorithm parameters (e.g. oracle_type for DJ, marked_state for Grover, bits for Teleportation/Superdense)"
    )
    shots: int = Field(1024, ge=1, le=8192, description="Number of measurement shots")
