"use client";

import { Bot, UserRound } from "lucide-react";

import { AIFeedbackButtons } from "@/components/ai/AIFeedbackButtons";
import { AIChatMessage } from "@/services/api/types";

type FeedbackStatus = {
  state: "idle" | "saving" | "saved" | "error";
  message?: string;
};

type AIMessageBubbleProps = {
  message: AIChatMessage;
  showMetadata?: boolean;
  feedbackStatus?: FeedbackStatus;
  onFeedback?: (messageId: string, rating: "good" | "bad") => void;
};

function formatConfidence(value?: number) {
  if (typeof value !== "number") {
    return "";
  }
  return `${Math.round(value * 100)}%`;
}

export function AIMessageBubble({
  message,
  showMetadata = false,
  feedbackStatus,
  onFeedback,
}: AIMessageBubbleProps) {
  const isUser = message.role === "user";
  const label = isUser ? "Siz" : "AI yordamchi";
  const Icon = isUser ? UserRound : Bot;
  const canLeaveFeedback = !isUser && Boolean(message.id && onFeedback);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div
        className={`max-w-[min(680px,92%)] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/20"
            : "border border-slate-200/80 bg-white text-slate-900"
        }`}
      >
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
          <Icon
            aria-hidden="true"
            className={`h-3.5 w-3.5 ${isUser ? "text-blue-100" : "text-cyan-600"}`}
          />
          <span className={isUser ? "text-blue-100" : "text-slate-400"}>
            {label}
          </span>
        </div>
        <div className={`whitespace-pre-wrap break-words text-sm leading-6 ${isUser ? "font-medium text-white" : "font-semibold text-slate-800"}`}>
          {message.content}
        </div>
        {!isUser && showMetadata ? (
          <div className="mt-3 flex flex-wrap gap-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {message.intent ? <span className="rounded-md bg-slate-100 px-2 py-0.5">Niyat: {message.intent}</span> : null}
            {message.source ? <span className="rounded-md bg-slate-100 px-2 py-0.5">Manba: {message.source}</span> : null}
            {message.confidence !== undefined ? (
              <span className="rounded-md bg-slate-100 px-2 py-0.5">Ishonch: {formatConfidence(message.confidence)}</span>
            ) : null}
          </div>
        ) : null}
        {canLeaveFeedback ? (
          <AIFeedbackButtons
            status={feedbackStatus}
            onFeedback={(rating) => onFeedback?.(message.id ?? "", rating)}
          />
        ) : null}
      </div>
    </div>
  );
}
