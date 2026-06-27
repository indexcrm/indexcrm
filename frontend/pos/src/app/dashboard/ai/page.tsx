import { EmptyState } from "@/components/dashboard/EmptyState";

export default function DashboardAIPage() {
  return (
    <div className="p-4 lg:p-6">
      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden h-96 flex items-center justify-center">
        <EmptyState
          title="Tez orada ishga tushadi!"
          description="Hali ishlamaydi, yaqinda ishlaydi"
        />
      </section>
    </div>
  );
}
