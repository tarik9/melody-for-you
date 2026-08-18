import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { isRedisConfigured } from "@/lib/redis";
import { getLiveCount, listRecentSessions } from "@/lib/tracking";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isRedisConfigured()) {
    return NextResponse.json({ configured: false, sessions: [], liveCount: 0 });
  }

  const since = req.nextUrl.searchParams.get("since") || undefined;
  const until = req.nextUrl.searchParams.get("until") || undefined;

  const [sessions, liveCount] = await Promise.all([listRecentSessions(), getLiveCount()]);

  const filtered = sessions.filter((s) => {
    if (since && s.time < since) return false;
    if (until && s.time > until) return false;
    return true;
  });

  return NextResponse.json({ configured: true, sessions: filtered, liveCount });
}
