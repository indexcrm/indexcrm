"use client";

import { Edit3, PackagePlus, PackageSearch, Save, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DataTable } from "@/components/dashboard/DataTable";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { IconButton } from "@/components/pos/IconButton";
import { useProductsDashboard } from "@/hooks/useDashboardData";
import { formatApiError } from "@/lib/apiErrors";
import { formatMoney } from "@/lib/format";
import {
  createProduct,
  listBrands,
  listCategories,
  listUnits,
  ProductPayload,
  updateProduct,
} from "@/services/api/products";
import { Product } from "@/services/api/types";

type ProductFormState = {
  id?: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  sku: string;
  barcode: string;
  volume_preset: string;
  volume_custom: string;
  cost_price: string;
  selling_price: string;
  is_active: boolean;
};

const emptyForm: ProductFormState = {
  name: "",
  category: "",
  brand: "",
  unit: "",
  sku: "",
  barcode: "",
  volume_preset: "",
  volume_custom: "",
  cost_price: "0.00",
  selling_price: "0.00",
  is_active: true,
};

// Debounce hook: input o'zgarganda kechiktirib query yuboradi
function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function formatPrice(value: string): string {
  if (!value) return "0.00";
  const numericString = value.replace(/,/g, '.').replace(/[^\d.-]/g, '');
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? "0.00" : parsed.toFixed(2);
}

function formFromProduct(product: Product): ProductFormState {
  const volFloat = product.volume ? parseFloat(product.volume) : null;
  const isPreset = volFloat !== null && [0.5, 0.9, 1, 1.5, 2].includes(volFloat);
  const presetValue = volFloat?.toString() ?? "";

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand ?? "",
    unit: product.unit,
    sku: product.sku ?? "",
    barcode: product.barcode ?? "",
    volume_preset: isPreset ? presetValue : (product.volume ? "Boshqa..." : ""),
    volume_custom: !isPreset && product.volume ? product.volume.toString() : "",
    cost_price: product.cost_price,
    selling_price: product.selling_price,
    is_active: product.is_active,
  };
}

function buildPayload(form: ProductFormState): ProductPayload {
  const rawVolume = form.volume_preset === "Boshqa..." ? form.volume_custom : form.volume_preset;
  const cleanVolume = rawVolume ? rawVolume.replace(/,/g, '.').replace(/[^\d.]/g, '') : "";

  return {
    category: form.category,
    brand: form.brand || null,
    name: form.name.trim(),
    barcode: form.barcode.trim() || null,
    sku: form.sku.trim() || null,
    volume: cleanVolume || null,
    cost_price: formatPrice(form.cost_price),
    selling_price: formatPrice(form.selling_price),
    min_price: formatPrice(form.cost_price),
    unit: form.unit,
    is_active: form.is_active,
  };
}

