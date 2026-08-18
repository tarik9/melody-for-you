"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import DateRangeTabs from "@/components/admin/DateRangeTabs";
import { rangeToQuery, DateRangeValue } from "@/lib/adminRanges";

interface VisitorSession {
  id: string;
  time: string;
  country: string;
  path: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export default function AdminVisitorsPage() {
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<DateRangeValue>({});

  function load() {
    adminFetch(`/api/admin/visitors${rangeToQuery(range)}`)
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions || []);
        setConfigured(data.configured !== false);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const filtered = useMemo(() => {
    if (!search) return sessions;
    const q = search.toLowerCase();
    return sessions.filter(
      (s) =>
        s.country.toLowerCase().includes(q) ||
        s.referrer.toLowerCase().includes(q) ||
        s.utmSource.toLowerCase().includes(q) ||
        s.utmCampaign.toLowerCase().includes(q)
    );
  }, [sessions, search]);

  if (!loading && !configured) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Visitors</h1>
        <p className="text-gray-400 text-sm mb-6">Session log with country, referrer, and UTM data.</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-500 text-sm">
            Visitor tracking isn&apos;t configured yet — add <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">KV_REST_API_URL</code> and{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">KV_REST_API_TOKEN</code> (Vercel KV / Upstash) to your environment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Visitors</h1>
        <DateRangeTabs onChange={setRange} defaultKey="7d" />
      </div>
      <p className="text-gray-400 text-sm mb-6">Session log — country, referrer, and UTM attribution.</p>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country, referrer, UTM…"
              className="flex-1 max-w-sm px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{filtered.length} sessions</span>
              <button
                onClick={() => {
                  setLoading(true);
                  load();
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-400 text-xs uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium">Page</th>
                    <th className="px-4 py-3 font-medium">Referrer</th>
                    <th className="px-4 py-3 font-medium">UTM Source</th>
                    <th className="px-4 py-3 font-medium">UTM Campaign</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={`${s.id}-${i}`} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(s.time).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-900">{s.country || "—"}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.path}</td>
                      <td className="px-4 py-3 text-gray-500">{s.referrer || "—"}</td>
                      <td className="px-4 py-3 text-gray-500">{s.utmSource || "—"}</td>
                      <td className="px-4 py-3 text-gray-500">{s.utmCampaign || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-10">No sessions in this range.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
