"use client";

import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  CreditCard,
  SplitSquareHorizontal,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { formatMoney } from "@/lib/format";
import { SalePaymentMethod } from "@/services/api/types";

import { IconButton } from "./IconButton";

type Payment = {
  payment_method: SalePaymentMethod;
  amount: number;
  note?: string;
};

type PaymentPanelProps = {
  total: number;
  disabled?: boolean;
  disabledReason?: string;
  loading?: boolean;
  variant?: "online" | "offline";
  onComplete: (payments: Payment[]) => void;
};

type PaymentMode = "cash" | "card" | "mixed";

export function PaymentPanel({
  total,
  disabled,
  disabledReason,
  loading,
  variant = "online",
  onComplete,
}: PaymentPanelProps) {
  const [mode, setMode] = useState<PaymentMode>("cash");
  const [cashAmount, setCashAmount] = useState(total);
  const [cardAmount, setCardAmount] = useState(0);

  useEffect(() => {
    if (mode === "cash") {
      setCashAmount(total);
      setCardAmount(0);
    }
    if (mode === "card") {
      setCashAmount(0);
      setCardAmount(total);
    }
  }, [mode, total]);

  const paidAmount = useMemo(
    () => Math.round((cashAmount + cardAmount) * 100) / 100,
    [cashAmount, cardAmount],
  );
  const changeAmount = Math.max(0, paidAmount - total);
  const paymentShortfall = Math.max(0, Math.round((total - paidAmount) * 100) / 100);
  const canComplete = total > 0 && paidAmount >= total && !disabled && !loading;
  const isOfflineSale = variant === "offline";
  const readyLabel = isOfflineSale
    ? "Offline savdoni saqlashga tayyor"
    : "Savdoni yakunlashga tayyor";
  const actionLabel = isOfflineSale ? "Offline saqlash" : "Savdoni yakunlash";
  const loadingLabel = isOfflineSale ? "Offline saqlanmoqda" : "Yakunlanmoqda";

  const submitPayment = useCallback(() => {
    if (!canComplete) {
      return;
    }
    const payments: Payment[] = [];
    if (cashAmount > 0) {
      payments.push({ payment_method: "CASH", amount: cashAmount });
    }
    if (cardAmount > 0) {
      payments.push({ payment_method: "CARD", amount: cardAmount });
    }
    onComplete(payments);
  }, [canComplete, cardAmount, cashAmount, onComplete]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "F4") {
        event.preventDefault();
        submitPayment();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [submitPayment]);

  return (
    <section className="no-print border-b border-slate-200/80 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
          <Banknote aria-hidden="true" className="h-3.5 w-3.5" />
        </div>
        To'lov
      </div>
      <div className="grid grid-cols-3 gap-2">
        <IconButton
          icon={<Banknote aria-hidden="true" className="h-4 w-4" />}
          label="Naqd"
          tone={mode === "cash" ? "success" : "neutral"}
          onClick={() => setMode("cash")}
        />
        <IconButton
          icon={<CreditCard aria-hidden="true" className="h-4 w-4" />}
          label="Karta"
          tone={mode === "card" ? "primary" : "neutral"}
          onClick={() => setMode("card")}
        />
        <IconButton
          icon={<SplitSquareHorizontal aria-hidden="true" className="h-4 w-4" />}
          label="Aralash"
          tone={mode === "mixed" ? "warning" : "neutral"}
          onClick={() => setMode("mixed")}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Naqd summa
          </span>
          <input
            value={cashAmount}
            onChange={(event) => setCashAmount(Number(event.target.value) || 0)}
            onFocus={(event) => event.target.select()}
            disabled={mode === "card"}
            inputMode="decimal"
            className="h-11 w-full rounded-xl border border-slate-200/80 bg-white px-3.5 text-lg font-black shadow-input transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Karta summa
          </span>
          <input
            value={cardAmount}
            onChange={(event) => setCardAmount(Number(event.target.value) || 0)}
            onFocus={(event) => event.target.select()}
            disabled={mode === "cash"}
            inputMode="decimal"
            className="h-11 w-full rounded-xl border border-slate-200/80 bg-white px-3.5 text-lg font-black shadow-input transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400"
          />
        </label>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50 p-3 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">To'landi</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{formatMoney(paidAmount)}</div>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50 p-3 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Qaytim</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{formatMoney(changeAmount)}</div>
        </div>
      </div>
      <div
        className={`mt-3 flex min-h-10 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold shadow-sm transition-all ${
          canComplete
            ? "border-blue-200 bg-blue-50 text-blue-800"
            : "border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
          canComplete ? "bg-blue-200/60" : "bg-amber-200/60"
        }`}>
          {canComplete ? (
            <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
          ) : (
            <AlertCircle aria-hidden="true" className="h-3 w-3" />
          )}
        </div>
        <span>
          {canComplete
            ? readyLabel
            : disabledReason ||
              (paymentShortfall > 0
                ? `To'lov yetishmayapti: ${formatMoney(paymentShortfall)}`
                : "Checkout tayyor emas")}
        </span>
      </div>
      {isOfflineSale ? (
        <div className="mt-2.5 rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-50/80 px-3.5 py-2.5 text-[11px] font-semibold text-amber-900 shadow-sm">
          <div className="flex items-start gap-2">
            <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>Savdo ushbu qurilmada saqlanadi. Yakuniy server chek raqami internet qaytganda qo'lda sinxronlashdan keyin chiqadi.</span>
          </div>
        </div>
      ) : null}
      <IconButton
        icon={<CheckCircle2 aria-hidden="true" className="h-5 w-5" />}
        label={loading ? loadingLabel : actionLabel}
        tone="success"
        onClick={submitPayment}
        disabled={!canComplete}
        className="mt-3 h-14 w-full text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20"
      />
    </section>
  );
}
