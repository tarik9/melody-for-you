"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import OrdersTable from "@/components/admin/OrdersTable";
import type { AdminOrderRow } from "@/lib/adminData";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders</h1>
      <p className="text-gray-400 text-sm mb-6">
        {loading ? "Loading…" : `${orders.length} paid order${orders.length === 1 ? "" : "s"}`}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full" />
        </div>
      ) : (
        <OrdersTable rows={orders} showFilters />
      )}
    </div>
  );
}
