"use client";

import {
  AlertTriangle,
  CircleDollarSign,
  CreditCard,
  Clock3,
  Landmark,
  ReceiptText,
  TrendingUp,
  UsersRound,
  Sparkles,
} from "lucide-react";

import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { DataTable } from "@/components/dashboard/DataTable";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  useCashierActivityDashboard,
  useDashboardSummary,
} from "@/hooks/useDashboardData";
import { pickNumber, pickText, todayIsoDate } from "@/lib/dashboard";
import { formatMoney } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";

const welcomeMessages: Record<string, string> = {
  owner: "Xush kelibsiz, Ega",
  admin: "Xush kelibsiz, Admin",
  manager: "Xush kelibsiz, Menejer",
  cashier: "Xush kelibsiz, Kassir",
};

export function DashboardOverview() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role ?? "";
  const userName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || "";
  const welcomeText = welcomeMessages[role] || "Xush kelibsiz";

  const summaryQuery = useDashboardSummary();
  const today = todayIsoDate();
  const cashierQuery = useCashierActivityDashboard(today, today);

  if (summaryQuery.isLoading) {
    return (
      <LoadingState
        label="Boshqaruv paneli"
        description="Savdo, qoldiq, moliya va kassir holati yuklanmoqda."
      />
    );
  }

  if (summaryQuery.isError) {
    return (
      <ErrorState
        title="Boshqaruv panelini yuklab bo'lmadi"
        error={summaryQuery.error}
        onRetry={() => void summaryQuery.refetch()}
      />
    );
  }

  const summary = summaryQuery.data;
  const todaySales = summary?.today_sales ?? summary?.sales ?? {};
  const debt = summary?.total_debt ?? {};
  const bestSelling = summary?.best_selling_products ?? [];
  const recentSales = summary?.recent_sales ?? [];
  const cashboxes = summary?.cashbox_summary ?? [];
  const todayRevenue = pickNumber(todaySales, [
    "revenue",
    "net_sales",
    "gross_sales",
    "total_amount",
  ]);
  const todayCount = pickNumber(todaySales, [
    "sales_count",
    "sale_count",
    "total_sales",
    "orders_count",
  ]);
  const cashboxTotal = cashboxes.reduce(
    (sum, row) => sum + pickNumber(row, ["current_balance", "balance"]),
    0,
  );
  const bestSellingValues = bestSelling
    .slice(0, 8)
    .map((row) => pickNumber(row, ["total_amount", "sold_amount", "quantity"]));
  const todayShifts = cashierQuery.data?.shifts.results ?? [];
  const openShiftCount = todayShifts.filter((shift) => !shift.closed_at).length;
  const cashierSignal = cashierQuery.isLoading
    ? "Yuklanmoqda"
    : cashierQuery.isError
      ? "Mavjud emas"
      : String(openShiftCount);

  return (
    <div className="grid gap-5">
      <div className="rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-white to-cyan-50/30 p-5 shadow-lg shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/15">
            <Sparkles aria-hidden="true" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-100">{welcomeText}</h1>
            <p className="mt-0.5 text-sm font-semibold text-slate-500">{userName || "Boshqaruv paneli"}</p>
          </div>
        </div>
      </div>
      <SectionHeader
        title="Boshqaruv paneli"
        description="Bugungi savdo, kassa, qoldiq va qarzlar bo'yicha qisqa holat."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Bugungi savdo"
          value={formatMoney(todayRevenue)}
          description={`${todayCount} yakunlangan chek`}
          icon={ReceiptText}
          tone="cyan"
        />
        <StatCard
          title="Buyurtmalar"
          value={String(todayCount)}
          description="Bugun yakunlangan savdolar"
          icon={ReceiptText}
        />
        <StatCard
          title="Bugungi foyda"
          value={formatMoney(pickNumber(summary?.today_profit, ["profit"]))}
          description="Qaytarish, kirim va xarajatlardan keyin"
          icon={TrendingUp}
          tone="emerald"
        />
        <StatCard
          title="Kam qoldiq"
          value={String(summary?.low_stock_count ?? 0)}
          description="Limitdan past mahsulotlar"
          icon={AlertTriangle}
          tone="rose"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Xarajatlar"
          value={formatMoney(summary?.total_expenses ?? 0)}
          description="Joriy hisobot oralig'i"
          icon={CreditCard}
          tone="amber"
        />
        <StatCard
          title="Mijoz qarzi"
          value={formatMoney(pickNumber(debt, ["customer_debt"]))}
          icon={UsersRound}
        />
        <StatCard
          title="Yetkazuvchi qarzi"
          value={formatMoney(pickNumber(debt, ["supplier_debt"]))}
          icon={CircleDollarSign}
        />
        <StatCard
          title="Kassa balansi"
          value={formatMoney(cashboxTotal)}
          description={`${cashboxes.length} kassa yozuvi`}
          icon={Landmark}
          tone="emerald"
        />
        <StatCard
          title="Ochiq smenalar"
          value={cashierSignal}
          description="Bugungi kassir faolligi"
          icon={Clock3}
          tone="amber"
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <ChartPlaceholder
          title="Eng ko'p sotilganlar faolligi"
          description="Eng ko'p sotilgan mahsulotlar bo'yicha tezkor ko'rinish."
          values={bestSellingValues}
        />
        <DataTable
          title="Kassa xulosasi"
          rows={cashboxes}
          rowKey={(row, index) =>
            pickText(row, ["cashbox", "cashbox_id", "cashbox_name", "name"]) ||
            index
          }
          emptyTitle="Kassa topilmadi"
          emptyDescription="Moliya ma'lumotlari bo'lsa kassa xulosasi shu yerda chiqadi."
          columns={[
            {
              key: "name",
              header: "Kassa",
              render: (row) =>
                pickText(row, ["cashbox_name", "name", "branch_name"]),
            },
            {
              key: "balance",
              header: "Balans",
              align: "right",
              render: (row) =>
                formatMoney(pickNumber(row, ["current_balance", "balance"])),
            },
          ]}
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <DataTable
          title="Eng ko'p sotilgan mahsulotlar"
          rows={bestSelling}
          rowKey={(row, index) =>
            pickText(row, ["product", "product_id", "product__id", "product_name"]) ||
            index
          }
          emptyTitle="Hali eng ko'p sotilgan mahsulot yo'q"
          emptyDescription="Yakunlangan savdolar bu ro'yxatni to'ldiradi."
          columns={[
            {
              key: "product",
              header: "Mahsulot",
              render: (row) => pickText(row, ["product__name", "product_name"]),
            },
            {
              key: "qty",
              header: "Miqdor",
              align: "right",
              render: (row) => pickText(row, ["sold_quantity", "quantity"]),
            },
            {
              key: "amount",
              header: "Summa",
              align: "right",
              render: (row) =>
                formatMoney(pickNumber(row, ["total_amount", "sold_amount"])),
            },
          ]}
        />
        <DataTable
          title="So'nggi savdolar"
          rows={recentSales}
          rowKey={(row, index) =>
            pickText(row, ["id", "sale_id", "receipt_number"]) || index
          }
          emptyTitle="So'nggi savdolar yo'q"
          emptyDescription="POSda yakunlangan savdolar shu yerda chiqadi."
          columns={[
            {
              key: "receipt",
              header: "Chek",
              render: (row) => pickText(row, ["receipt_number"]),
            },
            {
              key: "cashier",
              header: "Kassir",
              render: (row) => pickText(row, ["cashier", "cashier_email"]),
            },
            {
              key: "total",
              header: "Jami",
              align: "right",
              render: (row) => formatMoney(pickNumber(row, ["total_amount"])),
            },
          ]}
        />
      </div>
    </div>
  );
}
