"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import DateRangeTabs from "@/components/admin/DateRangeTabs";
import StatCard from "@/components/admin/StatCard";
import { rangeToQuery, DateRangeValue } from "@/lib/adminRanges";
import { downloadCsv } from "@/lib/exportCsv";
import { countryName } from "@/lib/countryName";

interface EmailRow {
  email: string;
  country?: string;
  status: "customer" | "lead";
  date: string;
}

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<DateRangeValue>({});

  useEffect(() => {
    setLoading(true);
    adminFetch(`/api/admin/emails${rangeToQuery(range)}`)
      .then((res) => res.json())
      .then((data) => setEmails(data.emails || []))
      .finally(() => setLoading(false));
  }, [range]);

  const filtered = useMemo(() => {
    if (!search) return emails;
    const q = search.toLowerCase();
    return emails.filter((e) => e.email.toLowerCase().includes(q));
  }, [emails, search]);

  const customers = emails.filter((e) => e.status === "customer").length;

  function handleExport() {
    downloadCsv(
      "emails.csv",
      ["Email", "Country", "Status", "Date"],
      filtered.map((e) => [e.email, countryName(e.country), e.status, new Date(e.date).toLocaleString()])
    );
  }

  function handleCopyAll() {
    navigator.clipboard.writeText(filtered.map((e) => e.email).join(", "));
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Emails</h1>
        <DateRangeTabs onChange={setRange} />
      </div>
      <p className="text-gray-400 text-sm mb-6">Every email captured through the funnel — leads and customers.</p>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard label="Captured" value={String(emails.length)} />
            <StatCard label="Customers" value={String(customers)} />
            <StatCard label="Showing (Filtered)" value={String(filtered.length)} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email…"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
            <button
              onClick={handleCopyAll}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Copy All
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#5B21B6] text-white text-sm font-semibold transition-colors"
            >
              Export CSV
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-400 text-xs uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.email} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{e.email}</td>
                      <td className="px-4 py-3 text-gray-500">{countryName(e.country)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            e.status === "customer" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(e.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-10">No results.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
