"use client";

import { AlertCircle, Bot, MessageSquarePlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AIMessageInput } from "@/components/ai/AIMessageInput";
import { AIMessageList } from "@/components/ai/AIMessageList";
import { AISessionSidebar } from "@/components/ai/AISessionSidebar";
import {
  AISuggestedQuestions,
  getDefaultAIQuestions,
} from "@/components/ai/AISuggestedQuestions";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import {
  getAISessionDetail,
  getAISessions,
  sendAIFeedback,
  sendAIMessage,
} from "@/services/api/ai";
import { ApiError } from "@/services/api/client";
import {
  AIChatMessage,
  AIChatResponse,
  AIChatSession,
} from "@/services/api/types";
import { useAuthStore } from "@/stores/authStore";

type FeedbackStatus = {
  state: "idle" | "saving" | "saved" | "error";
  message?: string;
};

function getChatErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "AI yordamchidan foydalanish uchun tizimga kiring.";
    }
    if (error.status === 403) {
      return "Bu ma'lumot uchun ruxsat yo'q. Ruxsatlarni tekshiring.";
    }
  }
  return "AI yordamchi bilan ulanishda xatolik yuz berdi. Qayta urinib ko'ring.";
}

function buildAssistantMessage(response: AIChatResponse): AIChatMessage {
  return {
    role: "assistant",
    content: response.answer,
    intent: response.intent,
    confidence: response.confidence,
    entities: response.entities,
    source: response.source,
    created_at: new Date().toISOString(),
  };
}

function isValidAIResponse(response: AIChatResponse) {
  return Boolean(response && typeof response.answer === "string");
}

