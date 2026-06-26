"use client";

import { AlertCircle, Loader2, PackageSearch, RotateCw, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useProductSearch } from "@/hooks/useProducts";
import { formatMoney } from "@/lib/format";
import { findProductByBarcode } from "@/services/api/products";
import { Product } from "@/services/api/types";

type ProductSearchProps = {
  onSelectProduct: (product: Product) => void;
};

export function ProductSearch({ onSelectProduct }: ProductSearchProps) {
  const [search, setSearch] = useState("");
  const [enterNotice, setEnterNotice] = useState("");
  const [enterLoading, setEnterLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const productsQuery = useProductSearch(search);
  const products = productsQuery.data?.results ?? [];
  const normalizedSearch = search.trim();
  const isSearchReady =
    normalizedSearch.length === 0 || normalizedSearch.length >= 2;

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "F3") {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  async function handleEnterAdd() {
    const code = search.trim();
    if (!code || enterLoading) {
      return;
    }

    setEnterNotice("");
    setEnterLoading(true);
    try {
      const exactProduct = await findProductByBarcode(code);
      if (exactProduct) {
        onSelectProduct(exactProduct);
        setSearch("");
        searchInputRef.current?.focus();
        return;
      }

      const refreshedProducts = (await productsQuery.refetch()).data?.results ?? [];
      if (refreshedProducts.length === 1) {
        onSelectProduct(refreshedProducts[0]);
        setSearch("");
        searchInputRef.current?.focus();
        return;
      }

      setEnterNotice(`Mahsulot topilmadi: ${code}`);
      searchInputRef.current?.focus();
    } catch (error) {
      setEnterNotice(
        error instanceof TypeError
          ? "Backend bilan aloqa yo'q. Mahsulot qo'shilmadi."
          : `${code} bo'yicha mahsulot qidiruvi amalga oshmadi. Qayta urinib ko'ring.`,
      );
      searchInputRef.current?.focus();
    } finally {
      setEnterLoading(false);
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#131b2e]">
      <div className="border-b border-slate-700/30 p-4 bg-[#131b2e]">
        <div className="relative group">
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 group-focus-within:scale-110">
            <Search aria-hidden="true" className="h-4 w-4" />
          </div>
          <input
            ref={searchInputRef}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setEnterNotice("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleEnterAdd();
              }
            }}
            placeholder="Mahsulot qidirish (nomi, SKU...)"
            className="h-14 w-full rounded-2xl border-0 bg-[#131b2e] pl-12 pr-16 text-lg font-bold tracking-tight text-slate-100 shadow-lg shadow-slate-200/50 ring-1 ring-inset ring-slate-200 transition-all duration-200 placeholder:text-slate-500 placeholder:font-medium focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:shadow-xl focus:shadow-blue-500/10 outline-none"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-700/30 bg-slate-800/50/80 px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
              <kbd className="bg-slate-200 rounded px-1 py-0.5 text-slate-400">F3</kbd>
              <span className="hidden sm:inline">Qidiruv</span>
            </span>
          </div>
        </div>
        {enterNotice ? (
          <div
            role="status"
            className="mt-2.5 rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-50/80 px-3.5 py-2.5 text-xs font-bold text-amber-900 shadow-sm animate-fade-in"
          >
            <div className="flex items-start gap-2">
              <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{enterNotice}</span>
            </div>
          </div>
        ) : null}
        {enterLoading ? (
          <div
            role="status"
            className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-blue-200/60 bg-gradient-to-r from-blue-50 to-blue-50/80 px-3.5 py-2.5 text-xs font-bold text-blue-800 shadow-sm"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200/60">
              <Loader2 aria-hidden="true" className="h-3 w-3 animate-spin" />
            </div>
            Mahsulot qidirilmoqda
          </div>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {!isSearchReady ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700/30 bg-slate-800/50/50 p-6 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 mb-3 shadow-sm">
              <Search aria-hidden="true" className="h-6 w-6" />
            </div>
            <div className="text-base font-black text-slate-300 tracking-tight">
              Qidirish uchun yozishda davom eting
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-500">
              Kamida 2 ta belgi kiriting yoki barcode skan qiling.
            </div>
          </div>
        ) : null}

        {isSearchReady && productsQuery.isLoading ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl bg-[#131b2e] p-6 text-center shadow-sm ring-1 ring-slate-200/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 mb-3 shadow-sm">
              <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin" />
            </div>
            <div className="text-base font-black text-slate-300 tracking-tight">
              Mahsulotlar yuklanmoqda
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-500">
              Savdo uchun faol mahsulotlar tayyorlanmoqda.
            </div>
          </div>
        ) : null}

        {isSearchReady && productsQuery.isError ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-rose-50 to-rose-50/30 p-6 text-center shadow-sm ring-1 ring-rose-200/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 mb-3 shadow-sm">
              <AlertCircle aria-hidden="true" className="h-6 w-6" />
            </div>
            <div className="text-base font-black text-rose-900 tracking-tight">
              Mahsulotlarni yuklab bo'lmadi
            </div>
            <div className="mt-1 text-sm font-semibold text-rose-600">
              Aloqani tekshirib, qayta urinib ko'ring.
            </div>
            <button
              type="button"
              onClick={() => void productsQuery.refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-[#131b2e] px-4 py-2.5 text-sm font-bold text-rose-700 shadow-sm hover:bg-rose-50 transition-all active:scale-95"
            >
              <RotateCw aria-hidden="true" className="h-4 w-4" />
              Qayta urinish
            </button>
          </div>
        ) : null}

        {isSearchReady && productsQuery.isSuccess && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-2">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="flex min-h-[5.5rem] flex-col items-start justify-between rounded-2xl border border-slate-700/30 bg-[#131b2e] p-3.5 text-left shadow-sm transition-all duration-150 hover:border-blue-400/60 hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
              >
                <div className="w-full">
                  <span className="line-clamp-2 text-sm font-bold text-slate-100 leading-snug">
                    {product.name}
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold text-slate-500">
                    {product.sku || product.barcode || "-"}
                  </span>
                </div>
                <span className="mt-2 text-base font-black text-emerald-700">
                  {formatMoney(product.selling_price)}
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {isSearchReady && productsQuery.isSuccess && products.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl bg-[#131b2e] p-6 text-center shadow-sm ring-1 ring-slate-200/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 mb-3 shadow-sm">
              <PackageSearch aria-hidden="true" className="h-6 w-6" />
            </div>
            <div className="text-base font-black text-slate-300 tracking-tight">
              {normalizedSearch ? "Mos mahsulot topilmadi" : "Faol mahsulot yo'q"}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-500">
              {normalizedSearch
                ? "Boshqa nom, SKU yoki barcode bilan urinib ko'ring."
                : "Savdodan oldin katalogga faol mahsulot qo'shing."}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
