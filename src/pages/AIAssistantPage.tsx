import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { AIService, AIChatMessage, SAMPLE_PROMPTS } from '../services/aiService';

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am the **Educational Healthcare Assistant Prototype**, built as part of the student health informatics capstone project.

I can help explain:
• General human anatomy and physiological terms (e.g. Systolic vs Diastolic BP)
• Evidence-based lifestyle & nutritional principles
• Common clinical lab markers and what they represent (e.g. HbA1c, lipid fractions)
• General questions to discuss with your personal doctor

**Please note:** I cannot diagnose medical conditions, evaluate emergency symptoms, or prescribe medication. What healthcare topic would you like to explore today?`,
      timestamp: '09:00 AM',
      educationalTopic: 'System Welcome & Medical Disclaimer',
      suggestedFollowUps: [
        'What is the difference between systolic and diastolic blood pressure?',
        'What does an elevated HbA1c test indicate in simple terms?',
        'What lifestyle strategies help manage borderline high cholesterol?',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await AIService.askQuestion(textToSend.trim());
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'An error occurred while generating the educational response. Please try asking your health question again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm('Reset the AI assistant conversation history?')) {
      setMessages([
        {
          id: 'init-1',
          sender: 'assistant',
          text: `Chat reset. Welcome back! I am ready to answer general health education questions. Remember: **This system does not provide medical diagnosis.**`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowUps: [
            'What is the difference between systolic and diastolic blood pressure?',
            'What lifestyle strategies help manage borderline high cholesterol?',
          ],
        },
      ]);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* 1. Prominent Safety Disclaimer Banner */}
      <div
        id="ai-mandatory-disclaimer"
        className="p-4 rounded-xl bg-amber-50 border border-amber-300/80 shadow-xs flex items-start gap-3 text-amber-900"
      >
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-amber-950 text-sm">
            For educational purposes only. This system does not provide medical diagnosis.
          </p>
          <p className="leading-relaxed text-amber-900/90">
            This module is an academic prototype developed for college demonstration. It does not
            substitute for professional medical advice, diagnosis, treatment, or emergency clinical
            decision-making. If you are experiencing a medical emergency, call 911 or visit the
            nearest emergency department immediately.
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">
                  Healthcare Education AI Assistant
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  Prototype Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Academic Natural Language Health Literacy Engine
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                {msg.sender === 'assistant' ? (
                  <span className="flex items-center gap-1 font-semibold text-indigo-700">
                    <Sparkles className="w-3 h-3" />
                    AI Health Assistant (Educational)
                  </span>
                ) : (
                  <span className="font-semibold text-slate-600">You (Student / Reviewer)</span>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : msg.isEmergencyAlert
                    ? 'bg-rose-50 border border-rose-300 text-rose-950 rounded-tl-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>

              {/* Suggested Follow-up Prompts */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[85%]">
                  {msg.suggestedFollowUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="text-[11px] bg-indigo-50/80 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/70 rounded-full px-3 py-1 flex items-center gap-1 transition-colors cursor-pointer text-left"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-indigo-700 font-semibold">
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>Formulating educational response...</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
                <span className="text-slate-500 font-mono text-[11px] ml-1">
                  Synthesizing clinical literature &amp; physiology models
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample Topics Quick Bar */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Quick Prompts:
          </span>
          {SAMPLE_PROMPTS.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] shrink-0 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-assistant-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask an educational question (e.g., 'Explain blood pressure numbers', 'Diet for lipid control')..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50"
            />
            <button
              id="ai-send-btn"
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-400 mt-2">
            Non-diagnostic educational prototype • Student Research Software • Does not retain private patient data
          </p>
        </div>
      </div>
    </div>
  );
};
