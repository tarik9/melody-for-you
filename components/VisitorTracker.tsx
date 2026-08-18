"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SESSION_KEY = "mfy_vid";
const UTM_KEY = "mfy_utm";
const HEARTBEAT_MS = 25_000;

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getStoredUtm(): Record<string, string> {
  const raw = sessionStorage.getItem(UTM_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function track(payload: Record<string, unknown>) {
  fetch("/api/track/pageview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

function VisitorTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const sessionId = getOrCreateSessionId();

    let utm = getStoredUtm();
    const hasUtm = ["utm_source", "utm_medium", "utm_campaign"].some((k) => searchParams?.get(k));
    if (hasUtm) {
      utm = {
        utm_source: searchParams?.get("utm_source") || "",
        utm_medium: searchParams?.get("utm_medium") || "",
        utm_campaign: searchParams?.get("utm_campaign") || "",
      };
      sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
    }

    track({
      sessionId,
      path: pathname,
      referrer: document.referrer,
      utmSource: utm.utm_source,
      utmMedium: utm.utm_medium,
      utmCampaign: utm.utm_campaign,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const sessionId = getOrCreateSessionId();
    const interval = setInterval(() => {
      track({ sessionId, type: "heartbeat" });
    }, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}

export default function VisitorTracker() {
  return (
    <Suspense fallback={null}>
      <VisitorTrackerInner />
    </Suspense>
  );
}
