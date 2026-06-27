type LoadingStateProps = {
  label?: string;
  description?: string;
};

export function LoadingState({
  label = "Yuklanmoqda",
  description = "Boshqaruv paneli ma'lumotlari tayyorlanmoqda.",
}: LoadingStateProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-red-100/40 bg-white p-5 shadow-soft">
      <div>
        <div className="text-sm font-black tracking-wide text-slate-500">{label}</div>
        <div className="mt-1 text-sm font-semibold text-slate-400">
          {description}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl bg-gradient-to-br from-red-50/60 to-red-100/20 ring-1 ring-red-100/30"
          />
        ))}
      </div>
    </div>
  );
}
