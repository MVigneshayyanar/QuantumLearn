'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAITutorStore } from '@/lib/state-store';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
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
  Target,
  Compass
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
    clearChat,
    askTutor
  } = useAITutorStore();

  const { explanationMode, language } = useAccessibility();
  const t = translations[language];
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Auto-respond if the last message in the chat is an unreplied user message
  useEffect(() => {
    if (!isOpen || isGenerating || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'user') {
      const runPendingReply = async () => {
        setIsGenerating(true);
        try {
          const response = await fetch('/api/ai-tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: lastMsg.content,
              explanationMode,
              activeMisconception,
              language
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.reply) {
              addMessage({
                role: 'assistant',
                content: data.reply
              });
              return;
            }
          }
          throw new Error('API route failed');
        } catch {
          const offlineReply = generateSocraticResponse(lastMsg.content, {
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
      runPendingReply();
    }
  }, [isOpen, messages, isGenerating, explanationMode, activeMisconception, language, addMessage, setIsGenerating, setActiveMisconception]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputVal.trim();
    if (!textToSend || isGenerating) return;
    setInputVal('');
    await askTutor(textToSend, {
      explanationMode,
      activeMisconception,
      language
    });
  };

  const localizedPrompts: Record<string, { label: string; prompt: string }[]> = {
    hi: [
      { label: 'सरल शब्दों में समझाएं', prompt: 'क्या आप मुझे इस अवधारणा को समझने के लिए एक सरल उदाहरण दे सकते हैं?' },
      { label: 'डायराक गणितीय व्याख्या', prompt: 'क्या आप मुझे इसके लिए डायराक ब्रा-केट संकेतन और यूनिटरी मेट्रिक्स समझा सकते हैं?' },
      { label: 'अभ्यास प्रश्न दें', prompt: 'क्या आप मेरे लिए इस विषय पर एक वैचारिक प्रश्न बना सकते हैं?' }
    ],
    es: [
      { label: 'Explicar intuitivamente', prompt: '¿Podrías darme una analogía cotidiana para entender este concepto cuántico?' },
      { label: 'Notación matemática de Dirac', prompt: '¿Puedes explicarme la notación bra-ket de Dirac y las matrices unitarias para esto?' },
      { label: 'Ejercicio de práctica', prompt: '¿Podrías plantearme una pregunta conceptual de práctica sobre este tema?' }
    ],
    fr: [
      { label: 'Expliquer simplement', prompt: 'Pouvez-vous me donner une analogie simple pour comprendre ce concept quantique ?' },
      { label: 'Démonstration Dirac', prompt: 'Pouvez-vous m\'expliquer la notation bra-ket de Dirac et les matrices unitaires ?' },
      { label: 'Quiz d\'entraînement', prompt: 'Pourriez-vous me poser une question de réflexion sur ce sujet ?' }
    ],
    de: [
      { label: 'Anschaulich erklären', prompt: 'Können Sie mir eine einfache Analogie geben, um dieses Quantenkonzept zu verstehen?' },
      { label: 'Dirac-Mathematik', prompt: 'Können Sie mir die Dirac-Bra-Ket-Notation und unitäre Matrizen dazu erklären?' },
      { label: 'Übungsfrage', prompt: 'Könnten Sie mir eine knifflige konzeptionelle Übungsfrage dazu stellen?' }
    ],
    ta: [
      { label: 'எளிமையாக விளக்குங்கள்', prompt: 'இந்த கருத்தை எளிதாகப் புரிந்து கொள்ள ஒரு நடைமுறை உதாரணம் தர முடியுமா?' },
      { label: 'டிராக் கணித விளக்கம்', prompt: 'இதற்கான டிராக் பிரா-கெட் குறியீடு மற்றும் அணிகளை விளக்க முடியுமா?' },
      { label: 'பயிற்சி வினாக்கள்', prompt: 'இந்த தலைப்பில் ஒரு பயிற்சி வினாவை உருவாக்க முடியுமா?' }
    ],
    te: [
      { label: 'సులభంగా వివరించండి', prompt: 'ఈ భావనను అర్థం చేసుకోవడానికి ఒక సులభమైన ఉదాహరణ ఇవ్వగలరా?' },
      { label: 'డిరాక్ గణిత వివరణ', prompt: 'దీనికి డిరాక్ బ్రా-కెట్ సంజ్ఞామానం మరియు యూనిటరీ మాత్రికలను వివరించగలరా?' },
      { label: 'అభ్యాస ప్రశ్న', prompt: 'ఈ అంశంపై ఒక అభ్యాస ప్రశ్నను అందించగలరా?' }
    ],
    ja: [
      { label: '直感的に解説', prompt: 'この概念を直感的に理解できる身近なたとえを教えてください。' },
      { label: 'ディラック表記の解説', prompt: 'ブラケット記法とユニタリ行列の導出を説明してください。' },
      { label: '練習問題を出題', prompt: 'このトピックに関する概念的な練習問題を出してください。' }
    ],
    'zh-CN': [
      { label: '通俗易懂讲解', prompt: '能否用一个生活中的类比来解释这个量子概念？' },
      { label: '狄拉克符号与数学推演', prompt: '能否为我推导狄拉克右矢左矢符号与酉矩阵？' },
      { label: '出一道练习题', prompt: '能否就该知识点为我出一道深入的概念练习题？' }
    ],
    en: [
      { label: 'Explain intuitively', prompt: 'Could you give me an intuitive everyday analogy to understand the active concept?' },
      { label: 'Dirac math walkthrough', prompt: 'Can you walk me through the Dirac bra-ket mathematical notation and unitary matrices for this?' },
      { label: 'Give me a practice quiz', prompt: 'Could you create a challenging conceptual practice question for me on this topic?' }
    ]
  };

  const quickPrompts = localizedPrompts[language] || localizedPrompts.en;

  const placeholders: Record<string, string> = {
    hi: 'एक प्रश्न पूछें या क्वांटम अवधारणा का पता लगाएं...',
    es: 'Haga una pregunta o explore un concepto cuántico...',
    fr: 'Posez une question ou explorez un concept quantique...',
    de: 'Stellen Sie eine Frage oder erkunden Sie ein Quantenkonzept...',
    ta: 'ஒரு கேள்வி கேளுங்கள் அல்லது குவாண்டம் கருத்தை ஆராயுங்கள்...',
    te: 'ఒక ప్రశ్న అడగండి లేదా క్వాంటం భావనను అన్వేషించండి...',
    ja: '質問を入力するか、量子概念を探索...',
    'zh-CN': '输入问题或探索量子概念...',
    en: 'Ask a question or explore a concept...'
  };

  return (
    <aside
      role="dialog"
      aria-label="Schrödinger AI Quantum Tutor"
      className="fixed inset-y-0 right-0 z-[60] w-full sm:w-[420px] bg-white dark:bg-dark-900 shadow-2xl border-l border-dark-200 dark:border-dark-800 flex flex-col animate-slideLeft"
    >
      {/* Header */}
      <div className="p-4 border-b border-dark-200 dark:border-dark-800 flex items-center justify-between bg-gradient-to-r from-primary-50/70 to-white dark:from-primary-950/40 dark:to-dark-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-dark-900 dark:text-white flex items-center gap-1.5">
              Schrödinger AI
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/70 text-primary-800 dark:text-primary-300 font-mono">
                {explanationMode.toUpperCase()}
              </span>
            </h3>
            <p className="text-[11px] text-dark-500 dark:text-dark-400">{t.aiTutor.subtitle || 'Guides through inquiry & physics insights'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close AI Tutor"
            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
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
                <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                  isUser
                    ? 'bg-primary-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-dark-50 dark:bg-dark-800 text-dark-800 dark:text-dark-100 border border-dark-200 dark:border-dark-700 rounded-bl-xs'
                }`}
              >
                {isUser ? msg.content : <MathRenderer text={msg.content} />}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-3 items-center text-xs text-dark-500 dark:text-dark-400 italic">
            <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>Tutor is formulating a guiding inquiry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-dark-50/50 dark:bg-dark-950/50 border-t border-dark-100 dark:border-dark-800 flex flex-wrap gap-1.5">
        {quickPrompts.map((qp, i) => {
          const Icon = i === 0 ? Sparkles : i === 1 ? Compass : Target;
          return (
            <button
              key={i}
              onClick={() => handleSend(qp.prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-dark-800 hover:bg-primary-50 dark:hover:bg-dark-700 border border-dark-200 dark:border-dark-700 text-dark-700 dark:text-dark-300 hover:text-primary-700 dark:hover:text-white font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <Icon className="w-3 h-3 text-primary-500 shrink-0" />
              <span>{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 pb-safe sm:pb-3 border-t border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={placeholders[language] || placeholders.en}
          className="flex-1 px-3 py-2 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-xs text-dark-900 dark:text-white placeholder:text-dark-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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
