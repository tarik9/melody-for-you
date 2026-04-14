import { NextRequest, NextResponse } from "next/server";
import { OrderData } from "@/lib/types";

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const { orderData }: { orderData: OrderData } = await req.json();

    if (!WEBHOOK_URL) {
      console.warn("GOOGLE_SHEET_WEBHOOK_URL not set");
      return NextResponse.json({ success: false, error: "Webhook not configured" });
    }

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        paymentIntentId: "PENDING",
        amount: "29.99",
        email: orderData.email,
        style: orderData.style,
        vocalPreference: orderData.vocalPreference,
        recipientName: orderData.recipientName,
        relationship: orderData.relationship,
        occasion: orderData.occasion,
        story: orderData.story,
        specificLyrics: orderData.specificLyrics || "",
        status: "Pending Payment",
      }),
    });

    const result = await res.json();
    return NextResponse.json({ success: result.success ?? true });
  } catch (error) {
    console.error("save-order error:", error);
    return NextResponse.json({ success: false });
  }
}
