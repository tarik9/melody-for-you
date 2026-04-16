"use client";

import Script from "next/script";

const PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID || "a2_iulkq1rv6dlz";

export default function RedditPixel() {
  return (
    <Script
      id="reddit-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=${PIXEL_ID}";t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
          rdt('init','${PIXEL_ID}');
          rdt('track','PageVisit');
        `,
      }}
    />
  );
}

type Rdt = (...args: unknown[]) => void;

function getRdt(): Rdt | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { rdt?: Rdt }).rdt;
}

// Re-init with user identity for advanced matching, then fire the event.
// Reddit hashes the email automatically — pass it as plain text.
function initWithUser(email?: string) {
  const rdt = getRdt();
  if (!rdt) return;
  if (email) {
    rdt("init", PIXEL_ID, { email });
  }
}

export function trackRedditEvent(eventName: string, data?: Record<string, unknown>) {
  const rdt = getRdt();
  if (!rdt) return;
  if (data) {
    rdt("track", eventName, data);
  } else {
    rdt("track", eventName);
  }
}

// Lead: re-init with email, include a unique conversionId
export function trackRedditLead(email?: string) {
  initWithUser(email);
  const conversionId = `lead_${email || "anon"}_${Date.now()}`;
  trackRedditEvent("Lead", { conversionId });
}

// Purchase: re-init with email, use Stripe paymentIntentId as conversionId
export function trackRedditPurchase(
  value: number,
  currency = "USD",
  email?: string,
  conversionId?: string
) {
  initWithUser(email);
  trackRedditEvent("Purchase", {
    value,
    currency,
    conversionId: conversionId || `purchase_${Date.now()}`,
  });
}
