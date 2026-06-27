"use client";

import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Loader2,
  PackageCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

import { createStockMovement } from "@/services/api/inventory";
import { Product } from "@/services/api/types";
import { useReceiveCartStore } from "@/stores/receiveCartStore";
import { useBranches, useWarehouses } from "@/hooks/useLocations";

import { ProductSearch } from "./ProductSearch";

/* ─── Main terminal ─── */
export function ReceiveStockTerminal() {
  const items = useReceiveCartStore((state) => state.items);
  const addProduct = useReceiveCartStore((state) => state.addProduct);
  const clearCart = useReceiveCartStore((state) => state.clearCart);

  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [branchId, setBranchId] = useState("");

  const branchesQuery = useBranches();
  const warehousesQuery = useWarehouses(branchId);
  const branches = branchesQuery.data?.results ?? [];
  const warehouses = warehousesQuery.data?.results ?? [];

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  function handleSelectProduct(product: Product) {
    addProduct(product);
    setNotice(`✓ ${product.name} qo'shildi`);
    setSuccessMessage("");
  }

  async function handleSubmit() {
    if (!branchId) { setNotice("Iltimos, avval filialni tanlang."); return; }

    const targetWarehouseId = warehouses[0]?.id;
    if (!targetWarehouseId) { setNotice("Tanlangan filialda ombor mavjud emas."); return; }

    if (items.length === 0) { setNotice("Hech narsa qo'shilmagan."); return; }

    setIsSubmitting(true);
    setNotice("");
    setSuccessMessage("");

    try {
      await Promise.all(
        items.map((item) =>
          createStockMovement({
            warehouse: targetWarehouseId,
            product: item.product.id,
            movement_type: "IN",
            quantity: item.quantity.toString(),
            note: "Menejer orqali tovar kirim qilindi",
          })
        )
      );
      setSuccessMessage(`${itemCount} ta tovar muvaffaqiyatli kirim qilindi!`);
      clearCart();
    } catch {
      setNotice("Saqlashda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col -mb-8">
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-px bg-[#eef1f6]">

        {/* LEFT: product search */}
        <div className="flex min-h-0 flex-col bg-white border-r border-slate-200">
          <ProductSearch onSelectProduct={handleSelectProduct} />
        </div>

        {/* RIGHT: filial + submit */}
        <aside className="flex min-h-0 flex-col bg-slate-50/80 border-l border-slate-200 overflow-y-auto">

          {/* Notice / success */}
          {notice && (
            <div className="flex items-center gap-2.5 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{notice}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-2.5 border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="p-4 border-b border-slate-200">
            <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-sm">
                <Boxes aria-hidden="true" className="h-3.5 w-3.5" />
              </div>
              Filial
            </div>

            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              disabled={branchesQuery.isFetching && branches.length === 0}
              className="h-11 w-full rounded-lg border-0 bg-white px-4 font-semibold text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all appearance-none"
            >
              <option value="">{branchesQuery.isFetching ? "Yuklanmoqda..." : "Filialni tanlang"}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Item count summary */}
          <div className="px-4 py-3 border-b border-slate-200 bg-white">
            <div className="text-sm font-semibold text-slate-500">
              Qo'shilgan:{" "}
              <span className="font-black text-slate-900">{items.length} xil</span>,{" "}
              <span className="font-black text-slate-900">{itemCount} ta</span>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-end">
            {/* Status */}
            <div className={`mb-4 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold shadow-sm transition-all ${
              branchId && warehouses.length > 0 && items.length > 0
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}>
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                branchId && warehouses.length > 0 && items.length > 0
                  ? "bg-emerald-200/60"
                  : "bg-amber-200/60"
              }`}>
                {branchId && warehouses.length > 0 && items.length > 0
                  ? <CheckCircle2 className="h-3 w-3" />
                  : <AlertTriangle className="h-3 w-3" />
                }
              </div>
              <span>
                {!branchId
                  ? "Filialni tanlang"
                  : warehouses.length === 0
                  ? "Ombor topilmadi"
                  : items.length === 0
                  ? "Mahsulot qo'shing"
                  : `Tayyor: ${items.length} xil, ${itemCount} ta tovar`}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || items.length === 0 || !branchId || warehouses.length === 0}
              className="w-full flex items-center justify-center gap-2 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <PackageCheck className="h-5 w-5" />
              )}
              {isSubmitting ? "Saqlanmoqda..." : "Kirim qilish"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
