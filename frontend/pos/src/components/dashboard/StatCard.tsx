import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  tone?: "purple" | "fuchsia" | "amber" | "rose" | "slate";
};

const toneClasses = {
  purple: "from-purple-50/80 to-purple-100/20 border-purple-200/40",
  fuchsia: "from-fuchsia-50/80 to-fuchsia-100/20 border-fuchsia-200/40",
  amber: "from-amber-50/80 to-amber-100/20 border-amber-200/40",
  rose: "from-rose-50/80 to-rose-100/20 border-rose-200/40",
  slate: "from-slate-50/80 to-purple-50/20 border-purple-100/40",
};

const iconBgClasses = {
  purple: "bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/15 ring-1 ring-white/20",
  fuchsia: "bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/15 ring-1 ring-white/20",
  amber: "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/15 ring-1 ring-white/20",
  rose: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/15 ring-1 ring-white/20",
  slate: "bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/15 ring-1 ring-white/20",
};

const valueClasses = {
  purple: "text-purple-900",
  fuchsia: "text-fuchsia-900",
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
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated hover:border-opacity-60 ${toneClasses[tone]}`}
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
      <div className="absolute -bottom-5 -right-5 opacity-[0.03] z-0">
         <Icon className="h-28 w-28" />
      </div>
    </section>
  );
}
