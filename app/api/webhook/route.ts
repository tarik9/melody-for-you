import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { appendOrderToSheet } from "@/lib/googleSheets";
import { sendPurchaseEvent } from "@/lib/metaConversionsApi";
import { sendTikTokPurchaseEvent } from "@/lib/tiktokEventsApi";
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

    await appendOrderToSheet(orderData, paymentIntent.id, paymentIntent.amount);

    await Promise.all([
      sendPurchaseEvent({
        email: orderData.email,
        value: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        orderId: paymentIntent.id,
        eventSourceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/create`,
      }),
      sendTikTokPurchaseEvent({
        email: orderData.email,
        value: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        orderId: paymentIntent.id,
        eventSourceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      }),
    ]);

    console.log(`Order processed (form): ${paymentIntent.id}`);
  }

  // Handle Stripe Payment Link purchases (checkout.session.completed)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") return NextResponse.json({ received: true });

    const email = session.customer_details?.email || "";
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : "";
    const amount = session.amount_total || 0;
    const currency = (session.currency || "usd").toUpperCase();

    const orderData: OrderData = {
      style: "", vocalPreference: "", recipientName: "",
      relationship: "", occasion: "Payment Link", story: "",
      specificLyrics: "", email,
    };

    await appendOrderToSheet(orderData, paymentIntentId, amount);

    await Promise.all([
      sendPurchaseEvent({
        email,
        value: amount / 100,
        currency,
        orderId: paymentIntentId,
        eventSourceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      }),
      sendTikTokPurchaseEvent({
        email,
        value: amount / 100,
        currency,
        orderId: paymentIntentId,
        eventSourceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      }),
    ]);

    console.log(`Order processed (payment link): ${paymentIntentId}`);
  }

  return NextResponse.json({ received: true });
}