export function ProductsDashboardPage() {
  const queryClient = useQueryClient();
  // Qidiruv so'zi (foydalanuvchi kiritayotgan)
  const [searchInput, setSearchInput] = useState("");
  // Debounce: 400ms kechikish bilan API ga yuboriladi
  const debouncedSearch = useDebounce(searchInput, 400);
  const [form, setForm] = useState<ProductFormState | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Nomi inputiga focus ref
  const nameInputRef = useRef<HTMLInputElement>(null);

  const productsQuery = useProductsDashboard(debouncedSearch);
  const products = productsQuery.data?.results ?? [];

  const categoriesQuery = useQuery({
    queryKey: ["catalog-categories"],
    queryFn: listCategories,
  });
  const brandsQuery = useQuery({
    queryKey: ["catalog-brands"],
    queryFn: listBrands,
  });
  const unitsQuery = useQuery({ queryKey: ["catalog-units"], queryFn: listUnits });
  const categories = categoriesQuery.data?.results ?? [];
  const brands = brandsQuery.data?.results ?? [];
  const units = unitsQuery.data?.results ?? [];
  const productSetupLoading = categoriesQuery.isLoading || unitsQuery.isLoading;
  const productSetupUnavailable = categoriesQuery.isError || unitsQuery.isError;

  // Forma ochilganda Nomi inputiga avtomatik focus
  useEffect(() => {
    if (form && !form.id) {
      // Yangi mahsulot formasi ochilganda focus
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [form?.id, form !== null]);

  // OLIB TASHLANDI: useEffect bu yerda qayta-qayta setForm qilib focus o'g'irlar edi
  // Endi category va unit forma ochilganda bir marta o'rnatiladi

  const saveProduct = useMutation({
    mutationFn: (nextForm: ProductFormState) => {
      const payload = buildPayload(nextForm);
      return nextForm.id
        ? updateProduct(nextForm.id, payload)
        : createProduct(payload);
    },
    onSuccess: () => {
      setForm(null);
      setSearchInput("");
      setSuccessMessage("✅ Mahsulot muvaffaqiyatli saqlandi!");
      setErrorMessage("");
      void queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void productsQuery.refetch();
    },
    onError: (error) => {
      setErrorMessage(formatApiError(error, "Mahsulotni saqlab bo'lmadi."));
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!form) {
      return;
    }
    if (!form.name.trim()) {
      setErrorMessage("Mahsulot nomi majburiy.");
      return;
    }
    if (!form.category || !form.unit) {
      setErrorMessage("Kategoriya va birlik majburiy. Avval seed_demo_data ishga tushiring.");
      return;
    }
    saveProduct.mutate(form);
  }

  if (productsQuery.isLoading) {
    return (
      <LoadingState
        label="Mahsulotlar"
        description="Faol katalog yozuvlari yuklanmoqda."
      />
    );
  }

  if (productsQuery.isError) {
    return (
      <ErrorState
        title="Mahsulotlarni yuklab bo'lmadi"
        error={productsQuery.error}
        onRetry={() => void productsQuery.refetch()}
      />
    );
  }

  return (
    <div className="grid gap-5">
      <SectionHeader
        title="Mahsulotlar"
        description="Sotiladigan katalogni yaratish va yuritish."
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              aria-label="Mahsulotlarni qidirish"
              placeholder="Mahsulotlarni qidirish"
              className="h-11 rounded-xl border border-red-100/50 px-3.5 font-semibold shadow-soft"
            />
            <IconButton
              type="button"
              icon={<PackagePlus aria-hidden="true" className="h-4 w-4" />}
              label="Yangi mahsulot"
              tone="primary"
              onClick={() => {
                if (productSetupLoading) {
                  setErrorMessage("Mahsulot sozlama ro'yxatlari hali yuklanmoqda. Birozdan keyin urinib ko'ring.");
                  return;
                }
                if (productSetupUnavailable) {
                  setErrorMessage("Mahsulot sozlama ro'yxatlarini yuklab bo'lmadi. Backend ishlaganda qayta urinib ko'ring.");
                  return;
                }
                if (categories.length === 0 || units.length === 0) {
                  setErrorMessage("Mahsulot qo'shishdan oldin kamida bitta kategoriya va birlik yarating yoki seed qiling.");
                  return;
                }
                // category va unit bir marta, forma ochilganda o'rnatiladi — useEffect emas
                setForm({
                  ...emptyForm,
                  category: categories[0]?.id ?? "",
                  unit: units[0]?.id ?? "",
                });
                setErrorMessage("");
                setSuccessMessage("");
              }}
            />
          </div>
        }
      />
      <StatCard
        title="Yuklangan mahsulotlar"
        value={String(productsQuery.data?.count ?? products.length)}
        icon={PackageSearch}
        tone="red"
      />
      {form ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-red-100/40 bg-white p-5 shadow-soft"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-black text-slate-950">
              {form.id ? "Mahsulotni tahrirlash" : "Mahsulot yaratish"}
            </h2>
            <IconButton
              type="button"
              icon={<X aria-hidden="true" className="h-4 w-4" />}
              label="Bekor qilish"
              onClick={() => setForm(null)}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-1 text-sm font-bold text-slate-700">
              Nomi *
              <input
                ref={nameInputRef}
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Mahsulot nomini kiriting"
                className="h-11 rounded-xl border border-red-100/50 px-3.5 shadow-soft"
              />
            </label>

            <label className="grid gap-1 text-sm font-bold text-slate-700">
              Birlik
              <select
                value={form.unit}
                onChange={(event) => setForm({ ...form, unit: event.target.value })}
                className="h-11 rounded-xl border border-red-100/50 bg-white px-3.5 shadow-soft"
              >
                <option value="">Birlik tanlang</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.short_name})
                  </option>
                ))}
              </select>
              {(() => {
                const selUnit = units.find((u) => u.id === form.unit);
                if (!selUnit) return null;
                const sn = selUnit.short_name.toLowerCase();
                const isWeight = ["kg", "g", "gr", "tonna", "t"].includes(sn);
                const isVolume = ["l", "litr", "ml", "liters"].includes(sn);
                const label = isWeight ? "Og'irligi" : isVolume ? "Hajmi" : "Miqdori";
                return (
                  <span className="text-xs font-semibold text-slate-500">
                    {label} ({selUnit.short_name})
                  </span>
                );
              })()}
            </label>
            {(() => {
              const selUnit = units.find((u) => u.id === form.unit);
              if (!selUnit) return null;
              const sn = selUnit.short_name.toLowerCase();
              const isWeight = ["kg", "g", "gr", "tonna", "t"].includes(sn);
              const isVolume = ["l", "litr", "ml", "liters"].includes(sn);
              const fieldLabel = isWeight ? "Og'irligi" : isVolume ? "Hajmi" : "Miqdori";
              const unitStr = selUnit.short_name.toUpperCase();
              const presets = isVolume
                ? ["0.5", "0.9", "1.0", "1.5", "2.0"]
                : isWeight
                ? ["0.5", "1.0", "1.5", "2.0", "3.0", "5.0", "10.0"]
                : ["1", "2", "3", "5", "10", "20", "50", "100"];
              return (
                <>
                  <label className="grid gap-1 text-sm font-bold text-slate-700">
                    {fieldLabel} ({selUnit.short_name})
                    <select
                      value={form.volume_preset}
                      onChange={(event) => setForm({ ...form, volume_preset: event.target.value })}
                      className="h-11 rounded-xl border border-red-100/50 bg-white px-3.5 shadow-soft"
                    >
                      <option value="">Tanlamaslik</option>
                      {presets.map((p) => (
                        <option key={p} value={p}>{p} {unitStr}</option>
                      ))}
                      <option value="Boshqa...">Boshqa...</option>
                    </select>
                    <span className="text-xs font-semibold text-slate-500">
                      {fieldLabel} ({selUnit.short_name})
                    </span>
                  </label>
                  {form.volume_preset === "Boshqa..." && (
                    <label className="grid gap-1 text-sm font-bold text-slate-700">
                      BOSHQA {fieldLabel.toUpperCase()} ({selUnit.short_name.toUpperCase()}) *
                      <input
                        value={form.volume_custom}
                        onChange={(event) => setForm({ ...form, volume_custom: event.target.value })}
                        placeholder={`0.33 ${unitStr}`}
                        className="h-11 rounded-xl border border-red-100/50 px-3.5 shadow-soft"
                      />
                    </label>
                  )}
                </>
              );
            })()}

            <label className="grid gap-1 text-sm font-bold text-slate-700">
              Barcode
              <input
                value={form.barcode}
                onChange={(event) => setForm({ ...form, barcode: event.target.value })}
                className="h-11 rounded-xl border border-red-100/50 px-3.5 shadow-soft"
              />
            </label>

            <label className="grid gap-1 text-sm font-bold text-slate-700">
              Kirim narxi
              <input
                value={form.cost_price}
                onChange={(event) =>
                  setForm({ ...form, cost_price: event.target.value })
                }
                onBlur={() =>
                  setForm({ ...form, cost_price: formatPrice(form.cost_price) })
                }
                inputMode="decimal"
                className="h-11 rounded-xl border border-red-100/50 px-3.5 shadow-soft"
              />
            </label>
            <label className="grid gap-1 text-sm font-bold text-slate-700">
              Sotuv narxi
              <input
                value={form.selling_price}
                onChange={(event) =>
                  setForm({ ...form, selling_price: event.target.value })
                }
                onBlur={() =>
                  setForm({ ...form, selling_price: formatPrice(form.selling_price) })
                }
                inputMode="decimal"
                className="h-11 rounded-xl border border-red-100/50 px-3.5 shadow-soft"
              />
            </label>
            <label className="flex items-center gap-2 self-end text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm({ ...form, is_active: event.target.checked })
                }
                className="h-5 w-5"
              />
              Faol
            </label>
          </div>
            {errorMessage ? (
            <div className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-900">
              {errorMessage}
            </div>
          ) : null}
          <IconButton
            type="submit"
            icon={<Save aria-hidden="true" className="h-4 w-4" />}
            label={saveProduct.isPending ? "Mahsulot saqlanmoqda" : "Mahsulotni saqlash"}
            tone="success"
            disabled={saveProduct.isPending}
            className="mt-3"
          />
        </form>
      ) : null}
      {/* Muvaffaqiyat xabari */}
      {successMessage ? (
        <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm font-bold text-green-900">
          {successMessage}
        </div>
      ) : errorMessage && !form ? (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-900">
          {errorMessage}
        </div>
      ) : null}
      <DataTable
        title="Mahsulotlar ro'yxati"
        rows={products}
        rowKey={(row) => row.id}
        emptyTitle={debouncedSearch ? "Mos mahsulot topilmadi" : "Mahsulot topilmadi"}
        emptyDescription={
          debouncedSearch
            ? "Boshqa nom, SKU, barcode yoki kategoriya bilan urinib ko'ring."
            : "Katalogda yaratilgan mahsulotlar shu yerda chiqadi."
        }
        columns={[
          { key: "name", header: "Nomi", render: (row) => row.name },

          {
            key: "price",
            header: "Narx",
            align: "right",
            render: (row) => formatMoney(row.selling_price),
          },
          {
            key: "status",
            header: "Holat",
            render: (row) => (row.is_active ? "Faol" : "Faol emas"),
          },
          {
            key: "actions",
            header: "Amallar",
            align: "right",
            render: (row) => (
              <IconButton
                type="button"
                icon={<Edit3 aria-hidden="true" className="h-4 w-4" />}
                label="Mahsulotni tahrirlash"
                hideLabel
                onClick={() => {
                  setForm(formFromProduct(row));
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
