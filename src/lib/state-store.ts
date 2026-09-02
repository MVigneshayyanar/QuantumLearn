import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlacedGate, SimulationResult, ChatMessage, ConceptMastery, MisconceptionTag } from './types';
import { simulateLocalCircuit } from './quantum-simulator-core';

interface CircuitState {
  numQubits: number;
  gates: PlacedGate[];
  shots: number;
  activeStep: number;
  selectedSlot: { qubit: number; step: number } | null;
  simResult: SimulationResult | null;
  isLoading: boolean;
  
  setNumQubits: (n: number) => void;
  setShots: (s: number) => void;
  addGate: (type: PlacedGate['type'], qubits: number[], step: number) => void;
  removeGate: (id: string) => void;
  removeGateAt: (qubit: number, step: number) => void;
  clearCircuit: () => void;
  loadPreset: (numQubits: number, gates: PlacedGate[]) => void;
  setSelectedSlot: (slot: { qubit: number; step: number } | null) => void;
  setActiveStep: (step: number) => void;
  runSimulation: () => Promise<void>;
}

interface UserProgressState {
  completedModules: Record<string, boolean>; // e.g. { 'deutsch-jozsa': true }
  moduleScores: Record<string, number>;
  streakDays: number;
  lastActiveDate: string;
  conceptMastery: ConceptMastery;
  flaggedMisconceptions: Record<MisconceptionTag, number>;
  
  markModuleComplete: (slug: string, score: number) => void;
  recordMisconception: (tag: MisconceptionTag) => void;
  resolveMisconception: (tag: MisconceptionTag) => void;
  updateMastery: (concept: keyof ConceptMastery, delta: number) => void;
  incrementStreak: () => void;
}

interface AITutorState {
  isOpen: boolean;
  messages: ChatMessage[];
  isGenerating: boolean;
  contextPage: string;
  activeMisconception: string | null;
  
  setIsOpen: (open: boolean) => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setIsGenerating: (val: boolean) => void;
  setContextPage: (page: string) => void;
  setActiveMisconception: (tag: string | null) => void;
  clearChat: () => void;
}

export const useCircuitStore = create<CircuitState>((set, get) => ({
  numQubits: 2,
  gates: [
    { id: 'gate-init-1', type: 'h', qubits: [0], step: 0 },
    { id: 'gate-init-2', type: 'cx', qubits: [0, 1], step: 1 }
  ],
  shots: 1024,
  activeStep: 2,
  selectedSlot: { qubit: 0, step: 0 },
  simResult: null,
  isLoading: false,

  setNumQubits: (n: number) => {
    const clamped = Math.min(3, Math.max(1, n));
    set({
      numQubits: clamped,
      gates: get().gates.filter(g => g.qubits.every(q => q < clamped)),
      selectedSlot: { qubit: 0, step: 0 }
    });
    get().runSimulation();
  },

  setShots: (s: number) => {
    set({ shots: s });
    get().runSimulation();
  },

  addGate: (type, qubits, step) => {
    const currentGates = get().gates.filter(
      g => !(g.step === step && g.qubits.some(q => qubits.includes(q)))
    );
    const newGate: PlacedGate = {
      id: `gate-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      qubits,
      step
    };
    set({ gates: [...currentGates, newGate] });
    get().runSimulation();
  },

  removeGate: (id: string) => {
    set({ gates: get().gates.filter(g => g.id !== id) });
    get().runSimulation();
  },

  removeGateAt: (qubit: number, step: number) => {
    set({
      gates: get().gates.filter(g => !(g.step === step && g.qubits.includes(qubit)))
    });
    get().runSimulation();
  },

  clearCircuit: () => {
    set({ gates: [], activeStep: 0 });
    get().runSimulation();
  },

  loadPreset: (numQubits, gates) => {
    set({ numQubits, gates, activeStep: gates.length });
    get().runSimulation();
  },

  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setActiveStep: (step) => set({ activeStep: step }),

  runSimulation: async () => {
    const { numQubits, gates, shots } = get();
    set({ isLoading: true });

    try {
      // First try Python FastAPI microservice via Next.js proxy route
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num_qubits: numQubits,
          gates: gates.map(g => ({
            type: g.type,
            qubits: g.qubits,
            step: g.step
          })),
          shots
        })
      });

      if (response.ok) {
        const result: SimulationResult = await response.json();
        set({ simResult: result, isLoading: false });
        return;
      }
    } catch {
      // Fall back to client matrix simulator
    }

    const localResult = simulateLocalCircuit(numQubits, gates, shots);
    set({ simResult: localResult, isLoading: false });
  }
}));

export const useProgressStore = create<UserProgressState>()(
  persist(
    (set, get) => ({
      completedModules: {},
      moduleScores: {},
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      conceptMastery: {
        superposition: 40,
        entanglement: 30,
        phaseKickback: 20,
        interference: 35,
        measurement: 50
      },
      flaggedMisconceptions: {} as Record<MisconceptionTag, number>,

      markModuleComplete: (slug: string, score: number) => {
        set({
          completedModules: { ...get().completedModules, [slug]: true },
          moduleScores: { ...get().moduleScores, [slug]: Math.max(score, get().moduleScores[slug] || 0) }
        });
      },

      recordMisconception: (tag: MisconceptionTag) => {
        const current = get().flaggedMisconceptions[tag] || 0;
        set({
          flaggedMisconceptions: {
            ...get().flaggedMisconceptions,
            [tag]: current + 1
          }
        });
      },

      resolveMisconception: (tag: MisconceptionTag) => {
        const copy = { ...get().flaggedMisconceptions };
        delete copy[tag];
        set({ flaggedMisconceptions: copy });
      },

      updateMastery: (concept, delta) => {
        const current = get().conceptMastery[concept];
        const updated = Math.min(100, Math.max(0, current + delta));
        set({
          conceptMastery: { ...get().conceptMastery, [concept]: updated }
        });
      },

      incrementStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const last = get().lastActiveDate;
        if (today !== last) {
          set({ streakDays: get().streakDays + 1, lastActiveDate: today });
        }
      }
    }),
    {
      name: 'quantum_learn_progress'
    }
  )
);

export const useAITutorStore = create<AITutorState>((set, get) => ({
  isOpen: false,
  messages: [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: "Hello! I'm Schrödinger AI, your Socratic Quantum Tutor on QLearn. As you build circuits or explore algorithms, feel free to ask questions. If you get stuck on a quiz or wonder why a qubit behaves a certain way, I'll guide you step-by-step through the physics!",
      timestamp: Date.now()
    }
  ],
  isGenerating: false,
  contextPage: 'Home',
  activeMisconception: null,

  setIsOpen: (open) => set({ isOpen: open }),
  addMessage: (msg) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: Date.now()
    };
    set({ messages: [...get().messages, newMsg] });
  },
  setIsGenerating: (val) => set({ isGenerating: val }),
  setContextPage: (page) => set({ contextPage: page }),
  setActiveMisconception: (tag) => set({ activeMisconception: tag }),
  clearChat: () => set({ messages: [] })
}));
