"use client";

import { Minus, Plus, ScanBarcode, ShoppingCart, Trash2 } from "lucide-react";

import { formatMoney } from "@/lib/format";
import { CartItem, getCartLineTotal } from "@/stores/cartStore";

import { IconButton } from "./IconButton";

type CartTableProps = {
  items: CartItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

export function CartTable({ items, onQuantityChange, onRemove }: CartTableProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#131b2e]">
      <div className="grid grid-cols-[1fr_130px_110px_48px] border-b border-slate-700/30/80 bg-slate-50/80 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span>Mahsulot</span>
        <span className="text-center">Miqdor</span>
        <span className="text-right">Jami</span>
        <span />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-slate-100/80">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <div className="rounded-2xl border-2 border-dashed border-slate-700/30 bg-[#131b2e] p-12 max-w-sm animate-fade-in">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-500 mb-4 shadow-sm">
                <ShoppingCart aria-hidden="true" className="h-7 w-7" />
              </div>
              <div className="text-lg font-black text-slate-800 tracking-tight">
                Savat bo'sh
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
                <ScanBarcode aria-hidden="true" className="h-4 w-4" />
                Barcode skan qiling yoki mahsulot tanlang
              </div>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.product.id}
              className="group grid min-h-[5.5rem] grid-cols-[1fr_130px_110px_48px] items-center gap-3 bg-[#131b2e] px-5 py-3.5 transition-all duration-150 hover:bg-blue-50/20 hover:shadow-sm"
            >
              <div className="min-w-0">
                <div className="truncate text-[15px] font-bold text-slate-100 tracking-tight group-hover:text-blue-700 transition-colors">
                  {item.product.name}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-0.5">
                  <span className="text-slate-400">{item.product.sku || item.product.barcode || "-"}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-400">{formatMoney(item.price)}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-0.5 rounded-lg border border-slate-700/30 bg-[#131b2e] shadow-sm">
                <IconButton
                  icon={<Minus aria-hidden="true" className="h-3.5 w-3.5" />}
                  label="Kamaytirish"
                  onClick={() =>
                    onQuantityChange(item.product.id, item.quantity - 1)
                  }
                  hideLabel
                  className="h-8 w-8 rounded-l-lg rounded-r-none bg-transparent text-slate-400 hover:bg-slate-100 border-0 shadow-none"
                />
                <input
                  value={item.quantity}
                  onChange={(event) =>
                    onQuantityChange(item.product.id, Number(event.target.value))
                  }
                  onFocus={(event) => event.target.select()}
                  className="h-8 w-10 border-0 bg-transparent text-center text-sm font-bold text-slate-100 focus:ring-0"
                  inputMode="decimal"
                  min="0"
                  step="1"
                />
                <IconButton
                  icon={<Plus aria-hidden="true" className="h-3.5 w-3.5" />}
                  label="Ko'paytirish"
                  onClick={() =>
                    onQuantityChange(item.product.id, item.quantity + 1)
                  }
                  hideLabel
                  className="h-8 w-8 rounded-r-lg rounded-l-none bg-transparent text-blue-600 hover:bg-blue-50 border-0 shadow-none"
                />
              </div>
              <div className="text-right text-base font-black text-slate-100 tracking-tight">
                {formatMoney(getCartLineTotal(item))}
              </div>
              <div className="flex justify-end">
                <IconButton
                  icon={<Trash2 aria-hidden="true" className="h-4 w-4" />}
                  label="O'chirish"
                  tone="danger"
                  onClick={() => onRemove(item.product.id)}
                  hideLabel
                  className="h-9 w-9 rounded-lg opacity-0 transition-all duration-150 group-hover:opacity-100 hover:scale-105"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
