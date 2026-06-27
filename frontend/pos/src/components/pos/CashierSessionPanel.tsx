"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Save,
  UnlockKeyhole,
  UserCog,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import {
  useActiveCashierShift,
  useCloseCashierShift,
  useOpenCashierShift,
} from "@/hooks/useCashierShifts";
import { useBranches, useCashDesks, useWarehouses } from "@/hooks/useLocations";
import { ApiError } from "@/services/api/client";
import { useAuthStore } from "@/stores/authStore";
import { useCashierStore } from "@/stores/cashierStore";

import { IconButton } from "./IconButton";

export function CashierSessionPanel() {
  const session = useCashierStore();
  const { status, user } = useAuthStore();
  const [cashierName, setCashierName] = useState(session.cashierName);
  const [cashierEmail, setCashierEmail] = useState(session.cashierEmail);
  const [branchId, setBranchId] = useState(session.branchId);
  const [warehouseId, setWarehouseId] = useState(session.warehouseId);
  const [cashDeskId, setCashDeskId] = useState(session.cashDeskId);
  const [activeShiftId, setActiveShiftId] = useState(session.activeShiftId);
  const [authToken, setAuthToken] = useState(session.authToken);
  const [openingBalance, setOpeningBalance] = useState("0.00");
  const [closingBalance, setClosingBalance] = useState("0.00");
  const [shiftNotice, setShiftNotice] = useState("");
  const activeShift = useActiveCashierShift(branchId);
  const openShift = useOpenCashierShift();
  const closeShift = useCloseCashierShift();
  const branchesQuery = useBranches();
  const warehousesQuery = useWarehouses(branchId);
  const cashDesksQuery = useCashDesks(branchId);
  const branches = branchesQuery.data?.results ?? [];
  const warehouses = warehousesQuery.data?.results ?? [];
  const cashDesks = cashDesksQuery.data?.results ?? [];
  const selectedBranch = branches.find((branch) => branch.id === branchId);
  const selectedWarehouse = warehouses.find(
    (warehouse) => warehouse.id === warehouseId,
  );
  const selectedCashDesk = cashDesks.find(
    (cashDesk) => cashDesk.id === cashDeskId,
  );

  useEffect(() => {
    setCashierName(session.cashierName);
    setCashierEmail(session.cashierEmail);
    setBranchId(session.branchId);
    setWarehouseId(session.warehouseId);
    setCashDeskId(session.cashDeskId);
    setActiveShiftId(session.activeShiftId);
    setAuthToken(session.authToken);
  }, [
    session.activeShiftId,
    session.authToken,
    session.branchId,
    session.cashDeskId,
    session.cashierEmail,
    session.cashierName,
    session.warehouseId,
  ]);

  useEffect(() => {
    if (activeShift.data?.id && activeShift.data.id !== activeShiftId) {
      setActiveShiftId(activeShift.data.id);
      session.setActiveShiftId(activeShift.data.id);
      return;
    }

    if (activeShift.isSuccess && activeShift.data === null && activeShiftId) {
      setActiveShiftId("");
      session.setActiveShiftId("");
    }
  }, [activeShift.data, activeShift.isSuccess, activeShiftId, session]);

  useEffect(() => {
    if (!branchesQuery.isSuccess || branches.length === 0) {
      return;
    }

    const selectedBranchExists = branches.some((branch) => branch.id === branchId);
    if (selectedBranchExists) {
      return;
    }

    const profileBranchId = user?.profile?.branch ?? "";
    const nextBranch =
      branches.find((branch) => branch.id === profileBranchId) ?? branches[0];

    setBranchId(nextBranch.id);
    setWarehouseId("");
    setCashDeskId("");
    setActiveShiftId("");
    session.setSession({
      cashierName,
      cashierEmail,
      branchId: nextBranch.id,
      warehouseId: "",
      cashDeskId: "",
      activeShiftId: "",
      authToken,
    });
  }, [
    authToken,
    branches,
    branchesQuery.isSuccess,
    branchId,
    cashierEmail,
    cashierName,
    session,
    user?.profile?.branch,
  ]);

  useEffect(() => {
    if (!branchId || !warehousesQuery.isSuccess) {
      return;
    }

    const selectedWarehouseExists = warehouses.some(
      (warehouse) => warehouse.id === warehouseId,
    );
    if (selectedWarehouseExists) {
      return;
    }

    if (warehouses.length === 0) {
      if (warehouseId) {
        setWarehouseId("");
        session.setSession({
          cashierName,
          cashierEmail,
          branchId,
          warehouseId: "",
          cashDeskId,
          activeShiftId,
          authToken,
        });
      }
      return;
    }

    const nextWarehouse = warehouses[0];
    setWarehouseId(nextWarehouse.id);
    session.setSession({
      cashierName,
      cashierEmail,
      branchId,
      warehouseId: nextWarehouse.id,
      cashDeskId,
      activeShiftId,
      authToken,
    });
  }, [
    activeShiftId,
    authToken,
    branchId,
    cashDeskId,
    cashierEmail,
    cashierName,
    session,
    warehouseId,
    warehouses,
    warehousesQuery.isSuccess,
  ]);

  useEffect(() => {
    if (!branchId || !cashDesksQuery.isSuccess) {
      return;
    }

    const selectedCashDeskExists = cashDesks.some(
      (cashDesk) => cashDesk.id === cashDeskId,
    );
    if (selectedCashDeskExists) {
      return;
    }

    if (cashDesks.length === 0) {
      if (cashDeskId) {
        setCashDeskId("");
        session.setSession({
          cashierName,
          cashierEmail,
          branchId,
          warehouseId,
          cashDeskId: "",
          activeShiftId,
          authToken,
        });
      }
      return;
    }

    const nextCashDesk = cashDesks[0];
    setCashDeskId(nextCashDesk.id);
    session.setSession({
      cashierName,
      cashierEmail,
      branchId,
      warehouseId,
      cashDeskId: nextCashDesk.id,
      activeShiftId,
      authToken,
    });
  }, [
    activeShiftId,
    authToken,
    branchId,
    cashDeskId,
    cashDesks,
    cashDesksQuery.isSuccess,
    cashierEmail,
    cashierName,
    session,
    warehouseId,
  ]);

  useEffect(() => {
    if (activeShift.data?.expected_balance) {
      setClosingBalance(activeShift.data.expected_balance);
    }
  }, [activeShift.data?.expected_balance]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    session.setSession({
      cashierName,
      cashierEmail,
      branchId,
      warehouseId,
      cashDeskId,
      activeShiftId,
      authToken,
    });
  }

  function persistSession(nextActiveShiftId = activeShiftId) {
    session.setSession({
      cashierName,
      cashierEmail,
      branchId,
      warehouseId,
      cashDeskId,
      activeShiftId: nextActiveShiftId,
      authToken,
    });
  }

  function handleBranchChange(nextBranchId: string) {
    setBranchId(nextBranchId);
    setWarehouseId("");
    setCashDeskId("");
    setActiveShiftId("");
    session.setSession({
      cashierName,
      cashierEmail,
      branchId: nextBranchId,
      warehouseId: "",
      cashDeskId: "",
      activeShiftId: "",
      authToken,
    });
    setShiftNotice(
      nextBranchId
        ? "Filial tanlandi. Omborni tanlang, keyin smenani oching yoki tanlang."
        : "Checkoutdan oldin filialni tanlang.",
    );
  }

  function handleWarehouseChange(nextWarehouseId: string) {
    setWarehouseId(nextWarehouseId);
    session.setSession({
      cashierName,
      cashierEmail,
      branchId,
      warehouseId: nextWarehouseId,
      cashDeskId,
      activeShiftId,
      authToken,
    });
    setShiftNotice(
      nextWarehouseId
        ? "Checkout qoldig'i uchun ombor tanlandi."
        : "Checkoutdan oldin omborni tanlang.",
    );
  }

  function handleCashDeskChange(nextCashDeskId: string) {
    setCashDeskId(nextCashDeskId);
    session.setSession({
      cashierName,
      cashierEmail,
      branchId,
      warehouseId,
      cashDeskId: nextCashDeskId,
      activeShiftId,
      authToken,
    });
    setShiftNotice(
      nextCashDeskId
        ? "Bu terminal uchun kassa tanlandi."
        : "Kassa tanlanmagan. Checkout davom etadi, lekin pilot sozlamasida kassa bo'lishi kerak.",
    );
  }

  function formatShiftError(error: unknown) {
    if (error instanceof ApiError) {
      const detail = error.detail as Record<string, unknown> | string;
      if (error.status === 401 || error.status === 403) {
        return "Bu akkaunt tanlangan filial uchun kassir smenasini boshqara olmaydi.";
      }
      if (error.status >= 500) {
        return "Server kassir smenasini yangilay olmadi. Bir marta qayta urinib ko'ring, davom etsa yordamga murojaat qiling.";
      }
      if (typeof detail === "string") {
        return detail;
      }
      if (detail && typeof detail === "object") {
        if (typeof detail.message === "string") {
          return detail.message;
        }
        if (typeof detail.detail === "string") {
          return detail.detail;
        }
        return "Kassir smenasi amali bajarilmadi. Filial huquqi va kassa summasini tekshirib, qayta urinib ko'ring.";
      }
      return "Kassir smenasi amali bajarilmadi. Filial huquqini tekshirib, qayta urinib ko'ring.";
    }
    return "Kassir smenasi amali bajarilmadi. Filial huquqini tekshirib, qayta urinib ko'ring.";
  }

  async function handleOpenShift() {
    if (!branchId) {
      setShiftNotice("Smena ochishdan oldin filial tanlanishi kerak.");
      return;
    }

    setShiftNotice("");
    try {
      const shift = await openShift.mutateAsync({
        branch: branchId,
        opening_balance: openingBalance || "0.00",
      });
      setActiveShiftId(shift.id);
      persistSession(shift.id);
      setShiftNotice(`${shift.branch_name || "tanlangan filial"} uchun smena ochildi.`);
    } catch (error) {
      setShiftNotice(formatShiftError(error));
    }
  }

  async function handleCloseShift() {
    if (!activeShiftId) {
      setShiftNotice("Faol smena tanlanmagan.");
      return;
    }

    setShiftNotice("");
    try {
      await closeShift.mutateAsync({
        shiftId: activeShiftId,
        closingBalance: closingBalance || "0.00",
      });
      setActiveShiftId("");
      session.setActiveShiftId("");
      setShiftNotice("Smena yopildi. Checkoutdan oldin yangi smena oching.");
    } catch (error) {
      setShiftNotice(formatShiftError(error));
    }
  }

  const configReady = Boolean(branchId && warehouseId);
  const sessionReady = Boolean(configReady && activeShiftId);
  const userName =
    user && ([user.first_name, user.last_name].filter(Boolean).join(" ") || user.email);
  const shiftLoading =
    status === "checking" || (Boolean(branchId) && activeShift.isFetching);
  const shiftActionPending = openShift.isPending || closeShift.isPending;
  const locationLoading =
    branchesQuery.isFetching ||
    (Boolean(branchId) && warehousesQuery.isFetching && warehouses.length === 0) ||
    (Boolean(branchId) && cashDesksQuery.isFetching && cashDesks.length === 0);
  let locationMessage = "";
  if (branchesQuery.isError) {
    locationMessage = "Filiallarni yuklab bo'lmadi. Checkoutdan oldin backend/API aloqasini tekshiring.";
  } else if (branchesQuery.isSuccess && branches.length === 0) {
    locationMessage = "Faol filial topilmadi. Avval seed_demo_data ishga tushiring yoki filial yarating.";
  } else if (branchId && warehousesQuery.isError) {
    locationMessage = "Bu filial uchun omborlarni yuklab bo'lmadi. Backend aloqasini tekshiring.";
  } else if (warehousesQuery.isSuccess && branchId && warehouses.length === 0) {
    locationMessage = "Bu filial uchun faol ombor topilmadi.";
  } else if (branchId && cashDesksQuery.isError) {
    locationMessage =
      "Kassalarni yuklab bo'lmadi. Checkout davom etadi, lekin admin POS kassa sozlamasini tekshirsin.";
  } else if (cashDesksQuery.isSuccess && branchId && cashDesks.length === 0) {
    locationMessage =
      "Bu filial uchun faol kassa topilmadi. Pilot kuzatuvi uchun admin kassa yaratsin.";
  }
  const missingSessionMessage = !branchId && !warehouseId
    ? "Filial va ombor tanlanmagan. Checkoutdan oldin Sessiyada tanlang."
    : !branchId
      ? "Filial tanlanmagan. Checkoutdan oldin Sessiyada filialni tanlang."
      : !warehouseId
        ? "Ombor tanlanmagan. Checkoutdan oldin Sessiyada omborni tanlang."
        : activeShift.isError
          ? "Faol kassir smenasini yuklab bo'lmadi. Bu filial uchun backend aloqasini tekshiring."
          : !activeShiftId
            ? "Faol kassir smenasi yo'q. Checkoutdan oldin Sessiyada smenani oching."
            : "";
  const setupGuidance = !branchId
    ? "Keyingi qadam: kassir filialini tanlang."
    : !warehouseId
      ? "Keyingi qadam: bu savdo uchun qoldiq beradigan omborni tanlang."
      : activeShift.isError
        ? "Keyingi qadam: backend aloqasini tekshiring, keyin smenani qayta aniqlang."
        : !activeShiftId
          ? "Keyingi qadam: kerak bo'lsa boshlang'ich naqdni kiriting, keyin Smenani ochish tugmasini bosing."
          : !cashDeskId
            ? "Kassa tanlanmagan. Checkout davom etadi, lekin pilot sozlamasida kassa bo'lishi kerak."
            : "";
  const readySessionMessage = `Tayyor: ${selectedBranch?.name ?? "tanlangan filial"} / ${
    selectedWarehouse?.name ?? "tanlangan ombor"
  } / ${selectedCashDesk?.code ?? selectedCashDesk?.name ?? "kassa"} / faol smena${userName ? ` - ${userName}` : ""}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="no-print border-b border-slate-200/80 bg-white p-4"
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-sm">
          <UserCog aria-hidden="true" className="h-3.5 w-3.5" />
        </div>
        Sessiya
      </div>
      <div
        className={`mb-3 flex min-h-10 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold shadow-sm transition-all ${
          shiftLoading
            ? "border-blue-200 bg-blue-50 text-blue-800"
            : sessionReady
              ? "border-yellow-200 bg-yellow-50 text-yellow-800"
              : "border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
          shiftLoading ? "bg-blue-200/60" :
          sessionReady ? "bg-yellow-200/60" : "bg-amber-200/60"
        }`}>
          {shiftLoading ? (
            <Loader2 aria-hidden="true" className="h-3 w-3 animate-spin" />
          ) : sessionReady ? (
            <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
          ) : (
            <AlertCircle aria-hidden="true" className="h-3 w-3" />
          )}
        </div>
        <span className="leading-snug">
          {status === "checking"
            ? "Kassir sessiyasi yuklanmoqda"
            : sessionReady
              ? readySessionMessage
              : missingSessionMessage}
        </span>
      </div>
      <div className="mb-4 flex flex-col gap-1.5 rounded-xl bg-gradient-to-b from-slate-50 to-white p-3.5 text-sm shadow-sm border border-slate-200/70">
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400 font-medium text-xs">Filial</span>
          <span className="font-bold text-slate-900 truncate pl-2 text-sm">{selectedBranch?.name ?? (branchId ? "Tanlangan filial" : "—")}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400 font-medium text-xs">Ombor</span>
          <span className="font-bold text-slate-900 truncate pl-2 text-sm">{selectedWarehouse?.name ?? (warehouseId ? "Tanlangan ombor" : "—")}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400 font-medium text-xs">Kassa</span>
          <span className="font-bold text-slate-900 truncate pl-2 text-sm">{selectedCashDesk ? `${selectedCashDesk.code} - ${selectedCashDesk.name}` : cashDeskId ? "Tanlangan" : "—"}</span>
        </div>
        <div className="flex justify-between items-center py-1 pt-2 mt-1 border-t border-slate-200/60">
          <span className="text-slate-400 font-medium text-xs">Smena</span>
          <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-wide ${activeShiftId ? "bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-200" : "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200"}`}>{activeShiftId ? "Ochiq" : "Yo'q"}</span>
        </div>
      </div>
      {setupGuidance && !shiftLoading ? (
        <div className="mb-4 rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-50/80 px-4 py-3 text-xs font-semibold text-amber-900 shadow-sm">
          <div className="flex items-start gap-2">
            <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{setupGuidance}</span>
          </div>
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <label className="block col-span-2 sm:col-span-1">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Kassir ismi
          </span>
          <input
            value={cashierName}
            onChange={(event) => setCashierName(event.target.value)}
            placeholder="Kassir"
            className="h-11 w-full rounded-lg border-0 bg-white px-4 font-semibold text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all"
          />
        </label>
        <label className="block col-span-2 sm:col-span-1">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Email
          </span>
          <input
            value={cashierEmail}
            onChange={(event) => setCashierEmail(event.target.value)}
            placeholder="Email"
            className="h-11 w-full rounded-lg border-0 bg-white px-4 font-semibold text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all"
          />
        </label>
        <label className="block col-span-2 sm:col-span-1">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Filial
          </span>
          <select
            value={branchId}
            onChange={(event) => handleBranchChange(event.target.value)}
            disabled={branchesQuery.isFetching && branches.length === 0}
            className="h-11 w-full rounded-lg border-0 bg-white px-4 font-semibold text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all appearance-none"
          >
            <option value="">
              {branchesQuery.isFetching && branches.length === 0
                ? "Yuklanmoqda..."
                : branches.length === 0
                  ? "Yo'q"
                  : "Tanlang"}
            </option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.store_name ? `${branch.store_name} - ${branch.name}` : branch.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block col-span-2 sm:col-span-1">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Ombor
          </span>
          <select
            value={warehouseId}
            onChange={(event) => handleWarehouseChange(event.target.value)}
            disabled={!branchId || warehousesQuery.isFetching && warehouses.length === 0}
            className="h-11 w-full rounded-lg border-0 bg-white px-4 font-semibold text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all appearance-none"
          >
            <option value="">
              {!branchId
                ? "Avval filial"
                : warehousesQuery.isFetching && warehouses.length === 0
                  ? "Yuklanmoqda..."
                  : warehouses.length === 0
                    ? "Yo'q"
                    : "Tanlang"}
            </option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block col-span-2">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Kassa
          </span>
          <select
            value={cashDeskId}
            onChange={(event) => handleCashDeskChange(event.target.value)}
            disabled={!branchId || cashDesksQuery.isFetching && cashDesks.length === 0}
            className="h-11 w-full rounded-lg border-0 bg-white px-4 font-semibold text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all appearance-none"
          >
            <option value="">
              {!branchId
                ? "Avval filial"
                : cashDesksQuery.isFetching && cashDesks.length === 0
                  ? "Yuklanmoqda..."
                  : cashDesks.length === 0
                    ? "Yo'q"
                    : "Tanlang"}
            </option>
            {cashDesks.map((cashDesk) => (
              <option key={cashDesk.id} value={cashDesk.id}>
                {cashDesk.code ? `${cashDesk.code} - ${cashDesk.name}` : cashDesk.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {locationLoading ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-50/50 px-4 py-3 text-xs font-semibold text-blue-800 shadow-sm">
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin shrink-0" />
          Filial ma'lumotlari yuklanmoqda...
        </div>
      ) : locationMessage ? (
        <div className="mt-3 rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-50/80 px-4 py-3 text-xs font-semibold text-amber-900 shadow-sm">
          <div className="flex items-start gap-2">
            <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{locationMessage}</span>
          </div>
        </div>
      ) : null}

      <IconButton
        type="submit"
        icon={<Save aria-hidden="true" className="h-4 w-4" />}
        label="Sessiyani saqlash"
        tone="primary"
        className="mt-4 w-full h-11 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20"
      />
      <div className="mt-4 grid grid-cols-2 gap-3 bg-gradient-to-b from-white to-slate-50/50 p-4 rounded-xl border border-slate-200/70 shadow-sm">
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Boshlang'ich
          </span>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold text-[11px]">
              UZS
            </span>
            <input
              value={openingBalance}
              onChange={(event) => setOpeningBalance(event.target.value)}
              inputMode="decimal"
              className="h-10 w-full rounded-xl border-0 bg-white pl-11 pr-3 font-bold text-slate-900 text-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all shadow-input"
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Yakuniy
          </span>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold text-[11px]">
              UZS
            </span>
            <input
              value={closingBalance}
              onChange={(event) => setClosingBalance(event.target.value)}
              inputMode="decimal"
              className="h-10 w-full rounded-xl border-0 bg-white pl-11 pr-3 font-bold text-slate-900 text-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all shadow-input"
            />
          </div>
        </label>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <IconButton
          type="button"
          icon={
            openShift.isPending ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <UnlockKeyhole aria-hidden="true" className="h-4 w-4" />
            )
          }
          label={openShift.isPending ? "Ochilmoqda..." : "Smenani ochish"}
          tone="success"
          onClick={handleOpenShift}
          disabled={!branchId || Boolean(activeShiftId) || shiftActionPending}
          className="h-11 rounded-xl shadow-sm"
        />
        <IconButton
          type="button"
          icon={
            closeShift.isPending ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <LockKeyhole aria-hidden="true" className="h-4 w-4" />
            )
          }
          label={closeShift.isPending ? "Yopilmoqda..." : "Smenani yopish"}
          tone="warning"
          onClick={handleCloseShift}
          disabled={!activeShiftId || shiftActionPending}
          className="h-11 rounded-xl shadow-sm"
        />
      </div>
      {shiftNotice ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 shadow-sm text-center animate-fade-in">
          {shiftNotice}
        </div>
      ) : null}
    </form>
  );
}
