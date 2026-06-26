"use client";

type DateFilterProps = {
  dateFrom: string;
  dateTo: string;
  onChange: (value: { dateFrom: string; dateTo: string }) => void;
};

export function DateFilter({ dateFrom, dateTo, onChange }: DateFilterProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-cyan-100/40 bg-[#131b2e] p-3 shadow-lg shadow-black/20 sm:flex-row sm:items-end">
      <label className="block">
        <span className="mb-1 block text-xs font-black uppercase text-slate-400">
          Dan
        </span>
        <input
          type="date"
          value={dateFrom}
          onChange={(event) =>
            onChange({ dateFrom: event.target.value, dateTo })
          }
          className="h-10 rounded-lg border border-cyan-200/50 px-3 font-semibold text-slate-300 transition-all duration-200 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-lg shadow-cyan-500/10 outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-black uppercase text-slate-400">
          Gacha
        </span>
        <input
          type="date"
          value={dateTo}
          onChange={(event) =>
            onChange({ dateFrom, dateTo: event.target.value })
          }
          className="h-10 rounded-lg border border-cyan-200/50 px-3 font-semibold text-slate-300 transition-all duration-200 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-lg shadow-cyan-500/10 outline-none"
        />
      </label>
    </div>
  );
}
