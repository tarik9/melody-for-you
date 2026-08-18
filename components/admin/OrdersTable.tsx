"use client";

import { Fragment, useMemo, useState } from "react";
import type { AdminOrderRow } from "@/lib/adminData";
import StatusBadge from "./StatusBadge";
import { downloadCsv } from "@/lib/exportCsv";

export default function OrdersTable({
  rows,
  showFilters = false,
}: {
  rows: AdminOrderRow[];
  showFilters?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [occasionFilter, setOccasionFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const occasions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.occasion).filter(Boolean))) as string[],
    [rows]
  );

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (occasionFilter && r.occasion !== occasionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.email.toLowerCase().includes(q) || (r.recipientName || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rows, search, occasionFilter]);

  function handleExport() {
    downloadCsv(
      "orders.csv",
      ["Email", "Amount", "Currency", "Status", "Source", "Occasion", "Recipient", "Date"],
      filtered.map((r) => [
        r.email,
        r.amount.toFixed(2),
        r.currency,
        r.refunded ? "refunded" : r.status,
        r.source,
        r.occasion || "",
        r.recipientName || "",
        new Date(r.date).toLocaleString(),
      ])
    );
  }

  return (
    <div>
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email or name…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          />
          <select
            value={occasionFilter}
            onChange={(e) => setOccasionFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          >
            <option value="">All occasions</option>
            {occasions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Export CSV
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-400 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-gray-900">{r.email || "—"}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      ${r.amount.toFixed(2)} {r.currency}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.refunded ? "refunded" : r.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.source}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(r.date).toLocaleString()}
                    </td>
                  </tr>
                  {expanded === r.id && (
                    <tr className="bg-[#F8F7FF]">
                      <td colSpan={5} className="px-4 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                          <Detail label="Recipient" value={r.recipientName} />
                          <Detail label="Relationship" value={r.relationship} />
                          <Detail label="Occasion" value={r.occasion} />
                          <Detail label="Style" value={r.style} />
                          <Detail label="Vocal" value={r.vocalPreference} />
                          <Detail label="Payment ID" value={r.id} mono />
                          {r.story && (
                            <div className="col-span-2 sm:col-span-3">
                              <p className="text-gray-400 text-xs mb-1">Story</p>
                              <p className="text-gray-700 whitespace-pre-wrap">{r.story}</p>
                            </div>
                          )}
                          {r.specificLyrics && (
                            <div className="col-span-2 sm:col-span-3">
                              <p className="text-gray-400 text-xs mb-1">Specific Lyrics</p>
                              <p className="text-gray-700 whitespace-pre-wrap">{r.specificLyrics}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">No results.</p>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-gray-400 text-xs mb-0.5">{label}</p>
      <p className={`text-gray-700 ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}
