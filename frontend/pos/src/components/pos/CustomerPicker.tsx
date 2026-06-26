"use client";

import { UserRound, X } from "lucide-react";
import { useState } from "react";

import { useCustomerSearch } from "@/hooks/useCustomers";
import { Customer } from "@/services/api/types";

import { IconButton } from "./IconButton";

type CustomerPickerProps = {
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
};

export function CustomerPicker({
  selectedCustomer,
  onSelectCustomer,
}: CustomerPickerProps) {
  const [search, setSearch] = useState("");
  const customersQuery = useCustomerSearch(search);
  const customers = customersQuery.data?.results ?? [];

  return (
    <section className="border-b border-slate-200/80 bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-sm">
            <UserRound aria-hidden="true" className="h-3.5 w-3.5" />
          </div>
          Mijoz
        </div>
        {selectedCustomer ? (
          <IconButton
            icon={<X aria-hidden="true" className="h-3.5 w-3.5" />}
            label="Mijozsiz"
            onClick={() => onSelectCustomer(null)}
            className="min-h-8 px-2.5 py-1 text-[11px] rounded-lg"
          />
        ) : null}
      </div>
      {selectedCustomer ? (
        <div className="rounded-xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-emerald-50/30 p-3.5 shadow-sm">
          <div className="font-bold text-emerald-950 text-sm">
            {selectedCustomer.full_name}
          </div>
          <div className="text-xs font-semibold text-emerald-600 mt-0.5">
            {selectedCustomer.phone || "Telefon yo'q"}
          </div>
        </div>
      ) : (
        <>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Mijoz qidirish..."
            className="h-10 w-full rounded-xl border border-slate-200/80 bg-white px-3.5 text-sm font-semibold shadow-input transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
          />
          {customers.length > 0 ? (
            <div className="mt-2 max-h-36 overflow-y-auto rounded-xl border border-slate-200/80 bg-white shadow-sm divide-y divide-slate-100">
              {customers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => {
                    onSelectCustomer(customer);
                    setSearch("");
                  }}
                  className="block w-full px-3.5 py-2.5 text-left transition-colors hover:bg-blue-50/60 active:bg-blue-100/40"
                >
                  <span className="block text-sm font-bold text-slate-900">{customer.full_name}</span>
                  <span className="text-xs text-slate-400 font-medium">
                    {customer.phone || "—"}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
