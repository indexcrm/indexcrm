"use client";

import { History, MessageSquarePlus, RefreshCw } from "lucide-react";

import { AIChatSession } from "@/services/api/types";

type AISessionSidebarProps = {
  sessions: AIChatSession[];
  activeSessionId: string | null;
  isLoading?: boolean;
  onNewChat: () => void;
  onRefresh: () => void;
  onSelect: (sessionId: string) => void;
};

function formatDate(value: string) {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat("uz-Latn-UZ", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AISessionSidebar({
  sessions,
  activeSessionId,
  isLoading = false,
  onNewChat,
  onRefresh,
  onSelect,
}: AISessionSidebarProps) {
  return (
    <aside className="grid gap-3 rounded-2xl border border-slate-700/30/80 bg-[#131b2e] p-3.5 shadow-sm lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-slate-600">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
            <History aria-hidden="true" className="h-3.5 w-3.5" />
          </div>
          Chatlar
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/30 bg-[#131b2e] text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 transition-all active:scale-90"
          aria-label="Chatlarni yangilash"
        >
          <RefreshCw
            aria-hidden="true"
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>
      <button
        type="button"
        onClick={onNewChat}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-3 text-xs font-bold text-white shadow-sm hover:from-slate-700 hover:to-slate-800 active:scale-95 transition-all"
      >
        <MessageSquarePlus aria-hidden="true" className="h-3.5 w-3.5" />
        Yangi chat
      </button>
      <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 lg:max-h-none">
        {sessions.length ? (
          sessions.map((session) => {
            const active = activeSessionId === session.id;
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => onSelect(session.id)}
                className={`rounded-xl border p-3 text-left transition-all duration-150 ${
                  active
                    ? "border-blue-200 bg-blue-50 shadow-sm"
                    : "border-slate-700/30/80 bg-[#131b2e] hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="line-clamp-1 text-sm font-bold text-slate-100">
                  {session.title || "Yangi chat"}
                </div>
                <div className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
                  {session.last_message_preview || "Hali xabar yo'q"}
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>{session.message_count ?? 0} xabar</span>
                  <span>{formatDate(session.updated_at)}</span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="rounded-xl border-2 border-dashed border-slate-700/30 p-3.5 text-sm font-semibold text-slate-500 text-center">
            Hozircha chatlar yo'q.
          </div>
        )}
      </div>
    </aside>
  );
}
