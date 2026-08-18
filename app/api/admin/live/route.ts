import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { listLiveEvents } from "@/lib/adminData";
import { isRedisConfigured } from "@/lib/redis";
import { getLiveCount } from "@/lib/tracking";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await listLiveEvents();
  const liveNow = isRedisConfigured() ? await getLiveCount() : 0;

  return NextResponse.json({ events, liveNow, visitorsTracked: isRedisConfigured() });
}
