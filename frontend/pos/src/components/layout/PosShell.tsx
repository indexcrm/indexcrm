"use client";

import { ReactNode } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { useCashierStore } from "@/stores/cashierStore";

type PosShellProps = {
  children: ReactNode;
};

export function PosShell({ children }: PosShellProps) {
  const {
    activeShiftId,
    branchId,
    cashDeskId,
    cashierEmail,
    cashierName,
    warehouseId,
  } = useCashierStore();

  return (
    <main className="h-screen overflow-hidden bg-[#f4f5f9] text-slate-900 flex flex-col">
      <header className="no-print flex h-14 shrink-0 items-center justify-between bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a] px-5 text-white shadow-lg shadow-indigo-500/5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-sm font-black shadow-lg shadow-indigo-500/25">
              I
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              <span className="text-white">INDEX</span>
              <span className="text-indigo-400 font-light ml-1">POS</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[9px] font-black tracking-widest text-indigo-400 border border-indigo-400/20 uppercase">
              Kassir
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="hidden items-center gap-3 text-slate-400 lg:flex">
            {cashierName || cashierEmail ? (
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                  {(cashierName || cashierEmail || "?").charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-semibold tracking-tight text-sm max-w-[140px] truncate">{cashierName || cashierEmail}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${branchId ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span className="text-slate-400">Filial</span>
                <span className="text-slate-300 font-semibold">{branchId ? "Ha" : "Yo'q"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${warehouseId ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span className="text-slate-400">Ombor</span>
                <span className="text-slate-300 font-semibold">{warehouseId ? "Ha" : "Yo'q"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${activeShiftId ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span className="text-slate-400">Smena</span>
                <span className={`font-semibold ${activeShiftId ? 'text-emerald-400' : 'text-slate-300'}`}>{activeShiftId ? "Ochiq" : "Yo'q"}</span>
              </div>
            </div>
          </div>
          <div className="h-5 w-px bg-white/10 hidden lg:block"></div>
          <LogoutButton />
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </main>
  );
}
