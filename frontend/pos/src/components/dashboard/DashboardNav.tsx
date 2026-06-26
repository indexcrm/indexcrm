"use client";

import {
  BarChart3,
  Boxes,
  Bot,
  CircleDollarSign,
  CloudOff,
  Lock,
  LayoutDashboard,
  PackageSearch,
  ReceiptText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UsersRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
  {
    href: "/dashboard",
    label: "Umumiy",
    icon: LayoutDashboard,
    roles: ["owner", "admin", "manager"],
  },
  {
    href: "/dashboard/sales",
    label: "Savdolar",
    icon: ShoppingCart,
    roles: ["owner", "admin", "manager"],
  },
  {
    href: "/dashboard/products",
    label: "Mahsulotlar",
    icon: PackageSearch,
    roles: ["owner", "admin", "manager"],
  },
  {
    href: "/dashboard/inventory",
    label: "Ombor",
    icon: Boxes,
    roles: ["owner", "admin", "manager"],
  },
  {
    href: "/dashboard/customers",
    label: "Mijozlar",
    icon: UsersRound,
    roles: ["owner", "admin", "manager"],
  },
  {
    href: "/dashboard/suppliers",
    label: "Yetkazib beruvchilar",
    icon: Truck,
    roles: ["owner", "admin", "manager"],
  },
  {
    href: "/dashboard/finance",
    label: "Moliya",
    icon: CircleDollarSign,
    roles: ["owner", "admin"],
  },
  {
    href: "/dashboard/reports",
    label: "Hisobotlar",
    icon: BarChart3,
    roles: ["owner", "admin", "manager"],
  },
  {
    href: "/dashboard/cashier-activity",
    label: "Kassirlar",
    icon: ReceiptText,
    roles: ["owner", "admin", "manager"],
  },

  {
    href: "/dashboard/settings",
    label: "Sozlamalar",
    icon: Settings,
    roles: ["owner", "admin", "manager", "cashier"],
  },
];

type DashboardNavProps = {
  children: ReactNode;
};

function isActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function canUseNavItem(role: string | undefined, item: (typeof navItems)[number]) {
  return Boolean(role && item.roles.includes(role));
}

export function DashboardNav({ children }: DashboardNavProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const visibleNavItems = navItems.filter((item) => canUseNavItem(role, item));
  const currentNavItem = navItems
    .slice()
    .sort((first, second) => second.href.length - first.href.length)
    .find((item) => isActive(pathname, item.href));
  const hasAccess = currentNavItem ? canUseNavItem(role, currentNavItem) : true;
  const roleLabels: Record<string, string> = {
    owner: "Egasi",
    admin: "Admin",
    manager: "Menejer",
    cashier: "Kassir",
  };
  const roleLabel = role ? roleLabels[role] ?? role : "-";
  const pageLabel = currentNavItem?.label ?? "Boshqaruv paneli";

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/[0.04] bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0f172a] text-white lg:block shadow-2xl shadow-black/10 z-20">
        <div className="flex h-14 items-center gap-3 border-b border-white/[0.04] px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white text-sm font-black shadow-lg shadow-cyan-500/20 ring-1 ring-white/10">
            I
          </div>
          <div>
            <div className="text-sm font-black tracking-tight">
              <span className="text-white">INDEX</span>{" "}
              <span className="text-cyan-400 font-light">{roleLabel === "Egasi" ? "Ega" : roleLabel}</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {roleLabel} ko'rinishi
            </div>
          </div>
        </div>
        <nav className="grid gap-0.5 p-3">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`group flex h-10 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 text-white shadow-lg shadow-cyan-500/15"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                }`}
              >
                <Icon aria-hidden="true" className={`h-4.5 w-4.5 transition-all duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>{active ? <span className="font-bold">{item.label}</span> : item.label}</span>
                {active ? (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/60 shadow-sm shadow-white/20" />
                ) : null}
              </a>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/30" />
            INDEX POS v0.1.0
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-cyan-500/10 bg-[#0f172a]/80 px-4 shadow-lg shadow-black/20 backdrop-blur-xl lg:px-6">
          <div className="min-w-0 flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white text-[10px] font-black shadow-sm lg:hidden">
              I
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-slate-100">{pageLabel}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {roleLabel} boshqaruv paneli
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/15 bg-[#131b2e] px-3.5 py-2 text-xs font-bold text-cyan-600 shadow-sm transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-200 hover:shadow-md active:scale-95"
            >
              POS ochish
            </a>
            <LogoutButton />
          </div>
        </header>
        <nav className="flex gap-1.5 overflow-x-auto border-b border-cyan-500/10 bg-[#0f172a]/60 px-3 py-2 lg:hidden backdrop-blur-sm">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-bold transition-all ${
                  active
                    ? "border-cyan-200 bg-cyan-50 text-cyan-700 shadow-sm"
                    : "border-slate-700/30 bg-[#131b2e] text-slate-400 hover:bg-slate-800/50"
                }`}
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <main className="pb-8">
          {hasAccess ? (
            children
          ) : (
            <div className="p-4 lg:p-6">
              <section className="rounded-2xl border border-cyan-500/10 bg-[#131b2e] shadow-lg shadow-black/20 overflow-hidden">
                <EmptyState
                  title="Bu bo'lim mavjud emas"
                  description="Joriy rolingiz bu boshqaruv sahifasiga kirish huquqiga ega emas."
                />
                <div className="flex justify-center border-t border-cyan-500/10 p-4">
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/15 bg-[#131b2e] px-4 py-2.5 text-sm font-bold text-cyan-600 shadow-sm transition-all duration-200 hover:bg-cyan-50 hover:shadow-md active:scale-95"
                  >
                    <Lock aria-hidden="true" className="h-4 w-4" />
                    POS ochish
                  </a>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
