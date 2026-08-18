import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { getStats } from "@/lib/adminData";
import { isRedisConfigured } from "@/lib/redis";
import { getLiveCount, listRecentSessions } from "@/lib/tracking";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = req.nextUrl.searchParams.get("since") || undefined;
  const until = req.nextUrl.searchParams.get("until") || undefined;

  const stats = await getStats({ since, until });

  let uniqueVisitors = 0;
  let liveNow = 0;

  if (isRedisConfigured()) {
    const [sessions, live] = await Promise.all([listRecentSessions(), getLiveCount()]);
    const filtered = sessions.filter((s) => {
      if (since && s.time < since) return false;
      if (until && s.time > until) return false;
      return true;
    });
    uniqueVisitors = new Set(filtered.map((s) => s.id)).size;
    liveNow = live;
  }

  return NextResponse.json({ ...stats, uniqueVisitors, liveNow, visitorsTracked: isRedisConfigured() });
}
