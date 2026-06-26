"use client";

import { Loader2, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo } from "react";

import { useAuthStore } from "@/stores/authStore";

type AuthGateProps = {
  children: ReactNode;
};

function getLandingPath(role?: string | null) {
  if (role === "owner" || role === "admin") {
    return "/dashboard";
  }
  return "/";
}

export function AuthGate({ children }: AuthGateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, user, initializeAuth } = useAuthStore();

  const isLoginPage = pathname === "/login";
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAuthReady = status === "authenticated" || status === "unauthenticated";

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  const redirectPath = useMemo(
    () => getLandingPath(user?.role ?? null),
    [user?.role],
  );

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (isLoginPage && status === "authenticated") {
      router.replace(redirectPath);
      return;
    }

    if (!isLoginPage && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [isAuthReady, isLoginPage, redirectPath, router, status]);

  if (!isAuthReady) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-slate-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-80 w-80 animate-float rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-72 w-72 animate-float rounded-full bg-amber-500/8 blur-3xl" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-xl shadow-amber-500/20 ring-1 ring-white/10">
            <Sparkles aria-hidden="true" className="h-6 w-6 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-400 tracking-wide">
            {isDashboardPage ? "Boshqaruv paneli ochilmoqda" : "Sessiya tekshirilmoqda"}
          </span>
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 animate-pulse-soft rounded-full bg-amber-400" />
            <div className="h-1 w-1 animate-pulse-soft rounded-full bg-amber-400" style={{ animationDelay: "0.3s" }} />
            <div className="h-1 w-1 animate-pulse-soft rounded-full bg-amber-400" style={{ animationDelay: "0.6s" }} />
          </div>
        </div>
      </div>
    );
  }

  if (isLoginPage && status === "authenticated") {
    return null;
  }

  if (!isLoginPage && status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
