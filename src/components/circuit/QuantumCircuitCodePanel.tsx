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
import { Copy, Check, Terminal, AlertCircle } from 'lucide-react';

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
  const [activeSection, setActiveSection] = useState<SupportedSyntaxDialect>('qiskit');
  const [copied, setCopied] = useState(false);
  const [editableCode, setEditableCode] = useState<string>('');
  const [parseErrors, setParseErrors] = useState<ParseError[]>([]);
  const [highlightedLineIndices, setHighlightedLineIndices] = useState<number[]>([]);
  const isInternalUpdateRef = useRef(false);
  const previousCodeRef = useRef<string | null>(null);
  const activeDialect = activeSection;

  // Sync from visual gates into editableCode whenever external gates change
  useEffect(() => {
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }
    let gen = '';
    if (activeDialect === 'cirq') {
      gen = generateCirqCode(numQubits, gates);
    } else if (activeDialect === 'pennylane') {
      gen = generatePennyLaneCode(numQubits, gates);
    } else {
      gen = generateQiskitCode(numQubits, gates);
    }
    const previousLines = previousCodeRef.current?.split('\n') || [];
    const previousLineCounts = new Map<string, number>();
    previousLines.forEach((line) => {
      previousLineCounts.set(line, (previousLineCounts.get(line) || 0) + 1);
    });

    const nextLineCounts = new Map<string, number>();
    const newlyAddedLines: number[] = [];
    gen.split('\n').forEach((line, lineIndex) => {
      const nextCount = (nextLineCounts.get(line) || 0) + 1;
      nextLineCounts.set(line, nextCount);
      if (nextCount > (previousLineCounts.get(line) || 0) && line.trim()) {
        newlyAddedLines.push(lineIndex);
      }
    });

    setEditableCode(gen);
    setHighlightedLineIndices(previousCodeRef.current === null ? [] : newlyAddedLines);
    previousCodeRef.current = gen;
    setParseErrors([]);
  }, [numQubits, gates, activeDialect]);

  // Handle Qiskit user editing
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setEditableCode(newCode);

    if (activeSection === 'qiskit' && dialect === 'qiskit' && onCircuitCodeChange) {
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
    <div className={`bg-[#0B0F19] text-gray-100 rounded-xl border border-gray-800 shadow-xs overflow-hidden flex flex-col ${className}`}>
      {/* Header Bar */}
      <div className="bg-[#111827] border-b border-gray-800 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Terminal className="w-3.5 h-3.5 text-primary-400 shrink-0" />
          <span className="font-bold text-[11px] text-gray-200 truncate">{title}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Section Switcher */}
          <div className="flex items-center bg-[#090D16] rounded-lg p-0.5 border border-gray-800">
            {(['qiskit', 'cirq', 'pennylane'] as const).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  activeSection === section
                    ? 'bg-primary-600 text-white shadow-2xs'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {section === 'qiskit' ? 'Qiskit' : section === 'cirq' ? 'Cirq' : 'PennyLane'}
              </button>
            ))}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#1F2937] hover:bg-[#374151] text-gray-200 hover:text-white text-[10px] font-medium transition-colors cursor-pointer"
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

      {/* Code Editor Body: Qiskit is editable; other dialects are generated previews */}
      <div className={`relative flex-1 bg-[#090D16] text-white font-mono text-[11px] leading-relaxed ${compact ? 'min-h-[140px] max-h-[220px]' : 'min-h-[240px]'}`}>
        {editable && activeSection === 'qiskit' ? (
          <textarea
            value={editableCode}
            onChange={handleCodeChange}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="w-full h-full p-3 !bg-[#090D16] !text-emerald-300 font-mono text-[11px] leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-primary-500/50 selection:bg-primary-900/60"
            placeholder="# Write Qiskit code here, e.g. qc.h(0)"
          />
        ) : (
          <div className="p-3 overflow-x-auto overflow-y-auto h-full !bg-[#090D16]">
            <pre className="whitespace-pre !text-emerald-300 font-mono text-[11px] leading-relaxed !bg-transparent">
              {editableCode.split('\n').map((line, lineIndex) => (
                <span
                  key={`${lineIndex}-${line}`}
                  className={`block rounded-sm transition-colors ${
                    highlightedLineIndices.includes(lineIndex)
                      ? 'code-line-added animate-codeLineAdded bg-amber-400/20 text-amber-200'
                      : ''
                  }`}
                >
                  {line || '\u00a0'}
                </span>
              ))}
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
      <div className="bg-[#111827] border-t border-gray-800 px-3 py-1.5 flex items-center justify-between text-[10px] text-gray-400 shrink-0 font-sans">
        <span>
          {editable && activeSection === 'qiskit'
            ? 'Type Qiskit Python code above to update gates on wires automatically'
            : ''}
        </span>
        <span className="font-mono text-gray-400">{gates.length} gates · {numQubits}Q</span>
      </div>
    </div>
  );
}
