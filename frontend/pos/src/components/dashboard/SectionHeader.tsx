import { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function SectionHeader({ title, description, actions }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-100">
          {title}
        </h1>
        <p className="mt-0.5 text-sm font-semibold text-slate-500">{description}</p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
