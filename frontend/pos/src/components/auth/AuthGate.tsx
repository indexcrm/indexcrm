"use client";

import { Loader2 } from "lucide-react";
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-[#111827] to-slate-900">
        <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25">
            <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin text-white" />
          </div>
          <span className="text-sm font-bold text-slate-400 tracking-wide">
            {isDashboardPage ? "Boshqaruv paneli ochilmoqda" : "Sessiya tekshirilmoqda"}
          </span>
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
