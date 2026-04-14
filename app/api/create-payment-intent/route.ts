import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { OrderData, SONG_PRICE_CENTS } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { orderData }: { orderData: OrderData } = await req.json();

    if (!orderData?.email) {
      return NextResponse.json({ error: "Missing order data" }, { status: 400 });
    }

    // Create a PaymentIntent with order metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: SONG_PRICE_CENTS,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: orderData.email,
      metadata: {
        style: orderData.style,
        vocal_preference: orderData.vocalPreference,
        recipient_name: orderData.recipientName,
        relationship: orderData.relationship,
        occasion: orderData.occasion,
        // Truncate story to Stripe metadata limit (500 chars)
        story: orderData.story.slice(0, 490),
        specific_lyrics: (orderData.specificLyrics || "").slice(0, 490),
        email: orderData.email,
      },
      description: `Custom Song – ${orderData.occasion} for ${orderData.recipientName}`,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment intent creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
