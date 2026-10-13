'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  generateQiskitCode,
  generateCirqCode,
  generatePennyLaneCode,
  parseQiskitCode,
  SupportedSyntaxDialect,
  ParseError
} from '@/lib/circuit-code-parser';
import { PlacedGate } from '@/lib/types';
import { Code2, Copy, Check, Terminal, Play, AlertCircle, Edit3, Eye } from 'lucide-react';

interface QuantumCircuitCodePanelProps {
  numQubits: number;
  gates: PlacedGate[];
  onCircuitCodeChange?: (numQubits: number, newGates: PlacedGate[]) => void;
  title?: string;
  className?: string;
  compact?: boolean;
  editable?: boolean;
}

export function QuantumCircuitCodePanel({
  numQubits,
  gates,
  onCircuitCodeChange,
  title = 'Circuit Python Code',
  className = '',
  compact = false,
  editable = true
}: QuantumCircuitCodePanelProps) {
  const [dialect, setDialect] = useState<SupportedSyntaxDialect>('qiskit');
  const [copied, setCopied] = useState(false);
  const [editableCode, setEditableCode] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [parseErrors, setParseErrors] = useState<ParseError[]>([]);
  const isInternalUpdateRef = useRef(false);

  // Sync from visual gates into editableCode whenever external gates change
  useEffect(() => {
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }
    let gen = '';
    if (dialect === 'cirq') {
      gen = generateCirqCode(numQubits, gates);
    } else if (dialect === 'pennylane') {
      gen = generatePennyLaneCode(numQubits, gates);
    } else {
      gen = generateQiskitCode(numQubits, gates);
    }
    setEditableCode(gen);
    setParseErrors([]);
  }, [numQubits, gates, dialect]);

  // Handle live user editing
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setEditableCode(newCode);

    if (dialect === 'qiskit' && onCircuitCodeChange) {
      const parsed = parseQiskitCode(newCode, numQubits);
      if (parsed.success && parsed.errors.length === 0) {
        setParseErrors([]);
        isInternalUpdateRef.current = true;
        onCircuitCodeChange(parsed.numQubits, parsed.gates);
      } else {
        setParseErrors(parsed.errors);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-dark-950 text-dark-100 rounded-xl border border-dark-800 shadow-xs overflow-hidden flex flex-col ${className}`}>
      {/* Header Bar */}
      <div className="bg-dark-900 border-b border-dark-800 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Terminal className="w-3.5 h-3.5 text-primary-400 shrink-0" />
          <span className="font-bold text-[11px] text-dark-200 truncate">{title}</span>
          {editable && dialect === 'qiskit' && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60 hidden sm:inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live 2-Way Sync
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Dialect Switcher */}
          <div className="flex items-center bg-dark-950 rounded-lg p-0.5 border border-dark-800">
            {(['qiskit', 'cirq', 'pennylane'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDialect(d)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  dialect === d
                    ? 'bg-primary-600 text-white shadow-2xs'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                {d === 'qiskit' ? 'Qiskit' : d === 'cirq' ? 'Cirq' : 'PennyLane'}
              </button>
            ))}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white text-[10px] font-medium transition-colors cursor-pointer"
            title="Copy Python Code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body: Bidirectional textarea when editable & dialect is qiskit */}
      <div className={`relative flex-1 bg-dark-950 text-dark-200 font-mono text-[11px] leading-relaxed ${compact ? 'min-h-[140px] max-h-[220px]' : 'min-h-[200px]'}`}>
        {editable && dialect === 'qiskit' ? (
          <textarea
            value={editableCode}
            onChange={handleCodeChange}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="w-full h-full p-3 bg-transparent text-emerald-300 font-mono text-[11px] leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-primary-500/50 selection:bg-primary-900/60"
            placeholder="# Write Qiskit code here, e.g. qc.h(0)"
          />
        ) : (
          <div className="p-3 overflow-x-auto overflow-y-auto h-full">
            <pre className="whitespace-pre text-dark-200">
              {editableCode}
            </pre>
          </div>
        )}
      </div>

      {/* Parse Error Notification */}
      {parseErrors.length > 0 && (
        <div className="bg-rose-950/80 border-t border-rose-800/80 px-3 py-1.5 flex items-center gap-2 text-[10px] text-rose-300 shrink-0">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">
            Line {parseErrors[0].line}: {parseErrors[0].message}
          </span>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-dark-900/60 border-t border-dark-800/80 px-3 py-1 flex items-center justify-between text-[10px] text-dark-400 shrink-0 font-sans">
        <span>
          {editable && dialect === 'qiskit'
            ? 'Type Qiskit Python code above to update gates on wires automatically'
            : `Runs directly in Python (${dialect.toUpperCase()})`}
        </span>
        <span className="font-mono text-dark-500">{gates.length} gates · {numQubits}Q</span>
      </div>
    </div>
  );
}
