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
      <header className="no-print flex h-14 shrink-0 items-center justify-between bg-gradient-to-r from-[#0f172a]/95 via-[#111827]/95 to-[#0f172a]/95 px-5 text-white border-b border-white/[0.04] backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white text-sm font-black shadow-lg shadow-violet-500/20 ring-1 ring-white/10">
              I
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              <span className="text-white">INDEX</span>
              <span className="text-violet-400 font-light ml-1">POS</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-lg bg-violet-500/10 px-2 py-0.5 text-[9px] font-black tracking-widest text-violet-400 border border-violet-400/20 uppercase shadow-sm">
              Kassir
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="hidden items-center gap-3 text-slate-400 lg:flex">
            {cashierName || cashierEmail ? (
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {(cashierName || cashierEmail || "?").charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-semibold tracking-tight text-sm max-w-[140px] truncate">{cashierName || cashierEmail}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${branchId ? 'bg-violet-400 shadow-violet-400/40' : 'bg-slate-600'} ${branchId ? 'shadow-sm' : ''}`} />
                <span className="text-slate-400">Filial</span>
                <span className="text-slate-300 font-semibold">{branchId ? "Ha" : "Yo'q"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${warehouseId ? 'bg-violet-400 shadow-violet-400/40' : 'bg-slate-600'} ${warehouseId ? 'shadow-sm' : ''}`} />
                <span className="text-slate-400">Ombor</span>
                <span className="text-slate-300 font-semibold">{warehouseId ? "Ha" : "Yo'q"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${activeShiftId ? 'bg-violet-400 shadow-violet-400/40' : 'bg-slate-600'} ${activeShiftId ? 'shadow-sm' : ''}`} />
                <span className="text-slate-400">Smena</span>
                <span className={`font-semibold ${activeShiftId ? 'text-violet-400' : 'text-slate-300'}`}>{activeShiftId ? "Ochiq" : "Yo'q"}</span>
              </div>
            </div>
          </div>
          <div className="h-5 w-px bg-white/[0.06] hidden lg:block"></div>
          <LogoutButton />
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </main>
  );
}
