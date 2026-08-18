import { NextRequest, NextResponse } from "next/server";
import { recordPageview, heartbeat } from "@/lib/tracking";
import { isRedisConfigured } from "@/lib/redis";

export async function POST(req: NextRequest) {
  if (!isRedisConfigured()) {
    // Tracking store not provisioned yet — no-op so the client never errors.
    return NextResponse.json({ ok: false });
  }

  const body = await req.json().catch(() => null);
  if (!body?.sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  try {
    if (body.type === "heartbeat") {
      await heartbeat(body.sessionId);
      return NextResponse.json({ ok: true });
    }

    const country = req.headers.get("x-vercel-ip-country") || "";

    await recordPageview({
      sessionId: body.sessionId,
      path: body.path || "/",
      referrer: body.referrer,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
      country,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Pageview tracking failed:", err);
    return NextResponse.json({ ok: false });
  }
}
