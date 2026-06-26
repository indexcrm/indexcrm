import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/40 text-amber-400 shadow-soft ring-1 ring-amber-100/30">
        <Inbox aria-hidden="true" className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-bold text-slate-600">{title}</p>
      {description ? (
        <p className="mt-1 text-xs font-semibold text-slate-400 max-w-sm">{description}</p>
      ) : null}
    </div>
  );
}
