"use client";

import { Loader2, ScanBarcode } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

import { IconButton } from "./IconButton";

type BarcodeInputProps = {
  disabled?: boolean;
  busy?: boolean;
  onScan: (code: string) => void | Promise<void>;
};

function normalizeScanInput(value: string) {
  return value.replace(/[\x00-\x1f\x7f]/g, "").trim();
}

const DUPLICATE_SCAN_WINDOW_MS = 450;

export function BarcodeInput({ disabled, busy, onScan }: BarcodeInputProps) {
  const [code, setCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);
  const queueRef = useRef<string[]>([]);
  const lastSubmittedRef = useRef<{ code: string; at: number } | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const listener = (event: KeyboardEvent) => {
      if (event.key === "F2") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  async function processQueue() {
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;
    setProcessing(true);
    try {
      while (queueRef.current.length > 0) {
        const nextCode = queueRef.current.shift();
        if (nextCode) {
          await onScan(nextCode);
        }
      }
    } finally {
      processingRef.current = false;
      setProcessing(false);
      inputRef.current?.focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = normalizeScanInput(code);
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    const now = Date.now();
    const lastSubmitted = lastSubmittedRef.current;
    if (
      lastSubmitted &&
      lastSubmitted.code === trimmed &&
      now - lastSubmitted.at < DUPLICATE_SCAN_WINDOW_MS
    ) {
      setCode("");
      inputRef.current?.focus();
      return;
    }
    lastSubmittedRef.current = { code: trimmed, at: now };

    queueRef.current.push(trimmed);
    setCode("");
    inputRef.current?.focus();
    await processQueue();
  }

  const isBusy = busy || processing;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1 group">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 group-focus-within:scale-110 group-focus-within:shadow-blue-500/40">
          <ScanBarcode aria-hidden="true" className="h-5 w-5" />
        </div>
        <input
          ref={inputRef}
          value={code}
          onChange={(event) => setCode(event.target.value)}
          disabled={disabled}
          onFocus={(event) => event.target.select()}
          placeholder={isBusy ? "Skan qilinmoqda..." : "Skanerlash uchun bosing yoxud barcodeni kiriting..."}
          autoComplete="off"
          aria-label="Barcode yoki SKU"
          title="Barcode yoki SKU"
          inputMode="search"
          className="h-18 w-full rounded-2xl border-0 bg-[#131b2e] pl-14 pr-20 text-2xl font-black tracking-wider text-slate-100 shadow-lg shadow-slate-200/50 ring-1 ring-inset ring-slate-200 transition-all duration-200 placeholder:text-slate-500 placeholder:font-medium focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:shadow-xl focus:shadow-blue-500/10 outline-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-700/30 bg-slate-800/50/80 px-2.5 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
            <kbd className="bg-slate-200 rounded px-1 py-0.5 text-slate-400">F2</kbd>
            <span className="hidden sm:inline">Fokus</span>
          </span>
        </div>
      </div>
    </form>
  );
}
