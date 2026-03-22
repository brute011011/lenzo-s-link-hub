import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

export const LenzoAI = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "Hey! I'm **Lenzo AI** 🤖 — your guide to Lenzo Beam Central services. Ask me anything about Immortal, Injures, Shockify, or Bypasser Roblox!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('lenzo-ai', {
        body: { messages: newMessages.map(m => ({ role: m.role, content: m.content })) }
      });

      if (error) throw error;
      const reply = data?.choices?.[0]?.message?.content || data?.reply || "Sorry, I couldn't process that. Try again!";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops! I'm having trouble connecting. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 left-4 z-40 safari-clean-glass h-14 w-14 flex items-center justify-center"
        style={{ borderRadius: '999px' }}
      >
        <div className="surface-sheen" style={{ borderRadius: '999px' }} />
        {open
          ? <X className="h-6 w-6 relative z-10" style={{ color: '#007AFF' }} />
          : <MessageCircle className="h-6 w-6 relative z-10" style={{ color: '#007AFF' }} />
        }
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            className="fixed bottom-20 left-4 z-40 safari-clean-glass w-80 sm:w-96 h-[28rem] flex flex-col"
            style={{ borderRadius: '28px' }}
          >
            <div className="surface-sheen" style={{ borderRadius: '28px' }} />
            {/* Header */}
            <div className="p-4 flex items-center gap-2 relative z-10" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <Bot className="h-5 w-5" style={{ color: '#007AFF' }} />
              <span className="font-bold" style={{ color: '#1D1D1F' }}>Lenzo AI</span>
              <span className="text-xs ml-auto" style={{ color: '#86868B' }}>Powered by AI</span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(0,122,255,0.1)' }}>
                      <Bot className="h-4 w-4" style={{ color: '#007AFF' }} />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'text-white'
                      : ''
                  }`} style={m.role === 'user' ? { background: '#007AFF' } : { background: 'rgba(0,0,0,0.04)', color: '#1D1D1F' }}>
                    {m.content}
                  </div>
                  {m.role === 'user' && (
                    <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(0,0,0,0.04)' }}>
                      <User className="h-4 w-4" style={{ color: '#1D1D1F' }} />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(0,122,255,0.1)' }}>
                    <Bot className="h-4 w-4" style={{ color: '#007AFF' }} />
                  </div>
                  <div className="rounded-2xl px-3 py-2 text-sm" style={{ background: 'rgba(0,0,0,0.04)', color: '#86868B' }}>
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 flex gap-2 relative z-10" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask Lenzo AI..."
                className="flex-1 rounded-full px-4 py-2 text-sm outline-none"
                style={{ background: 'rgba(0,0,0,0.04)', color: '#1D1D1F', border: '1px solid rgba(0,0,0,0.06)' }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="h-9 w-9 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-colors"
                style={{ background: '#007AFF' }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
