"use client";

import { Bot, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

import { AIMessageBubble } from "@/components/ai/AIMessageBubble";
import { AIChatMessage } from "@/services/api/types";

type FeedbackStatus = {
  state: "idle" | "saving" | "saved" | "error";
  message?: string;
};

type AIMessageListProps = {
  messages: AIChatMessage[];
  isLoading?: boolean;
  showMetadata?: boolean;
  feedbackByMessageId?: Record<string, FeedbackStatus>;
  onFeedback?: (messageId: string, rating: "good" | "bad") => void;
};

export function AIMessageList({
  messages,
  isLoading = false,
  showMetadata = false,
  feedbackByMessageId = {},
  onFeedback,
}: AIMessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isLoading]);

  if (!messages.length && !isLoading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
          <Bot aria-hidden="true" className="h-7 w-7 text-blue-600" />
        </div>
        <div className="max-w-md">
          <h2 className="text-lg font-bold tracking-tight text-slate-800">
            Savol bering, men Index ma'lumotlari asosida yordam beraman.
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            Savdo, qoldiq, narx, kassir faoliyati va hisobotlar bo'yicha qisqa
            savol yozing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 px-3 py-4 sm:px-4">
      {messages.map((message, index) => (
        <AIMessageBubble
          key={message.id ?? `${message.role}-${index}-${message.created_at ?? ""}`}
          message={message}
          showMetadata={showMetadata}
          feedbackStatus={message.id ? feedbackByMessageId[message.id] : undefined}
          onFeedback={onFeedback}
        />
      ))}
      {isLoading ? (
        <div className="flex justify-start animate-fade-in">
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-700/30 bg-[#131b2e] px-4 py-3 text-sm font-semibold text-slate-400 shadow-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-blue-600" />
            </div>
            Javob tayyorlanmoqda...
          </div>
        </div>
      ) : null}
      <div ref={bottomRef} />
    </div>
  );
}
