"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import StatCard from "@/components/admin/StatCard";
import RevenueChart from "@/components/admin/RevenueChart";
import TopStylesBars from "@/components/admin/TopStylesBars";
import type { AdminStats } from "@/lib/adminData";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-6">Overview of orders, revenue, and leads.</p>

      {loading || !stats ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Orders" value={String(stats.totalOrders)} />
            <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
            <StatCard label="Leads (Abandoned Checkout)" value={String(stats.totalLeads)} />
            <StatCard
              label="Conversion Rate"
              value={`${stats.conversionRate.toFixed(1)}%`}
              hint="Orders / (Orders + Leads)"
            />
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
