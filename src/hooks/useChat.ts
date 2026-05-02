import { useState, useCallback } from "react";
import { sanitizeInput } from "../lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface GeminiHistoryItem {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "**Hello! I am your Election Assistant!**\n\nI'm your personal Indian Election Education Assistant. Ask me anything about:\n\n- 📋 Voter Registration\n- 🗳️ How to vote (EVMs, VVPAT)\n- 📜 Election rules & Model Code of Conduct\n- 🏛️ How the election process works\n\nYour vote is your voice — let's make it count! 🇮🇳",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    const clean = sanitizeInput(text);
    if (!clean || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: clean,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    // Build history for API (excluding welcome message)
    const history: GeminiHistoryItem[] = messages
      .filter((m) => m.id !== "welcome")
      .slice(-10)
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, history }),
        signal: AbortSignal.timeout(30000),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Request failed");

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.reply || "Sorry, I couldn't get a response.",
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Connection error. Please try again.");
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "I apologize! I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "**Hello! I am your Election Assistant!**\n\nI'm your personal Indian Election Education Assistant. Ask me anything about voter registration, EVMs, Model Code of Conduct, or how Indian elections work!\n\nYour vote is your voice — let's make it count! 🇮🇳",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
