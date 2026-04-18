import { createHash } from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "D7HB6EJC77U8DEPHGQS0";
const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || "";
const API_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

interface TikTokPurchaseParams {
  email: string;
  value: number;
  currency: string;
  orderId: string;
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl?: string;
}

export async function sendTikTokPurchaseEvent(params: TikTokPurchaseParams) {
  if (!ACCESS_TOKEN) {
    console.warn("TIKTOK_ACCESS_TOKEN not set — skipping server-side event");
    return;
  }

  const { email, value, currency, orderId, clientIp, userAgent, eventSourceUrl } = params;

  const eventTime = Math.floor(Date.now() / 1000);

  const user: Record<string, string> = {};
  if (email) user.email = sha256(email);
  if (clientIp) user.ip = clientIp;
  if (userAgent) user.user_agent = userAgent;

  const payload = {
    pixel_code: PIXEL_ID,
    event_source: "web",
    event_source_id: PIXEL_ID,
    partner_name: "NextJS",
    data: [
      {
        event: "Purchase",
        event_time: eventTime,
        event_id: orderId, // deduplication key
        user,
        page: {
          url: eventSourceUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        },
        properties: {
          value: value.toFixed(2),
          currency: currency.toUpperCase(),
          order_id: orderId,
          content_ids: ["custom-song"],
          content_name: "Custom Song",
          content_type: "product",
          contents: [{ content_id: "custom-song", content_name: "Custom Song", quantity: 1, price: value.toFixed(2) }],
        },
      },
    ],
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.code !== 0) {
      console.error("TikTok Events API error:", result.message);
    } else {
      console.log("TikTok Events API: CompletePayment sent for", orderId);
    }
  } catch (err) {
    console.error("TikTok Events API request failed:", err);
  }
}
