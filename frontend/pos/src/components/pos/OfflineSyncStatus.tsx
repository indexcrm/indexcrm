"use client";

import { AlertCircle, Cloud, CloudOff, Loader2, RotateCw } from "lucide-react";

import { useOfflineSalesQueue } from "@/hooks/useOfflineSalesQueue";
import { usePosConnectivity } from "@/hooks/usePosConnectivity";
import { formatMoney } from "@/lib/format";
import { getStoredAuthToken } from "@/services/api/client";
import {
  getOfflineFailureGuidance,
  type PendingSaleRecord,
} from "@/services/offlineSalesQueue";

function formatQueuedTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function statusClassName(status: PendingSaleRecord["status"]) {
  if (status === "synced") {
    return "bg-blue-100 text-blue-800";
  }
  if (status === "failed") {
    return "bg-rose-100 text-rose-800";
  }
  if (status === "syncing") {
    return "bg-blue-100 text-blue-800";
  }
  return "bg-amber-100 text-amber-900";
}

function statusLabel(status: PendingSaleRecord["status"]) {
  if (status === "pending") {
    return "Kutilmoqda";
  }
  if (status === "failed") {
    return "Xato";
  }
  if (status === "syncing") {
    return "Yuborilmoqda";
  }
  return "Yuborildi";
}

function failureNextStep(sale: PendingSaleRecord) {
  const failureClass =
    sale.failureClass ?? sale.failureCategory ?? (sale.status === "failed" ? "unknown" : undefined);
  return failureClass ? getOfflineFailureGuidance(failureClass).nextStep : "";
}

export function OfflineSyncStatus() {
  const connectivity = usePosConnectivity();
  const {
    isSyncing,
    lastResult,
    lockState,
    queue,
    storageFallbackReason,
    storageInitialized,
    storageMode,
    summary,
    sync,
  } = useOfflineSalesQueue();
  const syncableCount = summary.pending + summary.failed;
  const lockedByAnotherTab = lockState.lockedByAnotherTab;
  const hasAuthToken = Boolean(getStoredAuthToken());
  const blockReason =
    connectivity.status === "browser_offline"
      ? "Offline: internet yo'q."
      : connectivity.status === "checking"
        ? "Sinxronlashdan oldin backend tekshirilmoqda."
        : connectivity.status === "unknown"
          ? "Aloqa holati noma'lum. Backend tekshiruvini kuting."
          : connectivity.status === "backend_unreachable"
            ? connectivity.message || "Server mavjud emas."
        : !hasAuthToken
          ? "Navbatdagi savdolarni sinxronlashdan oldin tizimga kiring."
        : isSyncing || summary.syncing > 0
          ? "Navbat sinxronlash allaqachon ishlayapti."
          : lockedByAnotherTab
            ? "Boshqa POS oynasi navbatdagi savdolarni sinxronlayapti."
            : syncableCount === 0
              ? "Sinxronlanadigan kutilayotgan yoki xato savdolar yo'q."
              : "";
  const disabled = Boolean(blockReason);
  const syncing = isSyncing || summary.syncing > 0;
  const syncState =
    syncableCount > 0 && !disabled
      ? `${syncableCount} lokal savdo yuborishga tayyor`
      : blockReason || "Sinxronlash bloklangan";
  const connectionLabel =
    connectivity.status === "online"
      ? "Online: API ishlayapti"
      : connectivity.status === "browser_offline"
        ? "Offline: internet yo'q"
        : connectivity.status === "backend_unreachable"
          ? "Server mavjud emas"
          : connectivity.status === "checking"
            ? "Aloqa tekshirilmoqda"
            : "Aloqa noma'lum";
  const recentSales = queue
    .slice()
    .sort(
      (first, second) =>
        new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
    )
    .slice(0, 4);

  async function handleSync() {
    const health = await connectivity.refresh({ force: true });
    await sync({
      isOnline: health.status !== "browser_offline",
      backendReachable: health.status === "online",
    });
  }

  return (
    <div
      className={`grid min-h-10 gap-2 rounded border px-3 py-2 text-xs font-black ${
        connectivity.status === "online"
          ? "border-blue-200 bg-blue-50 text-blue-800"
          : "border-amber-300 bg-amber-50 text-amber-900"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {connectivity.status === "online" ? (
            <Cloud aria-hidden="true" className="h-4 w-4" />
          ) : (
            <CloudOff aria-hidden="true" className="h-4 w-4" />
          )}
          <span>{connectionLabel}</span>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={handleSync}
          title={disabled ? blockReason : "Kutilayotgan va xato savdolarni sinxronlash"}
          className="inline-flex min-h-8 items-center gap-1 rounded border border-current px-2 py-1 text-[11px] font-black uppercase disabled:cursor-not-allowed disabled:opacity-45"
        >
          {syncing ? (
            <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCw aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {syncing ? "Sinxronlanmoqda" : "Lokal savdolarni yuborish"}
        </button>
        <a
          href="/dashboard/offline-queue"
          className="inline-flex min-h-8 items-center rounded border border-current px-2 py-1 text-[11px] font-black uppercase"
        >
          Ko'rib chiqish
        </a>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700">
        <span>{syncState}</span>
        <span>Lokal: {summary.pending}</span>
        <span>Ko'rish kerak: {summary.failed}</span>
        <span>Yuborilmoqda: {summary.syncing}</span>
        <span>Yuborildi: {summary.synced}</span>
      </div>
      {connectivity.status === "backend_unreachable" ? (
        <div className="text-[11px] text-amber-900">
          Server mavjud emas. Savdolarni offline saqlang va keyin sinxronlashni qayta urining.
        </div>
      ) : null}
      {storageInitialized && storageMode === "localStorage" ? (
        <div className="text-[11px] text-amber-900">
          IndexedDB mavjud emas. Offline savdolar localStorage zaxirasidan
          foydalanmoqda. {storageFallbackReason}
        </div>
      ) : null}
      {lastResult ? (
        <div
          className={`flex items-start gap-1.5 text-[11px] ${
            lastResult.failed > 0 || lastResult.skipped
              ? "text-amber-900"
              : "text-blue-800"
          }`}
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Oxirgi sinxronlash {formatQueuedTime(lastResult.completedAt)}: {lastResult.reason}
          </span>
        </div>
      ) : null}
      {lockedByAnotherTab ? (
        <div className="text-[11px] text-amber-900">
          Boshqa POS oynasi navbatdagi savdolarni sinxronlayapti.
        </div>
      ) : null}
      {recentSales.length > 0 ? (
        <div className="grid gap-1 border-t border-current/20 pt-2 text-[11px] text-slate-700">
          {recentSales.map((sale) => (
            <div
              key={sale.id}
              className="grid gap-1 rounded bg-white/70 px-2 py-1 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-black">
                  {sale.serverReceiptNumber ?? sale.receiptFallback.receiptNumber}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${statusClassName(
                    sale.status,
                  )}`}
                >
                  {statusLabel(sale.status)}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <span>{formatMoney(sale.totals.total)}</span>
                <span>{formatQueuedTime(sale.createdAt)}</span>
                <span>Urinishlar: {sale.retryCount}</span>
                {sale.lastAttemptAt ? (
                  <span>Oxirgi urinish: {formatQueuedTime(sale.lastAttemptAt)}</span>
                ) : null}
              </div>
              {sale.lastError ? (
                <div className="text-rose-800">
                  {sale.lastError}
                </div>
              ) : null}
              {failureNextStep(sale) ? (
                <div className="text-amber-900">
                  Keyingi qadam: {failureNextStep(sale)}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
