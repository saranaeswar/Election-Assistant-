import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Trash2, Loader2, Bot, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { useChat } from "../hooks/useChat";
import { FAQ_PROMPTS } from "../constants";
import { cn } from "../lib/utils";

export default function ChatBot() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!atBottom);
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFAQ = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <section
      className="flex flex-col h-full min-h-[520px]"
      aria-label="Election Guide AI Chat"
    >
      {/* Header */}
      <div className="tricolour-stripe" />
      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[var(--color-ink)] bg-[var(--color-ink)]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-[var(--color-saffron)] border-2 border-white rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <Bot size={20} />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[var(--color-india-green)] border-2 border-[var(--color-ink)] rounded-full" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm tracking-wide leading-none">Election Assistant</h2>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono mt-0.5">
              Election AI Guide
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Clear chat"
          aria-label="Clear chat history"
        >
          <Trash2 size={16} />
        </button>
      </div>





      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex gap-2 max-w-[92%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 bg-[var(--color-saffron)] border-2 border-[var(--color-ink)] rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <Bot size={14} />
                </div>
              )}
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl border-2 border-[var(--color-ink)] text-sm",
                  msg.role === "user"
                    ? "bg-[var(--color-ashoka)] text-white rounded-tr-sm shadow-[2px_2px_0px_0px_var(--color-ink)]"
                    : "bg-white text-[var(--color-ink)] rounded-tl-sm shadow-[2px_2px_0px_0px_var(--color-ink)]"
                )}
              >
                <div className={cn("prose-chat", msg.role === "user" && "[&_strong]:text-white")}>
                  <Markdown>{msg.content}</Markdown>
                </div>

                {msg.id === "welcome" && (
                  <div className="mt-4 flex flex-col gap-2">
                    {FAQ_PROMPTS.slice(0, 4).map((p) => (
                      <button
                        key={p}
                        onClick={() => handleFAQ(p)}
                        disabled={isLoading}
                        className="text-left w-full px-3 py-2 text-xs font-semibold text-[var(--color-ink)] border border-[var(--color-ink)] rounded-lg hover:bg-[var(--color-saffron)] hover:text-white hover:border-[var(--color-saffron)] transition-colors disabled:opacity-50"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                <p className={cn(
                  "text-[9px] mt-1.5 font-mono opacity-50",
                  msg.role === "user" ? "text-right text-white" : "text-left"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 items-center"
          >
            <div className="w-7 h-7 bg-[var(--color-saffron)] border-2 border-[var(--color-ink)] rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <Bot size={14} />
            </div>
            <div className="px-4 py-3 bg-white border-2 border-[var(--color-ink)] rounded-2xl rounded-tl-sm shadow-[2px_2px_0px_0px_var(--color-ink)]">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="typing-dot w-2 h-2 bg-[var(--color-saffron)] rounded-full block"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 right-6 p-2 bg-white border-2 border-[var(--color-ink)] rounded-full shadow-[2px_2px_0px_0px_var(--color-ink)] hover:bg-gray-50 z-10"
            aria-label="Scroll to bottom"
          >
            <ChevronDown size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="px-4 py-4 bg-white border-t-2 border-[var(--color-ink)]">
        {error && (
          <p className="text-[10px] text-red-600 font-bold uppercase tracking-wide mb-2 px-1">
            ⚠️ {error}
          </p>
        )}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about voting, registration, EVMs…"
            maxLength={500}
            className="flex-1 input truncate py-3 text-sm leading-snug h-[46px]"
            aria-label="Type your question"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="btn btn-saffron p-3 rounded-xl flex-shrink-0"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p className="text-[9px] text-center text-gray-400 font-mono mt-2 uppercase tracking-widest">
          Educational purpose only · ECI Official Portals for legal advice
        </p>
      </div>
    </section>
  );
}
