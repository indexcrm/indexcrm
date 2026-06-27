import { ReactNode } from "react";

import { EmptyState } from "./EmptyState";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
};

type DataTableProps<T> = {
  title?: string;
  rows: T[];
  columns: Array<DataTableColumn<T>>;
  rowKey?: (row: T, rowIndex: number) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
};

const alignClasses = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function DataTable<T>({
  title,
  rows,
  columns,
  rowKey,
  emptyTitle = "Ma'lumot yo'q",
  emptyDescription,
}: DataTableProps<T>) {
  return (
    <section className="rounded-2xl border border-blue-100/40 bg-white shadow-soft transition-all duration-300 hover:shadow-elevated">
      {title ? (
        <div className="border-b border-blue-100/40 px-5 py-4">
          <h2 className="text-base font-bold tracking-tight text-slate-900">{title}</h2>
        </div>
      ) : null}
      {rows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-blue-100/40 bg-gradient-to-r from-blue-50/40 to-blue-50/20 text-[10px] uppercase tracking-wider text-slate-400">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 font-bold ${alignClasses[column.align ?? "left"]}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100/20">
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                  className="transition-colors duration-150 hover:bg-blue-50/30"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3.5 text-sm font-semibold text-slate-700 ${alignClasses[column.align ?? "left"]}`}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
