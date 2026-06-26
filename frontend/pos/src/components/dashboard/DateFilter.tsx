"use client";

type DateFilterProps = {
  dateFrom: string;
  dateTo: string;
  onChange: (value: { dateFrom: string; dateTo: string }) => void;
};

export function DateFilter({ dateFrom, dateTo, onChange }: DateFilterProps) {
  return (
    <div className="flex flex-col gap-2 rounded border border-indigo-100/50 bg-white p-3 shadow-soft sm:flex-row sm:items-end">
      <label className="block">
        <span className="mb-1 block text-xs font-black uppercase text-slate-500">
          Dan
        </span>
        <input
          type="date"
          value={dateFrom}
          onChange={(event) =>
            onChange({ dateFrom: event.target.value, dateTo })
          }
          className="h-10 rounded border border-indigo-200/60 px-3 font-semibold text-slate-700"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-black uppercase text-slate-500">
          Gacha
        </span>
        <input
          type="date"
          value={dateTo}
          onChange={(event) =>
            onChange({ dateFrom, dateTo: event.target.value })
          }
          className="h-10 rounded border border-indigo-200/60 px-3 font-semibold text-slate-700"
        />
      </label>
    </div>
  );
}
