import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  tone?: "indigo" | "green" | "amber" | "rose" | "slate";
};

const toneClasses = {
  indigo: "from-indigo-50 to-indigo-100/30 border-indigo-200/50",
  green: "from-emerald-50 to-emerald-100/30 border-emerald-200/50",
  amber: "from-amber-50 to-amber-100/30 border-amber-200/50",
  rose: "from-rose-50 to-rose-100/30 border-rose-200/50",
  slate: "from-slate-50 to-slate-100/30 border-indigo-100/50",
};

const iconBgClasses = {
  indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/15",
  green: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/15",
  amber: "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/15",
  rose: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/15",
  slate: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/15",
};

const valueClasses = {
  indigo: "text-indigo-900",
  green: "text-emerald-900",
  amber: "text-amber-900",
  rose: "text-rose-900",
  slate: "text-slate-900",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "slate",
}: StatCardProps) {
  return (
    <section 
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated ${toneClasses[tone]}`}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            {title}
          </p>
          <p className={`mt-1.5 break-words text-2xl font-black tracking-tight xl:text-3xl ${valueClasses[tone]}`}>
            {value}
          </p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBgClasses[tone]}`}>
          <Icon aria-hidden="true" className="h-5.5 w-5.5" />
        </div>
      </div>
      {description ? (
        <p className="relative z-10 mt-3 text-xs font-semibold text-slate-400">
          {description}
        </p>
      ) : null}
      <div className="absolute -bottom-5 -right-5 opacity-[0.04] z-0">
         <Icon className="h-28 w-28" />
      </div>
    </section>
  );
}
