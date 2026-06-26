import { BarChart3 } from "lucide-react";

type ChartPlaceholderProps = {
  title: string;
  description?: string;
  values?: number[];
};

export function ChartPlaceholder({
  title,
  description,
  values = [],
}: ChartPlaceholderProps) {
  const maxValue = Math.max(...values, 0);

  return (
    <section className="rounded-2xl border border-rose-100/40 bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-elevated">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs font-medium text-slate-400">{description}</p>
          ) : null}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/15 ring-1 ring-white/20">
          <BarChart3 aria-hidden="true" className="h-4.5 w-4.5" />
        </div>
      </div>
      {values.length > 0 && maxValue > 0 ? (
        <div className="flex h-48 items-end gap-2 rounded-xl border border-rose-100/40 bg-gradient-to-b from-rose-50/20 to-white p-4 shadow-inner">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-lg bg-gradient-to-t from-rose-500 to-rose-400 shadow-sm shadow-rose-500/10 transition-all duration-300 hover:from-rose-400 hover:to-rose-300 hover:shadow-md"
              style={{ height: `${Math.max(8, (value / maxValue) * 100)}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-rose-100/40 bg-gradient-to-b from-rose-50/20 to-white p-4 text-center">
          <div>
            <BarChart3 aria-hidden="true" className="mx-auto h-8 w-8 text-rose-300" />
            <div className="mt-3 text-sm font-bold text-slate-500">
              Diagramma ma'lumoti hali mavjud emas
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-400">
              Xulosa kartalari va jadvallar jonli API ma'lumotidan foydalanadi.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
