"use client";

import Script from "next/script";
import { SONG_PRICE } from "@/lib/types";

const PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "D7HB6EJC77U8DEPHGQS0";

const PRODUCT = {
  content_ids: ["custom-song"],
  content_name: "Custom Song",
  content_type: "product",
  contents: [{ content_id: "custom-song", content_name: "Custom Song", quantity: 1, price: SONG_PRICE }],
};

export default function TikTokPixel() {
  return (
    <Script
      id="tiktok-pixel"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          !function(w,d,t){
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
            ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
            for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
            ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
            ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
              ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
              n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;
              e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)
            };
            ttq.load('${PIXEL_ID}');
            ttq.page();
          }(window,document,'ttq');
        `,
      }}
    />
  );
}

type Ttq = {
  track: (event: string, params?: Record<string, unknown>) => void;
  identify: (params: Record<string, unknown>) => void;
};

function getTtq(): Ttq | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ttq?: Ttq }).ttq;
}

export function trackTikTokEvent(event: string, params?: Record<string, unknown>) {
  getTtq()?.track(event, params);
}

export function identifyTikTokUser(email: string) {
  getTtq()?.identify({ email });
}

export function trackTikTokViewContent() {
  trackTikTokEvent("ViewContent", {
    ...PRODUCT,
    value: SONG_PRICE,
    currency: "USD",
  });
}

export function trackTikTokAddToCart() {
  trackTikTokEvent("AddToCart", {
    ...PRODUCT,
    value: SONG_PRICE,
    currency: "USD",
  });
}

export function trackTikTokInitiateCheckout(value: number, currency = "USD") {
  trackTikTokEvent("InitiateCheckout", {
    ...PRODUCT,
    value,
    currency,
  });
}

export function trackTikTokPurchase(value: number, currency = "USD", orderId?: string) {
  const params = {
    ...PRODUCT,
    value,
    currency,
    order_id: orderId,
  };
  trackTikTokEvent("Purchase", params);
  trackTikTokEvent("CompletePayment", params);
}
