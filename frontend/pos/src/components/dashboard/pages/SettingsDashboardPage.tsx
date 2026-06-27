"use client";

import { useState, FormEvent } from "react";
import { Save, Lock, Mail, Eye, EyeOff, ShieldCheck, User } from "lucide-react";

import { ErrorState } from "@/components/dashboard/ErrorState";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { useProfileDashboard } from "@/hooks/useDashboardData";
import { apiRequest } from "@/services/api/client";
import { useAuthStore } from "@/stores/authStore";

export function SettingsDashboardPage() {
  const profileQuery = useProfileDashboard();
  const user = useAuthStore((state) => state.user);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (profileQuery.isLoading) {
    return (
      <LoadingState
        label="Profil sozlamalari"
        description="Akkaunt ma'lumotlari yuklanmoqda."
      />
    );
  }

  if (profileQuery.isError) {
    return (
      <ErrorState
        title="Profil sozlamalarini yuklab bo'lmadi"
        error={profileQuery.error}
        onRetry={() => void profileQuery.refetch()}
      />
    );
  }

  const profileUser = profileQuery.data;
  const roleLabels: Record<string, string> = {
    owner: "Egasi",
    admin: "Admin",
    manager: "Menejer",
    cashier: "Kassir",
  };
  const roleLabel = profileUser?.role ? roleLabels[profileUser.role] ?? profileUser.role : "-";

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage("");
    setSaveError("");

    if (newPassword && newPassword !== confirmPassword) {
      setSaveError("Yangi parol va tasdiqlash paroli bir xil bo'lishi kerak.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setSaveError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    setIsSaving(true);
    try {
      const body: Record<string, string> = {};
      if (email && email !== profileUser?.email) {
        body.email = email;
      }
      if (newPassword) {
        body.password = newPassword;
      }

      if (Object.keys(body).length === 0) {
        setSaveError("Hech narsa o'zgartirilmadi.");
        setIsSaving(false);
        return;
      }

      await apiRequest("/accounts/me/", { method: "PATCH", body: JSON.stringify(body) });
      setSaveMessage("Sozlamalar muvaffaqiyatli saqlandi!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setSaveError(error?.message || "Saqlashda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sahifa Sarlavhasi */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
          Shaxsiy Sozlamalar
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Profilingiz ma'lumotlari va xavfsizlik sozlamalarini boshqaring.
        </p>
      </div>

      {/* Profil Ma'lumotlari Kartalari */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-inner">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Joriy Email</p>
              <p className="mt-1 text-lg font-black text-slate-800">{profileUser?.email || user?.email || "-"}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20" />
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 shadow-inner">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Kimligi (Rol)</p>
              <p className="mt-1 text-lg font-black text-slate-800 uppercase tracking-wide">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email va Parol O'zgartirish */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-xl shadow-slate-200/40">
          {/* Email bo'limi */}
          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Email o'zgartirish</h2>
                <p className="text-sm font-medium text-slate-500">Tizimga kirish uchun yangi email kiriting</p>
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="settings-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Yangi email
              </label>
              <input
                id="settings-email"
                type="email"
                value={email || profileUser?.email || ""}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yangi@email.com"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
              />
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* Parol bo'limi */}
          <div className="bg-slate-50/50 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Parolni o'zgartirish</h2>
                <p className="text-sm font-medium text-slate-500">Xavfsiz va eslab qolish oson bo'lgan parol tanlang</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="relative">
                <label htmlFor="settings-new-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Yangi parol
                </label>
                <div className="relative">
                  <input
                    id="settings-new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-4 pr-12 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showNewPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="settings-confirm-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Parolni tasdiqlang
                </label>
                <div className="relative">
                  <input
                    id="settings-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-4 pr-12 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Xabarlar */}
        {saveMessage && (
          <div className="animate-in slide-in-from-bottom-2 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            {saveMessage}
          </div>
        )}
        {saveError && (
          <div className="animate-in slide-in-from-bottom-2 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-800 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            </div>
            {saveError}
          </div>
        )}

        {/* Saqlash tugmasi */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
          >
            {isSaving ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:scale-110" />
            )}
            <span>{isSaving ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}</span>
            {/* Tugma ichidagi yaltiroq effekt */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />
          </button>
        </div>
      </form>
    </div>
  );
}
