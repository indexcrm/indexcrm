"use client";

import { Loader2, SendHorizonal } from "lucide-react";

type AIMessageInputProps = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function AIMessageInput({
  value,
  disabled = false,
  onChange,
  onSend,
}: AIMessageInputProps) {
  return (
    <div className="flex gap-2.5">
      <textarea
        value={value}
        disabled={disabled}
        rows={2}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSend();
          }
        }}
        placeholder="Savolingizni yozing..."
        className="min-h-[52px] flex-1 resize-none rounded-xl border border-slate-700/30/80 bg-[#131b2e] px-3.5 py-2.5 text-sm font-semibold text-slate-100 shadow-inner shadow-black/10 placeholder:text-slate-500 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
      />
      <button
        type="button"
        disabled={disabled || !value.trim()}
        onClick={onSend}
        className="inline-flex h-[52px] min-w-28 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-400 hover:to-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {disabled ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <SendHorizonal aria-hidden="true" className="h-4 w-4" />
        )}
        Yuborish
      </button>
    </div>
  );
}
