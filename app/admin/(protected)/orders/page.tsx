"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import OrdersTable from "@/components/admin/OrdersTable";
import StatCard from "@/components/admin/StatCard";
import DateRangeTabs from "@/components/admin/DateRangeTabs";
import { rangeToQuery, DateRangeValue } from "@/lib/adminRanges";
import type { AdminOrderRow } from "@/lib/adminData";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRangeValue>({});

  useEffect(() => {
    setLoading(true);
    adminFetch(`/api/admin/orders${rangeToQuery(range)}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, [range]);

  const { totalRevenue, completed, refunded } = useMemo(() => {
    const refundedOrders = orders.filter((o) => o.refunded);
    return {
      totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0),
      completed: orders.length - refundedOrders.length,
      refunded: refundedOrders.length,
    };
  }, [orders]);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <DateRangeTabs onChange={setRange} />
      </div>
      <p className="text-gray-400 text-sm mb-6">
        {loading ? "Loading…" : `${orders.length} paid order${orders.length === 1 ? "" : "s"}`}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            <StatCard label="Completed" value={String(completed)} />
            <StatCard label="Refunded" value={String(refunded)} />
          </div>
          <OrdersTable rows={orders} showFilters />
        </>
      )}
    </div>
  );
}
