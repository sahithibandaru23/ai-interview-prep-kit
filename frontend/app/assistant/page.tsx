"use client";

import { API_URL } from "../../lib/api";
import { FormEvent, useState } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AssistantPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! 👋 I'm your AI Interview Assistant. Ask me about interview questions, technical concepts, preparation strategies, or mock interviews.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const userMessage = message.trim();

    if (!userMessage || loading) return;

    setMessage("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await fetch(
        `${API_URL}/api/assistant/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get AI response");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? `Sorry, I couldn't respond. ${error.message}`
              : "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold shadow-lg">
              AI
            </div>

            <div>
              <h1 className="font-bold">
                AI Interview Assistant
              </h1>

              <p className="text-xs text-slate-400">
                Your personal interview coach
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-77px)] max-w-4xl flex-col px-4 py-8">
        {/* Title */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl shadow-xl">
            ✨
          </div>

          <h2 className="text-3xl font-bold">
            How can I help you prepare?
          </h2>

          <p className="mt-2 text-slate-400">
            Ask me anything about your upcoming interview.
          </p>
        </div>

        {/* Chat */}
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
          <div className="max-h-[55vh] space-y-4 overflow-y-auto pr-2">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    item.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "border border-white/10 bg-slate-900 text-slate-200"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-400">
                  <span className="animate-pulse">
                    AI is thinking...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[
            "Give me a JavaScript interview question",
            "Explain React hooks simply",
            "Help me answer Tell me about yourself",
            "Give me a mock interview question",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setMessage(suggestion)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="mt-4 flex gap-3"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your interview question..."
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-slate-600">
          AI-generated responses may need verification.
        </p>
      </div>
    </main>
  );
}
