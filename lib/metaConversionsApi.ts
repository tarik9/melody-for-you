import * as crypto from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "TEST_PIXEL_ID_123456789";
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "";

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

interface PurchaseEventData {
  email: string;
  value: number;
  currency?: string;
  orderId: string;
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl?: string;
}

export async function sendPurchaseEvent(data: PurchaseEventData) {
  if (!ACCESS_TOKEN) {
    console.warn("META_ACCESS_TOKEN not set — skipping server-side event");
    return;
  }

  const eventTime = Math.floor(Date.now() / 1000);

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: eventTime,
        action_source: "website",
        event_source_url: data.eventSourceUrl || process.env.NEXT_PUBLIC_APP_URL,
        user_data: {
          em: [hashValue(data.email)],
          client_ip_address: data.clientIp,
          client_user_agent: data.userAgent,
        },
        custom_data: {
          value: data.value,
          currency: data.currency || "USD",
          content_name: "Custom Song",
          content_category: "Music",
          order_id: data.orderId,
          num_items: 1,
        },
      },
    ],
    test_event_code: process.env.NODE_ENV !== "production" ? "TEST12345" : undefined,
  };

  try {
    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error("Meta CAPI error:", result);
    } else {
      console.log("Meta CAPI Purchase event sent:", result);
    }
  } catch (error) {
    console.error("Failed to send Meta CAPI event:", error);
    // Don't throw — don't break the webhook
  }
}
