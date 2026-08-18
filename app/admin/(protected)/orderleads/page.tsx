"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import OrdersTable from "@/components/admin/OrdersTable";
import StatCard from "@/components/admin/StatCard";
import DateRangeTabs from "@/components/admin/DateRangeTabs";
import { rangeToQuery, DateRangeValue } from "@/lib/adminRanges";
import type { AdminOrderRow } from "@/lib/adminData";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRangeValue>({});

  useEffect(() => {
    setLoading(true);
    adminFetch(`/api/admin/leads${rangeToQuery(range)}`)
      .then((res) => res.json())
      .then((data) => setLeads(data.leads || []))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <DateRangeTabs onChange={setRange} />
      </div>
      <p className="text-gray-400 text-sm mb-6">Reached checkout but didn&apos;t complete payment.</p>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <StatCard label="Leads in Range" value={String(leads.length)} />
            <StatCard
              label="Distinct Emails"
              value={String(new Set(leads.map((l) => l.email)).size)}
            />
          </div>
          <OrdersTable rows={leads} showFilters />
        </>
      )}
    </div>
  );
}
