import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, Trash2, Cpu, FileText, AlertTriangle } from 'lucide-react';

const defaultSuggestedPrompts = [
  "Explain what employee attrition means in simple language.",
  "What are the major attrition drivers in our workforce?",
  "Which ML model achieved the highest evaluation accuracy?",
  "What retention actions should HR prioritize for overtime workers?"
];

export default function AiAssistant({ activePredictionContext, clearPredictionContext }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your HireSense AI HR Assistant. I can help explain attrition risk predictions, interpret ML model results, and recommend retention strategies."
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setErrorStatus(null);
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);

    if (!textToSend) setInput('');
    setLoading(true);

    // Format history for backend API (user & assistant roles)
    const historyPayload = newMessages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload.slice(-6), // pass recent 6 messages
          context: activePredictionContext || null
        })
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.response || "AI Assistant is unavailable. Please make sure Ollama is running locally.",
            isError: true
          }
        ]);
        setErrorStatus("AI Assistant is unavailable. Please make sure Ollama is running locally.");
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.response || "No response received from local Ollama model."
          }
        ]);
      }
    } catch (err) {
      console.error("AI Assistant connection error:", err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "AI Assistant is unavailable. Please make sure Ollama is running locally.",
          isError: true
        }
      ]);
      setErrorStatus("AI Assistant is unavailable. Please make sure Ollama is running locally.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Conversation history cleared. How can I assist you with workforce analytics today?"
      }
    ]);
    setErrorStatus(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'calc(100vh - 120px)' }} className="animate-fade-in">
      {/* Header Banner with Model Badge */}
      <div className="card-hs" style={{ borderLeft: '4px solid var(--violet)', background: 'var(--gradient-card)', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '0.5rem', background: 'var(--gradient-btn)', color: '#fff' }}>
              <Bot size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-deep-purple)' }}>
                HireSense Local AI HR Assistant
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Explain attrition risk predictions, interpret ML models, and generate retention strategies.
              </p>
            </div>
          </div>

          {/* Model Badge Required */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            background: '#F5F3FF',
            border: '1.5px solid #DDD6FE',
            color: 'var(--violet)',
            fontSize: '0.8125rem',
            fontWeight: 700
          }}>
            <Cpu size={15} />
            <span>Powered by Ollama • Qwen3 4B • Local</span>
          </div>
        </div>
      </div>

      {/* Active Prediction Context Banner (if available) */}
      {activePredictionContext && (
        <div style={{
          padding: '0.75rem 1.25rem',
          borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
          border: '1.5px solid #BBF7D0',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={18} style={{ color: '#059669', flexShrink: 0 }} />
            <div style={{ fontSize: '0.8125rem', color: '#166534' }}>
              <strong>Attached Prediction Context:</strong> Employee Age {activePredictionContext.employee?.age || activePredictionContext.employee?.Age}, Income ${activePredictionContext.employee?.monthlyIncome || activePredictionContext.employee?.MonthlyIncome} | 
              <strong style={{ marginLeft: '0.35rem', color: '#047857' }}>
                ML Prediction: {activePredictionContext.prediction?.label || activePredictionContext.prediction?.prediction_text} ({activePredictionContext.prediction?.risk || activePredictionContext.prediction?.risk_level} Risk - {activePredictionContext.prediction?.probability || activePredictionContext.prediction?.probability_pct})
              </strong>
            </div>
          </div>

          <button
            onClick={clearPredictionContext}
            style={{
              background: 'none',
              border: 'none',
              color: '#047857',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear Context
          </button>
        </div>
      )}

      {/* Main Chat Container */}
      <div className="card-hs" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1.25rem' }}>
        {/* Header Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            <Sparkles size={16} style={{ color: 'var(--violet)' }} />
            <span>Interactive Chat Session</span>
          </div>

          <button
            onClick={handleClearChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'none',
              border: '1px solid var(--border-color)',
              padding: '0.3rem 0.65rem',
              borderRadius: '0.375rem',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Trash2 size={14} />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Scrollable Messages list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              {m.role === 'assistant' && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: m.isError ? '#FFE4E6' : 'var(--gradient-btn)',
                  color: m.isError ? '#E11D48' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {m.isError ? <AlertTriangle size={18} /> : <Bot size={18} />}
                </div>
              )}

              <div style={{
                maxWidth: '80%',
                padding: '0.9rem 1.25rem',
                borderRadius: '1rem',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                background: m.role === 'user' ? 'var(--gradient-btn)' : (m.isError ? '#FFE4E6' : '#F5F3FF'),
                color: m.role === 'user' ? '#FFFFFF' : (m.isError ? '#991B1B' : 'var(--primary-deep-purple)'),
                border: m.isError ? '1px solid #FECDD3' : '1px solid rgba(124, 58, 237, 0.1)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {m.content}
              </div>

              {m.role === 'user' && (
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--primary-deep-purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {/* Thinking Loading Indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--gradient-btn)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '1rem',
                background: '#F5F3FF',
                color: 'var(--violet)',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <RefreshCw size={16} className="animate-spin" />
                <span>AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem' }}>
          {(activePredictionContext ? [
            "Why is this employee considered " + (activePredictionContext.prediction?.risk || activePredictionContext.prediction?.risk_level || "low") + " risk?",
            "What factors are contributing to this prediction?",
            "How can we improve retention for this employee?"
          ] : defaultSuggestedPrompts).map((prompt, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSend(prompt)}
              style={{
                whiteSpace: 'nowrap',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid #DDD6FE',
                background: '#FFFFFF',
                color: 'var(--violet)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.15s ease'
              }}
            >
              ✨ {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Type your HR or prediction question..."
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn-primary" style={{ padding: '0.75rem 1.25rem', opacity: (loading || !input.trim()) ? 0.6 : 1 }}>
            <Send size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
