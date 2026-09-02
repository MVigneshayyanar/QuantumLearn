export type GateType = 'h' | 'x' | 'y' | 'z' | 's' | 't' | 'cx' | 'cz' | 'swap' | 'measure';

export interface PlacedGate {
  id: string;
  type: GateType;
  qubits: number[]; // e.g. [0] for single qubit, [0, 1] for 2-qubit (control, target)
  step: number;     // 0 to max_steps - 1
  params?: Record<string, number>;
}

export interface ComplexAmplitude {
  re: number;
  im: number;
  magnitude: number;
  phase: number;
}

export interface BlochVector {
  qubit: number;
  x: number;
  y: number;
  z: number;
  theta: number; // [0, pi]
  phi: number;   // [0, 2pi]
  purity: number;// 1.0 = pure, <1.0 = mixed/entangled
  is_pure: boolean;
}

export interface StepSnapshot {
  step: number;
  label: string;
  description_simple?: string;
  description_technical?: string;
  gate_applied?: string;
  qubits_affected: number[];
  statevector: ComplexAmplitude[];
  probabilities: Record<string, number>;
  bloch_vectors: (BlochVector | null)[];
}

export interface SimulationResult {
  num_qubits: number;
  statevector: ComplexAmplitude[];
  probabilities: Record<string, number>;
  measurement_counts: Record<string, number>;
  bloch_vectors: (BlochVector | null)[];
  circuit_diagram_ascii: string;
  warnings: string[];
  qasm?: string;
  step_by_step?: StepSnapshot[];
  execution_time_ms: number;
}

export type AlgorithmId = 'deutsch-jozsa' | 'grover' | 'teleportation' | 'superdense-coding';

export type MisconceptionTag =
  | 'SUPERPOSITION_VS_CLASSICAL_PROB'
  | 'ENTANGLEMENT_COMMUNICATION'
  | 'PHASE_KICKBACK_MISUNDERSTANDING'
  | 'NO_CLONING_VIOLATION'
  | 'MEASUREMENT_COLLAPSE'
  | 'DEUTSCH_ORACLE_QUERY'
  | 'GROVER_AMPLITUDE_MEAN'
  | 'SUPERDENSE_BIT_CAPACITY';

export interface QuizOption {
  id: string;
  text: string;
  text_hi?: string;
  is_correct: boolean;
  explanation: string;
  explanation_hi?: string;
  misconception_tag?: MisconceptionTag;
}

export interface QuizQuestion {
  id: string;
  module_slug: string;
  question: string;
  question_hi?: string;
  options: QuizOption[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concept_tag: string;
  hint: string;
  hint_hi?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  contextSnippet?: string;
  misconceptionAlert?: string;
  practiceQuestion?: QuizQuestion;
}

export interface ConceptMastery {
  superposition: number; // 0-100
  entanglement: number;
  phaseKickback: number;
  interference: number;
  measurement: number;
}
