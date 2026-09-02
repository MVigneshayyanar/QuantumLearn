'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAITutorStore } from '@/lib/state-store';
import { useAccessibility } from '@/lib/accessibility-context';
import { generateSocraticResponse } from '@/lib/ai-engine';
import { MathRenderer } from '@/components/math/MathRenderer';
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  BookOpen,
  RotateCcw,
  Target
} from 'lucide-react';

export function AITutorDrawer() {
  const {
    isOpen,
    setIsOpen,
    messages,
    addMessage,
    isGenerating,
    setIsGenerating,
    activeMisconception,
    setActiveMisconception,
    clearChat
  } = useAITutorStore();

  const { explanationMode, language } = useAccessibility();
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputVal.trim();
    if (!textToSend || isGenerating) return;

    // Add user message
    addMessage({
      role: 'user',
      content: textToSend
    });
    setInputVal('');
    setIsGenerating(true);

    try {
      // Call Next.js API route /api/ai-tutor
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          explanationMode,
          activeMisconception,
          language
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage({
          role: 'assistant',
          content: data.reply
        });
      } else {
        throw new Error('API route failed');
      }
    } catch {
      // Offline / Local Socratic Engine fallback
      const offlineReply = generateSocraticResponse(textToSend, {
        explanationMode,
        activeMisconception
      });
      addMessage({
        role: 'assistant',
        content: offlineReply
      });
    } finally {
      setIsGenerating(false);
      setActiveMisconception(null);
    }
  };

  const localizedPrompts: Record<string, { label: string; prompt: string }[]> = {
    hi: [
      { label: '✨ सरल शब्दों में समझाएं', prompt: 'क्या आप मुझे इस अवधारणा को समझने के लिए एक सरल उदाहरण दे सकते हैं?' },
      { label: '📐 डायराक गणितीय व्याख्या', prompt: 'क्या आप मुझे इसके लिए डायराक ब्रा-केट संकेतन और यूनिटरी मेट्रिक्स समझा सकते हैं?' },
      { label: '🎯 अभ्यास प्रश्न दें', prompt: 'क्या आप मेरे लिए इस विषय पर एक वैचारिक प्रश्न बना सकते हैं?' }
    ],
    es: [
      { label: '✨ Explicar intuitivamente', prompt: '¿Podrías darme una analogía cotidiana para entender este concepto cuántico?' },
      { label: '📐 Notación matemática de Dirac', prompt: '¿Puedes explicarme la notación bra-ket de Dirac y las matrices unitarias para esto?' },
      { label: '🎯 Ejercicio de práctica', prompt: '¿Podrías plantearme una pregunta conceptual de práctica sobre este tema?' }
    ],
    fr: [
      { label: '✨ Expliquer simplement', prompt: 'Pouvez-vous me donner une analogie simple pour comprendre ce concept quantique ?' },
      { label: '📐 Démonstration Dirac', prompt: 'Pouvez-vous m\'expliquer la notation bra-ket de Dirac et les matrices unitaires ?' },
      { label: '🎯 Quiz d\'entraînement', prompt: 'Pourriez-vous me poser une question de réflexion sur ce sujet ?' }
    ],
    de: [
      { label: '✨ Anschaulich erklären', prompt: 'Können Sie mir eine einfache Analogie geben, um dieses Quantenkonzept zu verstehen?' },
      { label: '📐 Dirac-Mathematik', prompt: 'Können Sie mir die Dirac-Bra-Ket-Notation und unitäre Matrizen dazu erklären?' },
      { label: '🎯 Übungsfrage', prompt: 'Könnten Sie mir eine knifflige konzeptionelle Übungsfrage dazu stellen?' }
    ],
    en: [
      { label: '✨ Explain intuitively', prompt: 'Could you give me an intuitive everyday analogy to understand the active concept?' },
      { label: '📐 Dirac math walkthrough', prompt: 'Can you walk me through the Dirac bra-ket mathematical notation and unitary matrices for this?' },
      { label: '🎯 Give me a practice quiz', prompt: 'Could you create a challenging conceptual practice question for me on this topic?' }
    ]
  };

  const quickPrompts = localizedPrompts[language] || localizedPrompts.en;

  const placeholders: Record<string, string> = {
    hi: 'एक प्रश्न पूछें या क्वांटम अवधारणा का पता लगाएं...',
    es: 'Haga una pregunta o explore un concepto cuántico...',
    fr: 'Posez une question ou explorez un concept quantique...',
    de: 'Stellen Sie eine Frage oder erkunden Sie ein Quantenkonzept...',
    en: 'Ask a question or explore a concept...'
  };

  return (
    <aside
      role="dialog"
      aria-label="Schrödinger AI Quantum Tutor"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl border-l border-dark-200 flex flex-col animate-slideLeft"
    >
      {/* Header */}
      <div className="p-4 border-b border-dark-200 flex items-center justify-between bg-gradient-to-r from-primary-50/70 to-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-dark-900 flex items-center gap-1.5">
              Schrödinger AI
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 font-mono">
                {explanationMode.toUpperCase()}
              </span>
            </h3>
            <p className="text-[11px] text-dark-500">Guides through inquiry & physics insights</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-700 hover:bg-dark-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close AI Tutor"
            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-700 hover:bg-dark-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                  isUser
                    ? 'bg-primary-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-dark-50 text-dark-800 border border-dark-200 rounded-bl-xs'
                }`}
              >
                {isUser ? msg.content : <MathRenderer text={msg.content} />}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-3 items-center text-xs text-dark-500 italic">
            <div className="w-6 h-6 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>Tutor is formulating a guiding inquiry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-dark-50/50 border-t border-dark-100 flex flex-wrap gap-1.5">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp.prompt)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-primary-50 border border-dark-200 text-dark-700 hover:text-primary-700 font-medium transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-dark-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={placeholders[language] || placeholders.en}
          className="flex-1 px-3 py-2 rounded-xl border border-dark-200 text-xs text-dark-900 placeholder:text-dark-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isGenerating}
          aria-label="Send message to AI Tutor"
          className="p-2 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white shadow-xs transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
}
