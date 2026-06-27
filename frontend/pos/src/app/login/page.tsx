"use client";

import { Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { getCurrentUser } from "@/services/api/accounts";
import { loginWithCredentials } from "@/services/api/auth";
import {
  ApiError,
  clearStoredAuthToken,
  setStoredAuthToken,
} from "@/services/api/client";
import { useAuthStore } from "@/stores/authStore";

function getLandingPath(role?: string | null) {
  if (role === "owner" || role === "admin") {
    return "/dashboard";
  }
  return "/";
}

function formatError(error: unknown) {
  if (error instanceof ApiError) {
    if (typeof error.detail === "string") {
      return error.detail;
    }
    if (
      error.detail &&
      typeof error.detail === "object" &&
      "detail" in error.detail &&
      typeof (error.detail as { detail?: unknown }).detail === "string"
    ) {
      return (error.detail as { detail: string }).detail;
    }
    return "Kirish amalga oshmadi. Email va parolni tekshiring.";
  }
  if (
    error instanceof TypeError ||
    (error instanceof Error &&
      ["Failed to fetch", "fetch failed"].includes(error.message))
  ) {
    return [
      "Backend API bilan aloqa yo'q.",
      "Django ishlayotganini va NEXT_PUBLIC_API_BASE_URL to'g'ri ekanini tekshiring.",
    ].join(" ");
  }
  return "Kirish amalga oshmadi. Ma'lumotlarni tekshirib, qayta urinib ko'ring.";
}

export default function LoginPage() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordToggleLabel = showPassword ? "Parolni yashirish" : "Parolni ko'rsatish";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const tokens = await loginWithCredentials({
        email,
        password,
      });
      setStoredAuthToken(tokens.access);
      const user = await getCurrentUser();
      signIn({ token: tokens.access, user });
      router.replace(getLandingPath(user.role));
    } catch (submissionError) {
      clearStoredAuthToken();
      setError(formatError(submissionError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-slate-900 px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 animate-float rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 animate-float rounded-full bg-purple-500/8 blur-3xl" style={{ animationDelay: "1.5s" }} />
        <div className="absolute left-1/3 top-1/4 h-64 w-64 animate-float rounded-full bg-purple-500/5 blur-3xl" style={{ animationDelay: "0.8s" }} />
      </div>
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl font-black shadow-xl shadow-purple-500/25 ring-1 ring-white/10">
            <Sparkles aria-hidden="true" className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            INDEX <span className="bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent font-light">POS</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-400">
            Davom etish uchun tizimga kiring
          </p>
        </div>
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.04] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-1.5" htmlFor="login-email">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Login yoki Email
              </span>
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white placeholder-slate-500 shadow-inner shadow-black/5 transition-all duration-300 focus:border-purple-500/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-purple-500/20 focus:shadow-glow outline-none"
                placeholder="tillomahmudjonov"
                autoComplete="username"
                required
              />
            </label>

            <div className="grid gap-1.5">
              <label
                className="text-[11px] font-bold uppercase tracking-wider text-slate-400"
                htmlFor="login-password"
              >
                Parol
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 pr-12 text-sm font-semibold text-white placeholder-slate-500 shadow-inner shadow-black/5 transition-all duration-300 focus:border-purple-500/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-purple-500/20 focus:shadow-glow outline-none"
                  placeholder="Parolni kiriting"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  aria-label={passwordToggleLabel}
                  aria-pressed={showPassword}
                  title={passwordToggleLabel}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 shadow-sm backdrop-blur-sm">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20">
                  <ShieldCheck aria-hidden="true" className="h-3 w-3" />
                </div>
                <span>{error}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:from-purple-400 hover:to-purple-500 hover:shadow-purple-500/30 hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none outline-none focus:ring-2 focus:ring-purple-500/40"
            >
              {loading ? (
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : null}
              <span>{loading ? "Kirilmoqda..." : "Kirish"}</span>
            </button>
          </form>
          <div className="mt-6 border-t border-white/[0.06] pt-5 text-center">
            <p className="text-[11px] font-medium text-slate-500">
              Demo: admin@example.com / Admin12345
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
