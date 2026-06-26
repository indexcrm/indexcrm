"use client";

import { ShoppingCart, XCircle } from "lucide-react";

import { formatMoney } from "@/lib/format";

import { IconButton } from "./IconButton";

type CartSummaryProps = {
  subtotal: number;
  total: number;
  itemCount: number;
  onClear: () => void;
};

export function CartSummary({
  subtotal,
  total,
  itemCount,
  onClear,
}: CartSummaryProps) {
  return (
    <section className="no-print border-t border-slate-700/30/80 bg-gradient-to-b from-white to-slate-50/50 p-4">
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-slate-700/30/70 bg-[#131b2e] p-3 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Soni
          </div>
          <div className="text-2xl font-black text-slate-100 mt-0.5">{itemCount}</div>
        </div>
        <div className="rounded-xl border border-slate-700/30/70 bg-[#131b2e] p-3 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Oraliq
          </div>
          <div className="text-2xl font-black text-slate-100 mt-0.5">
            {formatMoney(subtotal)}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-emerald-50/50 p-3 shadow-sm ring-1 ring-emerald-200/50">
          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
            Jami
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-0.5">
            {formatMoney(total)}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <IconButton
          icon={<ShoppingCart aria-hidden="true" className="h-4 w-4" />}
          label="Yangi savdo"
          onClick={onClear}
          tone="warning"
          className="flex-1 h-10 rounded-xl text-xs"
          disabled={itemCount === 0}
        />
        <IconButton
          icon={<XCircle aria-hidden="true" className="h-4 w-4" />}
          label="Tozalash"
          onClick={onClear}
          tone="danger"
          className="flex-1 h-10 rounded-xl text-xs"
          disabled={itemCount === 0}
        />
      </div>
    </section>
  );
}
