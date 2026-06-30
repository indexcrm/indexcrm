"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";

type FeedbackStatus = {
  state: "idle" | "saving" | "saved" | "error";
  message?: string;
};

type AIFeedbackButtonsProps = {
  disabled?: boolean;
  status?: FeedbackStatus;
  onFeedback: (rating: "good" | "bad") => void;
};

export function AIFeedbackButtons({
  disabled = false,
  status = { state: "idle" },
  onFeedback,
}: AIFeedbackButtonsProps) {
  const isSaving = status.state === "saving";
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        disabled={disabled || isSaving}
        onClick={() => onFeedback("good")}
        className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-orange-200/70 bg-orange-50 px-2.5 text-[10px] font-bold text-orange-700 hover:bg-orange-100 active:scale-90 transition-all disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ThumbsUp aria-hidden="true" className="h-3.5 w-3.5" />
        Foydali
      </button>
      <button
        type="button"
        disabled={disabled || isSaving}
        onClick={() => onFeedback("bad")}
        className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-amber-200/70 bg-amber-50 px-2.5 text-[10px] font-bold text-amber-700 hover:bg-amber-100 active:scale-90 transition-all disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ThumbsDown aria-hidden="true" className="h-3.5 w-3.5" />
        Foydasiz
      </button>
      {status.message ? (
        <span
          className={`text-[10px] font-semibold ${
            status.state === "error" ? "text-amber-500" : "text-orange-600"
          }`}
        >
          {status.message}
        </span>
      ) : null}
    </div>
  );
}
