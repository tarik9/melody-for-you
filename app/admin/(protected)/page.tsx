"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import StatCard from "@/components/admin/StatCard";
import RevenueChart from "@/components/admin/RevenueChart";
import TopStylesBars from "@/components/admin/TopStylesBars";
import DateRangeTabs from "@/components/admin/DateRangeTabs";
import { rangeToQuery, DateRangeValue } from "@/lib/adminRanges";
import type { AdminStats } from "@/lib/adminData";

interface DashboardStats extends AdminStats {
  uniqueVisitors: number;
  liveNow: number;
  visitorsTracked: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRangeValue>({});

  useEffect(() => {
    setLoading(true);
    adminFetch(`/api/admin/stats${rangeToQuery(range)}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <DateRangeTabs onChange={setRange} />
      </div>
      <p className="text-gray-400 text-sm mb-6">Overview of orders, revenue, and leads.</p>

      {loading || !stats ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <StatCard label="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
            <StatCard label="Orders" value={String(stats.totalOrders)} />
            <StatCard
              label="Email Captures"
              value={String(stats.emailCaptures)}
              hint={`${stats.conversionRate.toFixed(1)}% conv. rate`}
            />
            <StatCard
              label="Unique Visitors"
              value={stats.visitorsTracked ? String(stats.uniqueVisitors) : "—"}
              hint={stats.visitorsTracked ? `${stats.liveNow} live now` : "tracking not configured"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Lead Conversion"
              value={`${stats.conversionRate.toFixed(1)}%`}
              hint="visitors → order"
            />
            <StatCard label="Leads (Abandoned Checkout)" value={String(stats.totalLeads)} />
            <StatCard label="Refunded" value={String(stats.totalRefunded)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Revenue — Last 14 Days</h2>
              <RevenueChart data={stats.revenueByDay} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Styles</h2>
              <TopStylesBars data={stats.topStyles} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
