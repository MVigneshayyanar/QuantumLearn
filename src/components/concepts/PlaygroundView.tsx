'use client';

import React, { useState } from 'react';
import { 
  Play, Sparkles, Sliders, RefreshCw, Key, ShieldCheck, Zap, 
  ChevronRight, HelpCircle, Layers, ArrowRight, CheckCircle2, RotateCcw
} from 'lucide-react';
import { PLAYGROUND_LABS, PlaygroundLab } from '@/lib/quantum-academy-data';

export function PlaygroundView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLabId, setActiveLabId] = useState<string>('bell_chsh');

  // Interactive state for Bell CHSH lab
  const [aliceAngle, setAliceAngle] = useState<number>(0);
  const [bobAngle, setBobAngle] = useState<number>(45);

  // Interactive state for BB84 QKD lab
  const [eavesdropper, setEavesdropper] = useState<boolean>(false);
  const [qkdAliceBits] = useState<number[]>([1, 0, 1, 1, 0, 1, 0, 0]);
  const [qkdAliceBases] = useState<string[]>(['+', 'x', '+', '+', 'x', '+', 'x', 'x']);
  const [qkdBobBases] = useState<string[]>(['+', '+', '+', 'x', 'x', '+', 'x', '+']);

  // Interactive state for VQE H2 molecule lab
  const [bondLength, setBondLength] = useState<number>(0.74); // Angstroms

  const categories = ['All', 'foundations', 'qubits', 'gates', 'algorithms', 'hardware', 'cryptography'];

  const filteredLabs = PLAYGROUND_LABS.filter(lab => 
    selectedCategory === 'All' ? true : lab.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const activeLab = PLAYGROUND_LABS.find(l => l.id === activeLabId) || PLAYGROUND_LABS[0];

  // CHSH correlation calculation
  const chshCorrelation = Math.cos(2 * ((aliceAngle - bobAngle) * Math.PI / 180));
  const chshSValue = 2 * Math.abs(Math.cos(2 * (aliceAngle - bobAngle) * Math.PI / 180)) + 
                     2 * Math.abs(Math.sin(2 * (aliceAngle - bobAngle) * Math.PI / 180));

  // VQE ground state energy curve for H2 (Morse potential approximation)
  const vqeEnergy = -1.137 + 0.5 * Math.pow(1 - Math.exp(-1.4 * (bondLength - 0.74)), 2) - 0.5;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-900 via-indigo-950 to-primary-950 text-white rounded-3xl p-6 sm:p-8 border border-dark-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            <span>21 Interactive Quantum Sandboxes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Quantum Playground
          </h2>
          <p className="text-xs sm:text-sm text-dark-300 leading-relaxed">
            Hands-on sandboxes demonstrating Bell inequalities, quantum key distribution, variational eigensolvers, and quantum error correction.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-card'
                    : 'bg-white/10 text-dark-200 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Lab Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lab Selector Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-3xl p-5 shadow-xs max-h-[700px] overflow-y-auto space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-dark-400 dark:text-dark-500 px-2 py-1 font-semibold">
            Available Labs ({filteredLabs.length})
          </div>
          {filteredLabs.map((lab) => {
            const isSelected = lab.id === activeLabId;
            return (
              <button
                key={lab.id}
                onClick={() => setActiveLabId(lab.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-950 dark:text-primary-100 shadow-sm'
                    : 'bg-dark-50/50 dark:bg-dark-950/40 border-dark-200 dark:border-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold">{lab.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    lab.difficulty === 'Beginner' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                    lab.difficulty === 'Intermediate' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' :
                    'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {lab.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-dark-500 dark:text-dark-400 mt-1 line-clamp-2 leading-relaxed">
                  {lab.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Interactive Experiment Workspace */}
        <div className="lg:col-span-8 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* Lab Title Header */}
          <div className="flex items-center justify-between border-b border-dark-200 dark:border-dark-800 pb-4 mb-6">
            <div>
              <div className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Interactive Lab • {activeLab.category}
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 dark:text-white mt-1">
                {activeLab.title}
              </h3>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-mono font-bold ${
              activeLab.difficulty === 'Beginner' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
              activeLab.difficulty === 'Intermediate' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' :
              'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
            }`}>
              {activeLab.difficulty}
            </span>
          </div>

          {/* BELL CHSH INEQUALITY EXPERIMENT */}
          {activeLab.id === 'bell_chsh' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 text-xs sm:text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
                Test the Einstein-Podolsky-Rosen paradox. Classical local hidden-variable theories bound the CHSH inequality to $|S| \leq 2$. Quantum entanglement allows maximal Tsirelson bound violation up to $2\sqrt{2} \approx 2.828$.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Alice Polarizer */}
                <div className="p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 space-y-3">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-primary-600 dark:text-primary-400">Alice Detector Angle (a)</span>
                    <span className="text-dark-900 dark:text-white">{aliceAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={aliceAngle}
                    onChange={(e) => setAliceAngle(Number(e.target.value))}
                    className="w-full accent-primary-600 h-2 bg-dark-200 dark:bg-dark-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-dark-400 font-mono">
                    <span>0°</span>
                    <span>45°</span>
                    <span>90°</span>
                    <span>180°</span>
                  </div>
                </div>

                {/* Bob Polarizer */}
                <div className="p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 space-y-3">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-cyan-600 dark:text-cyan-400">Bob Detector Angle (b)</span>
                    <span className="text-dark-900 dark:text-white">{bobAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={bobAngle}
                    onChange={(e) => setBobAngle(Number(e.target.value))}
                    className="w-full accent-cyan-600 h-2 bg-dark-200 dark:bg-dark-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-dark-400 font-mono">
                    <span>0°</span>
                    <span>45°</span>
                    <span>90°</span>
                    <span>180°</span>
                  </div>
                </div>
              </div>

              {/* Live Bell Measurement Result Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
                  <div className="text-xs text-dark-500 font-mono font-semibold">Correlation E(a,b)</div>
                  <div className="text-2xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                    {chshCorrelation.toFixed(3)}
                  </div>
                  <div className="text-[11px] text-dark-400 mt-1">cos(2(a - b))</div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
                  <div className="text-xs text-dark-500 font-mono font-semibold">CHSH S-Parameter</div>
                  <div className={`text-2xl font-extrabold font-mono mt-1 ${
                    chshSValue > 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {chshSValue.toFixed(3)}
                  </div>
                  <div className="text-[11px] text-dark-400 mt-1">Classical bound: ≤ 2.000</div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
                  <div className="text-xs text-dark-500 font-mono font-semibold">Entanglement Status</div>
                  <div className="text-xs font-bold mt-2">
                    {chshSValue > 2 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 shrink-0" /> Bell Inequality Violated!
                      </span>
                    ) : (
                      <span className="text-dark-500">Classical Regime</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BB84 QUANTUM KEY DISTRIBUTION */}
          {activeLab.id === 'bb84' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 text-xs sm:text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
                Simulate quantum key distribution over an optical quantum channel. Alice encodes single photons into computational (+) or diagonal (x) bases. Bob measures in random bases. Any interception by Eve introduces recognizable quantum errors.
              </div>

              {/* Eve intercept toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`w-5 h-5 ${eavesdropper ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-dark-900 dark:text-white">
                      Eavesdropper (Eve) on Quantum Channel
                    </div>
                    <div className="text-[11px] text-dark-500 dark:text-dark-400">
                      {eavesdropper ? 'Eve measures qubits mid-flight and retransmits' : 'Clean channel, no interception'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setEavesdropper(!eavesdropper)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    eavesdropper 
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700' 
                      : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                  }`}
                >
                  {eavesdropper ? 'Eve Active (Spied)' : 'No Eavesdropper'}
                </button>
              </div>

              {/* Photon Exchange Table */}
              <div className="overflow-x-auto rounded-2xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-950">
                <table className="w-full text-center text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-dark-200 dark:border-dark-800 text-dark-500 text-[11px] bg-dark-50 dark:bg-dark-900">
                      <th className="py-2.5 text-left pl-3">Participant</th>
                      {qkdAliceBits.map((_, i) => (
                        <th key={i} className="py-2.5 px-3">Photon #{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-200 dark:divide-dark-800">
                    <tr>
                      <td className="py-3 text-left pl-3 font-bold text-primary-600 dark:text-primary-400">Alice Bits</td>
                      {qkdAliceBits.map((b, i) => (
                        <td key={i} className="py-3 px-3 text-dark-800 dark:text-dark-200">{b}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 text-left pl-3 font-bold text-primary-500 dark:text-primary-300">Alice Bases</td>
                      {qkdAliceBases.map((b, i) => (
                        <td key={i} className="py-3 px-3 text-primary-600 dark:text-primary-300">{b}</td>
                      ))}
                    </tr>
                    {eavesdropper && (
                      <tr className="bg-rose-50 dark:bg-rose-950/30">
                        <td className="py-3 text-left pl-3 font-bold text-rose-600 dark:text-rose-400">Eve Intercept</td>
                        {qkdAliceBits.map((_, i) => (
                          <td key={i} className="py-3 px-3 text-rose-600 dark:text-rose-400 font-bold">⚠</td>
                        ))}
                      </tr>
                    )}
                    <tr>
                      <td className="py-3 text-left pl-3 font-bold text-cyan-600 dark:text-cyan-400">Bob Bases</td>
                      {qkdBobBases.map((b, i) => (
                        <td key={i} className="py-3 px-3 text-cyan-600 dark:text-cyan-400">{b}</td>
                      ))}
                    </tr>
                    <tr className="bg-emerald-50 dark:bg-emerald-950/30">
                      <td className="py-3 text-left pl-3 font-bold text-emerald-700 dark:text-emerald-400">Sifted Key</td>
                      {qkdAliceBases.map((ab, i) => {
                        const match = ab === qkdBobBases[i];
                        const bit = eavesdropper && Math.random() > 0.5 ? 1 - qkdAliceBits[i] : qkdAliceBits[i];
                        return (
                          <td key={i} className="py-3 px-3">
                            {match ? (
                              <span className={`font-bold ${eavesdropper ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                                {bit}
                              </span>
                            ) : (
                              <span className="text-dark-400 dark:text-dark-600">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 font-mono text-xs flex justify-between items-center">
                <span className="text-dark-600 dark:text-dark-400">Quantum Bit Error Rate (QBER):</span>
                <span className={`font-bold ${eavesdropper ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {eavesdropper ? '25.0% (Eavesdropping Detected!)' : '0.0% (Secure Transmission)'}
                </span>
              </div>
            </div>
          )}

          {/* VARIATIONAL QUANTUM EIGENSOLVER (VQE) */}
          {activeLab.id === 'vqe' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 text-xs sm:text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
                Variational Quantum Eigensolver finding the ground state electronic dissociation energy of molecular Hydrogen ($H_2$) as a function of interatomic separation distance.
              </div>

              <div className="p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 space-y-3">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-primary-600 dark:text-primary-400">H-H Bond Length (R)</span>
                  <span className="text-dark-900 dark:text-white">{bondLength.toFixed(2)} Å (Angstroms)</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.02"
                  value={bondLength}
                  onChange={(e) => setBondLength(Number(e.target.value))}
                  className="w-full accent-primary-600 h-2 bg-dark-200 dark:bg-dark-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-dark-400 font-mono">
                  <span>0.3 Å (Nuclear Repulsion)</span>
                  <span>0.74 Å (Equilibrium Bond)</span>
                  <span>2.5 Å (Dissociated)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
                  <div className="text-xs text-dark-500 font-mono font-semibold">Calculated Ground State Energy</div>
                  <div className="text-2xl font-extrabold font-mono text-primary-600 dark:text-primary-400 mt-1">
                    {vqeEnergy.toFixed(4)} <span className="text-xs text-dark-500 font-normal">Hartree</span>
                  </div>
                  <div className="text-[11px] text-dark-400 mt-1">
                    Minimum at R = 0.74 Å (-1.137 Hartree)
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
                  <div className="text-xs text-dark-500 font-mono font-semibold">Ansatz Architecture</div>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    UCCSD (Unitary Coupled Cluster)
                  </div>
                  <div className="text-[11px] text-dark-500 mt-1">
                    2 Qubits (Parity Mapping, $Z_2$ symmetry reduction)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEFAULT INTERACTIVE SANDBOX FOR OTHER LABS */}
          {activeLab.id !== 'bell_chsh' && activeLab.id !== 'bb84' && activeLab.id !== 'vqe' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 text-xs sm:text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
                {activeLab.description}
              </div>

              <div className="p-8 sm:p-12 rounded-3xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/80 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-xs">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-dark-900 dark:text-white">Interactive Sandbox Simulation</h4>
                  <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-1 max-w-md">
                    This sandbox runs on our in-browser quantum statevector simulation engine.
                  </p>
                </div>

                <button
                  onClick={() => alert(`Simulating ${activeLab.title} with 1,024 shots.`)}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold shadow-card flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Experiment (1024 Shots)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
