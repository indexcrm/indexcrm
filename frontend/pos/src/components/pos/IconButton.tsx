"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  hideLabel?: boolean;
  tone?: "neutral" | "primary" | "danger" | "success" | "warning";
};

const tones = {
  neutral: "border-cyan-500/10 bg-[#131b2e] text-slate-300 hover:bg-cyan-50 hover:border-cyan-200 shadow-lg shadow-black/20",
  primary: "border-cyan-600 bg-cyan-600 text-white hover:bg-cyan-700 hover:shadow-md shadow-lg shadow-black/20",
  danger: "border-rose-600 bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md shadow-lg shadow-black/20",
  success: "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md shadow-lg shadow-black/20",
  warning: "border-amber-300 bg-amber-200 text-amber-950 hover:bg-amber-300 hover:shadow-md shadow-lg shadow-black/20",
};

export function IconButton({
  icon,
  label,
  hideLabel = false,
  tone = "neutral",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-bold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
    >
      {icon}
      <span className={hideLabel ? "sr-only" : undefined}>{label}</span>
    </button>
  );
}