export function AIChatPage() {
  const user = useAuthStore((state) => state.user);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<AIChatSession[]>([]);
  const [suggestions, setSuggestions] = useState(getDefaultAIQuestions());
  const [feedbackByMessageId, setFeedbackByMessageId] = useState<
    Record<string, FeedbackStatus>
  >({});
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [sessionError, setSessionError] = useState("");

  const showMetadata = useMemo(() => process.env.NODE_ENV !== "production", []);

  const refreshSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    setSessionError("");
    try {
      const response = await getAISessions();
      setSessions(response.results ?? []);
    } catch {
      setSessionError("Chatlar ro'yxatini yuklab bo'lmadi.");
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  async function loadSession(id: string) {
    setLoadingSessionId(id);
    setError("");
    try {
      const detail = await getAISessionDetail(id);
      setSessionId(detail.id);
      setMessages(detail.messages ?? []);
      setSuggestions(getDefaultAIQuestions());
    } catch (loadError) {
      setError(getChatErrorMessage(loadError));
    } finally {
      setLoadingSessionId(null);
    }
  }

  function startNewChat() {
    setInput("");
    setError("");
    setSessionId(null);
    setMessages([]);
    setSuggestions(getDefaultAIQuestions());
    setFeedbackByMessageId({});
  }

  async function syncSessionMessages(nextSessionId: string) {
    try {
      const detail = await getAISessionDetail(nextSessionId);
      setMessages(detail.messages ?? []);
    } catch {
      // The chat response is still usable; history can refresh later.
    }
  }

  async function handleSend(messageOverride?: string) {
    const text = (messageOverride ?? input).trim();
    if (!text || isSending) {
      return;
    }

    const userMessage: AIChatMessage = {
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };

    setInput("");
    setError("");
    setMessages((current) => [...current, userMessage]);
    setIsSending(true);

    try {
      const response = await sendAIMessage({
        message: text,
        session_id: sessionId,
      });
      if (!isValidAIResponse(response)) {
        throw new Error("Invalid AI response");
      }

      const nextSessionId =
        response.session_id !== null && response.session_id !== undefined
          ? String(response.session_id)
          : sessionId;
      if (nextSessionId) {
        setSessionId(nextSessionId);
      }
      setSuggestions(
        response.suggestions?.length ? response.suggestions : getDefaultAIQuestions(),
      );
      setMessages((current) => [...current, buildAssistantMessage(response)]);

      if (nextSessionId) {
        await syncSessionMessages(nextSessionId);
      }
      await refreshSessions();
    } catch (sendError) {
      setError(getChatErrorMessage(sendError));
    } finally {
      setIsSending(false);
    }
  }

  async function handleFeedback(messageId: string, rating: "good" | "bad") {
    setFeedbackByMessageId((current) => ({
      ...current,
      [messageId]: { state: "saving", message: "Saqlanmoqda..." },
    }));
    try {
      const response = await sendAIFeedback({ message_id: messageId, rating });
      setFeedbackByMessageId((current) => ({
        ...current,
        [messageId]: {
          state: "saved",
          message: response.message || "Fikringiz saqlandi.",
        },
      }));
    } catch {
      setFeedbackByMessageId((current) => ({
        ...current,
        [messageId]: {
          state: "error",
          message: "Fikrni saqlab bo'lmadi.",
        },
      }));
    }
  }

  if (!user) {
    return (
      <div className="grid gap-5">
        <SectionHeader
          title="AI yordamchi"
          description="Index ma'lumotlari bo'yicha savdo, qoldiq, narx va hisobot savollariga javob beradi."
        />
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 text-sm font-semibold text-slate-500 shadow-sm">
          AI yordamchidan foydalanish uchun tizimga kiring.
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <SectionHeader
        title="AI yordamchi"
        description="Index ma'lumotlari bo'yicha savdo, qoldiq, narx va hisobot savollariga javob beradi."
        actions={
          <button
            type="button"
            onClick={startNewChat}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 active:scale-95 transition-all"
          >
            <MessageSquarePlus aria-hidden="true" className="h-3.5 w-3.5" />
            Yangi chat
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="grid gap-2">
          <AISessionSidebar
            sessions={sessions}
            activeSessionId={sessionId}
            isLoading={isLoadingSessions}
            onNewChat={startNewChat}
            onRefresh={() => void refreshSessions()}
            onSelect={(id) => void loadSession(id)}
          />
          {sessionError ? (
            <div className="rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-50/80 px-3.5 py-2.5 text-xs font-semibold text-amber-800 shadow-sm">
              <div className="flex items-start gap-2">
                <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{sessionError}</span>
              </div>
            </div>
          ) : null}
        </div>

        <section className="grid min-h-[calc(100vh-12rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3 bg-white/80">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/20">
                  <Bot aria-hidden="true" className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-900">
                    {sessionId ? "Joriy chat" : "Yangi chat"}
                  </div>
                  <div className="truncate text-[11px] font-semibold text-slate-400">
                    {loadingSessionId
                      ? "Chat yuklanmoqda..."
                      : "Savolingizni qisqa va aniq yozing."}
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-[360px] flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white">
              <AIMessageList
                messages={messages}
                isLoading={isSending || Boolean(loadingSessionId)}
                showMetadata={showMetadata}
                feedbackByMessageId={feedbackByMessageId}
                onFeedback={(messageId, rating) => void handleFeedback(messageId, rating)}
              />
            </div>

            <div className="grid gap-3 border-t border-slate-200/80 bg-white p-3 sm:p-4">
              {error ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-200/60 bg-gradient-to-r from-rose-50 to-rose-50/80 px-3.5 py-2.5 text-xs font-semibold text-rose-800 shadow-sm">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-200/60">
                    <AlertCircle aria-hidden="true" className="h-3 w-3" />
                  </div>
                  <span className="mt-0.5">{error}</span>
                </div>
              ) : null}
              <AISuggestedQuestions
                questions={suggestions}
                disabled={isSending || Boolean(loadingSessionId)}
                onSelect={(question) => void handleSend(question)}
              />
              <AIMessageInput
                value={input}
                disabled={isSending || Boolean(loadingSessionId)}
                onChange={setInput}
                onSend={() => void handleSend()}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
