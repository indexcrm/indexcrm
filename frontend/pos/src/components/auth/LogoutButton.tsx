"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/authStore";

type LogoutButtonProps = {
  className?: string;
  label?: string;
  variant?: "light" | "dark";
};

export function LogoutButton({
  className = "",
  label = "Chiqish",
  variant = "light",
}: LogoutButtonProps) {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);

  function handleLogout() {
    signOut();
    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold tracking-wide transition-all active:scale-95 ${
        variant === "dark"
          ? "border-slate-600 bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
          : "border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-300 shadow-sm"
      } ${className}`}
    >
      <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}
