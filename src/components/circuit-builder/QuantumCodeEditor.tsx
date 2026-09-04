'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import {
  parseQiskitCode,
  generateQiskitCode,
  generateCirqCode,
  generatePennyLaneCode,
  ParseError,
  SupportedSyntaxDialect
} from '@/lib/circuit-code-parser';
import { PlacedGate } from '@/lib/types';
import {
  Play,
  RotateCcw,
  Sparkles,
  Bug,
  Check,
  AlertCircle,
  Code,
  Copy,
  ChevronDown,
  Loader2,
  Wand2,
  Info,
  Layers,
  Terminal
} from 'lucide-react';

// Monaco editor loaded dynamically on client only to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full bg-dark-950 text-dark-400 font-mono text-xs flex items-center justify-center rounded-xl border border-dark-800">
      <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary-500" />
      Loading Quantum Code Editor...
    </div>
  )
});

interface QuantumCodeEditorProps {
  numQubits: number;
  gates: PlacedGate[];
  onCircuitParsed: (numQubits: number, gates: PlacedGate[]) => void;
  onRunSimulation: () => void;
  isLoading?: boolean;
}

export function QuantumCodeEditor({
  numQubits,
  gates,
  onCircuitParsed,
  onRunSimulation,
  isLoading
}: QuantumCodeEditorProps) {
  const [dialect, setDialect] = useState<SupportedSyntaxDialect>('qiskit');
  const [code, setCode] = useState<string>('');
  const [errors, setErrors] = useState<ParseError[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [lastExternalGateCount, setLastExternalGateCount] = useState<number>(-1);

  // AI Prompt Modal / State
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiDebugResult, setAiDebugResult] = useState<{ explanation: string; fixedCode?: string } | null>(null);
  const [isDebuggingAI, setIsDebuggingAI] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Monaco editor instance ref
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  // 1. SYNC FROM VISUAL CANVAS -> CODE EDITOR
  // When visual builder gates change, regenerate the code if user is not actively typing
  useEffect(() => {
    // Generate code matching the current dialect
    let generated = '';
    if (dialect === 'qiskit') {
      generated = generateQiskitCode(numQubits, gates);
    } else if (dialect === 'cirq') {
      generated = generateCirqCode(numQubits, gates);
    } else {
      generated = generatePennyLaneCode(numQubits, gates);
    }

    setCode(generated);
    setErrors([]);
  }, [numQubits, gates, dialect]);

  // Handle Monaco mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // 2. SYNC FROM CODE EDITOR -> VISUAL CANVAS
  // Parse code on edit and update markers
  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode || '';
    setCode(val);

    if (dialect !== 'qiskit') {
      // Cirq and PennyLane in this MVP are export/view formats
      setErrors([]);
      return;
    }

    const result = parseQiskitCode(val, numQubits);
    setErrors(result.errors);

    // Update Monaco editor squiggly red markers
    if (editorRef.current && monacoRef.current) {
      const markers = result.errors.map((err) => ({
        startLineNumber: err.line,
        startColumn: 1,
        endLineNumber: err.line,
        endColumn: 100,
        message: err.message,
        severity: monacoRef.current.MarkerSeverity.Error
      }));
      monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), 'quantum-parser', markers);
    }

    // If completely valid, automatically sync to visual canvas state
    if (result.success) {
      onCircuitParsed(result.numQubits, result.gates);
    }
  };

  // Format / Reset Code
  const handleFormatCode = () => {
    const generated = generateQiskitCode(numQubits, gates);
    setCode(generated);
    setErrors([]);
    if (editorRef.current && monacoRef.current) {
      monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), 'quantum-parser', []);
    }
  };

  // Copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Insert Gate snippet at cursor
  const handleInsertSnippet = (snippet: string) => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      editorRef.current.executeEdits('insert-snippet', [
        {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: `\n${snippet}`
        }
      ]);
      editorRef.current.focus();
    } else {
      setCode((prev) => `${prev}\n${snippet}`);
    }
  };

  // AI Code Generation Trigger
  const handleGenerateCircuitAI = async () => {
    if (!aiPromptInput.trim()) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_circuit',
          prompt: aiPromptInput.trim()
        })
      });
      const data = await res.json();
      if (data.code) {
        setDialect('qiskit');
        setCode(data.code);
        handleCodeChange(data.code);
        setShowAIPrompt(false);
        setAiPromptInput('');
      }
    } catch (e) {
      console.error('AI Generation Failed:', e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // AI Code Debug Trigger
  const handleDebugCircuitAI = async () => {
    setIsDebuggingAI(true);
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'debug_circuit',
          code,
          errors
        })
      });
      const data = await res.json();
      setAiDebugResult({
        explanation: data.explanation || 'Reviewed circuit structure.',
        fixedCode: data.fixedCode
      });
    } catch (e) {
      console.error('AI Debugging Failed:', e);
    } finally {
      setIsDebuggingAI(false);
    }
  };

  // Apply AI Fix
  const handleApplyAIFix = () => {
    if (aiDebugResult?.fixedCode) {
      setCode(aiDebugResult.fixedCode);
      handleCodeChange(aiDebugResult.fixedCode);
      setAiDebugResult(null);
    }
  };

  return (
    <div className="bg-dark-950 text-white rounded-3xl border border-dark-800 shadow-xl overflow-hidden flex flex-col space-y-0">
      {/* Editor Top Toolbar */}
      <div className="bg-dark-900/90 border-b border-dark-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-dark-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Quantum Code Editor</span>
          </div>

          {/* Dialect Selector */}
          <div className="flex items-center gap-1 bg-dark-950 border border-dark-700 rounded-lg p-0.5">
            <button
              onClick={() => setDialect('qiskit')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                dialect === 'qiskit' ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-400 hover:text-white'
              }`}
            >
              Qiskit (Python)
            </button>
            <button
              onClick={() => setDialect('cirq')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                dialect === 'cirq' ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-400 hover:text-white'
              }`}
            >
              Cirq
            </button>
            <button
              onClick={() => setDialect('pennylane')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                dialect === 'pennylane' ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-400 hover:text-white'
              }`}
            >
              PennyLane
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AI Generate Button */}
          <button
            onClick={() => setShowAIPrompt(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate with AI</span>
          </button>

          {/* AI Debug Button (appears or is highlighted if errors exist) */}
          <button
            onClick={handleDebugCircuitAI}
            disabled={isDebuggingAI}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all border ${
              errors.length > 0
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30 animate-pulse'
                : 'bg-dark-800 border-dark-700 text-dark-300 hover:text-white'
            }`}
          >
            {isDebuggingAI ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bug className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Debug with AI</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-dark-700 hover:bg-dark-800 text-dark-300 hover:text-white transition-colors"
            title="Copy Python code"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Run / Simulate Button */}
          <button
            onClick={onRunSimulation}
            disabled={isLoading || errors.length > 0}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run & Simulate</span>
          </button>
        </div>
      </div>

      {/* Quick Snippet Chips */}
      {dialect === 'qiskit' && (
        <div className="bg-dark-900/50 border-b border-dark-800/80 px-5 py-2 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-dark-400">
          <span className="text-dark-500 font-sans text-xs">Quick Insert:</span>
          <button
            onClick={() => handleInsertSnippet('qc.h(0)')}
            className="px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-700 text-indigo-300 transition-colors"
          >
            + H(0)
          </button>
          <button
            onClick={() => handleInsertSnippet('qc.x(1)')}
            className="px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-700 text-emerald-300 transition-colors"
          >
            + X(1)
          </button>
          <button
            onClick={() => handleInsertSnippet('qc.cx(0, 1)')}
            className="px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-700 text-purple-300 transition-colors"
          >
            + CNOT(0, 1)
          </button>
          <button
            onClick={() => handleInsertSnippet('qc.cz(0, 1)')}
            className="px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-700 text-blue-300 transition-colors"
          >
            + CZ(0, 1)
          </button>
          <button
            onClick={() => handleInsertSnippet('qc.swap(0, 1)')}
            className="px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-700 text-cyan-300 transition-colors"
          >
            + SWAP(0, 1)
          </button>
          <button
            onClick={() => handleInsertSnippet('qc.measure_all()')}
            className="px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-700 text-dark-200 transition-colors"
          >
            + Measure
          </button>
          <button
            onClick={handleFormatCode}
            className="ml-auto text-dark-400 hover:text-white underline font-sans text-xs"
          >
            Reset to Canvas
          </button>
        </div>
      )}

      {/* Monaco Code Editor Area */}
      <div className="relative h-80 w-full">
        <MonacoEditor
          height="100%"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            cursorBlinking: 'smooth',
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3
          }}
        />
      </div>

      {/* Parse Errors Banner */}
      {errors.length > 0 && (
        <div className="bg-red-950/80 border-t border-red-800/80 px-5 py-3 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-red-300 font-bold">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Syntax / Constraint Errors ({errors.length}):</span>
          </div>
          <div className="space-y-1 pl-6">
            {errors.map((err, idx) => (
              <div key={idx} className="text-red-200 font-mono text-[11px]">
                <span className="text-red-400 font-bold">Line {err.line}:</span> {err.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Debug Diagnosis Card */}
      {aiDebugResult && (
        <div className="bg-primary-950/90 border-t border-primary-800 px-5 py-4 text-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-primary-300 font-bold">
              <Sparkles className="w-4 h-4 text-primary-400 shrink-0" />
              <span>Schrödinger AI Diagnosis & Fix</span>
            </div>
            <button
              onClick={() => setAiDebugResult(null)}
              className="text-dark-400 hover:text-white text-xs"
            >
              Dismiss
            </button>
          </div>

          <p className="text-dark-200 leading-relaxed pl-6">{aiDebugResult.explanation}</p>

          {aiDebugResult.fixedCode && (
            <div className="pl-6 flex items-center gap-3">
              <button
                onClick={handleApplyAIFix}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply AI Fix to Editor</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* AI Code Generation Modal with Portal (escapes all parent stacking contexts) */}
      {showAIPrompt && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fadeIn p-4">
          <div className="bg-white border border-dark-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative z-[10000] text-dark-900">
            <div className="flex items-center justify-between border-b border-dark-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-900 text-sm">Generate Quantum Circuit with AI</h3>
                  <p className="text-[11px] text-dark-500">Schrödinger AI code synthesizer</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIPrompt(false)}
                className="text-dark-400 hover:text-dark-700 hover:bg-dark-100 p-1 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-dark-600">
              Describe the quantum circuit you want to build in plain English or Hindi. Schrödinger AI will generate valid code for your selected simulator (Qiskit, Cirq, or PennyLane).
            </p>

            <textarea
              rows={3}
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              placeholder="e.g. Create a 2-qubit Bell state, or a 3-qubit GHZ state, or apply Hadamard on all qubits..."
              className="w-full rounded-xl bg-dark-50 border border-dark-200 p-3 text-xs text-dark-900 placeholder:text-dark-400 focus:outline-none focus:border-primary-500 focus:bg-white font-mono transition-colors"
            />

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="text-dark-500 self-center">Suggestions:</span>
              {[
                'Bell State (Entanglement)',
                '3-Qubit GHZ State',
                'Superposition on 2 Qubits',
                'Grover 2-Qubit Search',
                'Teleportation Circuit'
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setAiPromptInput(s)}
                  className="px-2.5 py-1 rounded-lg bg-dark-50 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 text-dark-700 border border-dark-200 transition-colors text-[11px] font-medium"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-dark-100">
              <button
                onClick={() => setShowAIPrompt(false)}
                className="px-4 py-2 rounded-xl border border-dark-200 text-dark-600 hover:bg-dark-50 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateCircuitAI}
                disabled={isGeneratingAI || !aiPromptInput.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-xs"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling Circuit...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate & Insert</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
