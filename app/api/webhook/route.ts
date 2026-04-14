import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { appendOrderToSheet } from "@/lib/googleSheets";
import { sendPurchaseEvent } from "@/lib/metaConversionsApi";
import { OrderData } from "@/lib/types";
import Stripe from "stripe";

// Disable body parsing — we need raw body for Stripe signature verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const meta = paymentIntent.metadata;

    const orderData: OrderData = {
      style: meta.style || "",
      vocalPreference: meta.vocal_preference || "",
      recipientName: meta.recipient_name || "",
      relationship: meta.relationship || "",
      occasion: meta.occasion || "",
      story: meta.story || "",
      specificLyrics: meta.specific_lyrics || "",
      email: meta.email || paymentIntent.receipt_email || "",
    };

    // Get client info from the charge (if available)
    const charges = paymentIntent.latest_charge;
    let clientIp: string | undefined;
    let userAgent: string | undefined;

    if (typeof charges === "string") {
      try {
        const charge = await stripe.charges.retrieve(charges);
        clientIp = charge.billing_details?.address?.postal_code ? undefined : undefined;
      } catch {}
    }

    // 1. Append to Google Sheets
    await appendOrderToSheet(orderData, paymentIntent.id, paymentIntent.amount);

    // 2. Send Meta Conversions API server-side Purchase event
    await sendPurchaseEvent({
      email: orderData.email,
      value: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      orderId: paymentIntent.id,
      clientIp,
      userAgent,
      eventSourceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/create`,
    });

    console.log(`Order processed successfully: ${paymentIntent.id}`);
  }

  return NextResponse.json({ received: true });
}
