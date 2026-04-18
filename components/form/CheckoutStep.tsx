"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { OrderData, SONG_PRICE } from "@/lib/types";

interface CheckoutStepProps {
  orderData: OrderData;
  clientSecret: string;
  onBack: () => void;
}

export default function CheckoutStep({ orderData, clientSecret, onBack }: CheckoutStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || "Payment failed");
      setIsLoading(false);
      return;
    }

    const returnUrl = `${window.location.origin}/success?email=${encodeURIComponent(orderData.email)}&recipient=${encodeURIComponent(orderData.recipientName)}&occasion=${encodeURIComponent(orderData.occasion)}`;

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: returnUrl,
        receipt_email: orderData.email,
      },
    });

    if (confirmError) {
      setError(confirmError.message || "Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 step-animate">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M9 12l2 2 4-4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="#7C3AED" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
        </div>
        <span className="text-gray-400 text-sm font-medium">Step 6 of 6</span>
      </div>

      <div className="px-6 py-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Style:</span>
              <span className="font-medium text-gray-900">{orderData.style} ({orderData.vocalPreference})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">For:</span>
              <span className="font-medium text-gray-900">{orderData.recipientName} ({orderData.occasion})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery:</span>
              <span className="font-medium text-gray-900">24 Hours</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
              <span className="font-bold text-[#7C3AED]">Total</span>
              <span className="font-bold text-[#7C3AED] text-lg">${SONG_PRICE} USD</span>
            </div>
          </div>
        </div>

        {/* Delivery email reminder */}
        <div className="bg-purple-50 rounded-xl px-4 py-3 mb-5 text-sm text-[#7C3AED] flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0">
            <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="m2 7 8 5 8-5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Song delivered to: <strong>{orderData.email}</strong>
        </div>

        {/* Stripe Payment Form */}
        <form onSubmit={handleSubmit} id="payment-form">
          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card", "google_pay", "apple_pay"],
            }}
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-5 space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-green-500">
                <path d="M8 1L2 3v5c0 3.31 2.69 6 6 6s6-2.69 6-6V3L8 1z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span><strong className="text-gray-700">Secured by Stripe</strong> — Your payment info is encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-green-500">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span><strong className="text-gray-700">100% Satisfaction Guarantee</strong> — Love it or we revise it free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-green-500">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span><strong className="text-gray-700">Delivered to your inbox</strong> in 24–48 hours</span>
            </div>
          </div>
        </form>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <button
          type="submit"
          form="payment-form"
          disabled={isLoading || !stripe || !elements}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 min-w-[180px]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Pay ${SONG_PRICE} USD
            </>
          )}
        </button>
      </div>

      {/* Card logos */}
      <div className="px-6 pb-5 flex items-center justify-center gap-2">
        {["VISA", "MC", "AMEX", "APPLE"].map((card) => (
          <div key={card} className="h-6 px-2 bg-white border border-gray-200 rounded text-[9px] font-bold text-gray-500 flex items-center">
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}
