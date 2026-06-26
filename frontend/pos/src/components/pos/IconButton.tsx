"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  hideLabel?: boolean;
  tone?: "neutral" | "primary" | "danger" | "success" | "warning";
};

const tones = {
  neutral: "border-slate-300 bg-white text-slate-900 hover:bg-slate-100",
  primary: "border-blue-700 bg-blue-700 text-white hover:bg-blue-800",
  danger: "border-rose-700 bg-rose-700 text-white hover:bg-rose-800",
  success: "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800",
  warning: "border-amber-400 bg-amber-300 text-amber-950 hover:bg-amber-400",
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
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded border px-3 py-2 text-sm font-bold shadow-panel transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
    >
      {icon}
      <span className={hideLabel ? "sr-only" : undefined}>{label}</span>
    </button>
  );
}
