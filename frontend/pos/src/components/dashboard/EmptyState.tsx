import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100/40 text-cyan-400 shadow-lg shadow-black/20 ring-1 ring-cyan-100/30">
        <Inbox aria-hidden="true" className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-bold text-slate-600">{title}</p>
      {description ? (
        <p className="mt-1 text-xs font-semibold text-slate-500 max-w-sm">{description}</p>
      ) : null}
    </div>
  );
}
