import { OrderData } from "./types";

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || "";

export async function appendOrderToSheet(
  orderData: OrderData,
  paymentIntentId: string,
  amountPaid: number
) {
  if (!WEBHOOK_URL) {
    console.warn("GOOGLE_SHEET_WEBHOOK_URL not set — skipping Sheets logging");
    return;
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        paymentIntentId,
        amount: (amountPaid / 100).toFixed(2),
        email: orderData.email,
        style: orderData.style,
        vocalPreference: orderData.vocalPreference,
        recipientName: orderData.recipientName,
        relationship: orderData.relationship,
        occasion: orderData.occasion,
        story: orderData.story,
        specificLyrics: orderData.specificLyrics || "",
      }),
    });

    const result = await res.json();
    if (result.success) {
      console.log("Order logged to Google Sheets:", paymentIntentId);
    }
  } catch (error) {
    console.error("Failed to log to Google Sheets:", error);
    // Don't throw — never break the webhook over a Sheets failure
  }
}
