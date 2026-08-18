"use client";

import { useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

interface LiveEvent {
  id: string;
  type: "order" | "lead";
  email: string;
  amount: number;
  currency: string;
  occasion?: string;
  recipientName?: string;
  date: string;
}

const POLL_MS = 10_000;

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminLivePage() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [, forceTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function load() {
      const res = await adminFetch("/api/admin/live");
      const data = await res.json();
      setEvents(data.events || []);
      setLoading(false);
    }

    load();
    intervalRef.current = setInterval(load, POLL_MS);
    const tickInterval = setInterval(() => forceTick((n) => n + 1), 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(tickInterval);
    };
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Live Activity</h1>
        <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-6">Recent orders and abandoned checkouts, updated every 10s.</p>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center bg-white rounded-2xl border border-gray-100">
          No recent activity.
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {events.map((e) => (
            <div key={e.id} className="flex items-center gap-4 px-5 py-4">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  e.type === "order" ? "bg-green-500" : "bg-amber-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{e.email || "Unknown"}</span>{" "}
                  {e.type === "order" ? (
                    <>
                      purchased a song
                      {e.occasion ? ` for ${e.occasion}` : ""}
                      {e.recipientName ? ` (${e.recipientName})` : ""}
                    </>
                  ) : (
                    <>started checkout but didn&apos;t complete payment</>
                  )}
                </p>
              </div>
              {e.type === "order" && (
                <span className="text-sm font-medium text-gray-900 shrink-0">
                  ${e.amount.toFixed(2)}
                </span>
              )}
              <span className="text-xs text-gray-400 shrink-0 w-16 text-right">
                {timeAgo(e.date)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
