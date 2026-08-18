import { getRedis } from "@/lib/redis";

export interface PageviewEvent {
  sessionId: string;
  path: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  country?: string;
}

export interface VisitorSession {
  id: string;
  time: string; // ISO
  country: string;
  path: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

const SESSIONS_KEY = "visitor:sessions";
const LIVE_KEY = "visitor:live";
const MAX_SESSIONS = 3000;
const LIVE_WINDOW_MS = 60_000;

export async function recordPageview(event: PageviewEvent): Promise<void> {
  const redis = getRedis();
  const now = Date.now();

  const entry: VisitorSession = {
    id: event.sessionId,
    time: new Date(now).toISOString(),
    country: event.country || "",
    path: event.path,
    referrer: event.referrer || "",
    utmSource: event.utmSource || "",
    utmMedium: event.utmMedium || "",
    utmCampaign: event.utmCampaign || "",
  };

  await Promise.all([
    redis.lpush(SESSIONS_KEY, entry),
    redis.ltrim(SESSIONS_KEY, 0, MAX_SESSIONS - 1),
    redis.zadd(LIVE_KEY, { score: now, member: event.sessionId }),
    redis.zremrangebyscore(LIVE_KEY, 0, now - LIVE_WINDOW_MS),
  ]);
}

export async function heartbeat(sessionId: string): Promise<void> {
  const redis = getRedis();
  const now = Date.now();
  await Promise.all([
    redis.zadd(LIVE_KEY, { score: now, member: sessionId }),
    redis.zremrangebyscore(LIVE_KEY, 0, now - LIVE_WINDOW_MS),
  ]);
}

export async function getLiveCount(): Promise<number> {
  const redis = getRedis();
  const now = Date.now();
  await redis.zremrangebyscore(LIVE_KEY, 0, now - LIVE_WINDOW_MS);
  return redis.zcard(LIVE_KEY);
}

function parseSession(raw: unknown): VisitorSession | null {
  if (!raw) return null;
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (obj && typeof obj === "object" && "id" in obj) return obj as VisitorSession;
    return null;
  } catch {
    return null;
  }
}

export async function listRecentSessions(limit = 1000): Promise<VisitorSession[]> {
  const redis = getRedis();
  const raw = await redis.lrange(SESSIONS_KEY, 0, limit - 1);
  return raw.map(parseSession).filter((s): s is VisitorSession => s !== null);
}
