"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Header from "@/components/Header";
import StepIndicator from "@/components/form/StepIndicator";
import StepCard from "@/components/form/StepCard";
import SelectField from "@/components/form/SelectField";
import CheckoutStep from "@/components/form/CheckoutStep";
import {
  OrderData,
  MUSICAL_STYLES,
  VOCAL_PREFERENCES,
  RELATIONSHIPS,
  OCCASIONS,
} from "@/lib/types";
import { trackInitiateCheckout } from "@/components/MetaPixel";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const TOTAL_STEPS = 6;

const STEP_ICONS = {
  1: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 19V6l12-3v13" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="19" r="3" stroke="#7C3AED" strokeWidth="1.5" />
      <circle cx="18" cy="16" r="3" stroke="#7C3AED" strokeWidth="1.5" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#7C3AED" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  3: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  4: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#7C3AED" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  5: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="m2 7 10 7 10-7" stroke="#7C3AED" strokeWidth="1.5" />
    </svg>
  ),
};

const emptyOrder: OrderData = {
  style: "",
  vocalPreference: "",
  recipientName: "",
  relationship: "",
  occasion: "",
  story: "",
  specificLyrics: "",
  email: "",
};

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState<OrderData>(emptyOrder);
  const [errors, setErrors] = useState<Partial<OrderData>>({});
  const [clientSecret, setClientSecret] = useState("");
  const [isLoadingSecret, setIsLoadingSecret] = useState(false);

  const update = (field: keyof OrderData, value: string) => {
    setOrder((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<OrderData> = {};
    if (step === 1) {
      if (!order.style) newErrors.style = "Please select a musical style";
      if (!order.vocalPreference) newErrors.vocalPreference = "Please select a vocal preference";
    }
    if (step === 2) {
      if (!order.recipientName.trim()) newErrors.recipientName = "Please enter a name";
      if (!order.relationship) newErrors.relationship = "Please select a relationship";
    }
    if (step === 3) {
      if (!order.occasion) newErrors.occasion = "Please select an occasion";
    }
    if (step === 4) {
      if (!order.story.trim() || order.story.trim().length < 10)
        newErrors.story = "Story must be at least 10 characters long";
    }
    if (step === 5) {
      if (!order.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email))
        newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchClientSecret = useCallback(async () => {
    setIsLoadingSecret(true);
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderData: order }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (err) {
      console.error("Failed to create payment intent:", err);
    } finally {
      setIsLoadingSecret(false);
    }
  }, [order]);

  const handleNext = async () => {
    if (!validate()) return;

    if (step === 5) {
      // Moving to checkout - fire InitiateCheckout pixel event + fetch client secret
      trackInitiateCheckout(19.99);
      await fetchClientSecret();
    }

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        {/* Top pricing banner */}
        <div className="bg-white border-b border-gray-100 py-3">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-[#7C3AED] font-bold px-3 py-1 rounded-full text-xs">
                Limited Time Offer: $19.99 USD
              </span>
              <span className="text-gray-400 line-through text-xs">(Regular price $99.99 USD)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500 text-xs">
              {["Custom-written", "Recorded", "Mixed", "Mastered"].map((item) => (
                <span key={item} className="flex items-center gap-1">
                  <span className="text-purple-400">•</span> {item}
                </span>
              ))}
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                ⏱ Your song in 24–48h
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
          {/* Page title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Create Your Song
            </h1>
            <p className="text-gray-500">Fill out the details below and let our artists do the magic.</p>
            <p className="text-gray-400 text-sm mt-1">Average completion time: 2–3 minutes</p>
            <p className="text-[#7C3AED] text-xs mt-1 italic">
              Songs are already in production once details are submitted.
            </p>
          </div>

          {/* Step indicator */}
          <StepIndicator currentStep={step} />

          {/* Step 1: Style */}
          {step === 1 && (
            <StepCard
              icon={STEP_ICONS[1]}
              title="Style"
              stepNumber={1}
              totalSteps={TOTAL_STEPS}
              onBack={handleBack}
              onNext={handleNext}
              backDisabled={true}
            >
              <SelectField
                label="Preferred Style"
                placeholder="Select a musical style"
                options={MUSICAL_STYLES}
                value={order.style}
                onChange={(v) => update("style", v)}
                error={errors.style}
              />
              <SelectField
                label="Vocal Preference"
                placeholder="Select vocalist gender"
                options={VOCAL_PREFERENCES}
                value={order.vocalPreference}
                onChange={(v) => update("vocalPreference", v)}
                error={errors.vocalPreference}
              />
            </StepCard>
          )}

          {/* Step 2: Recipient */}
          {step === 2 && (
            <StepCard
              icon={STEP_ICONS[2]}
              title="Recipient"
              stepNumber={2}
              totalSteps={TOTAL_STEPS}
              onBack={handleBack}
              onNext={handleNext}
            >
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Who is this song for?
                </label>
                <input
                  type="text"
                  value={order.recipientName}
                  onChange={(e) => update("recipientName", e.target.value)}
                  placeholder="Enter their name"
                  className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 ${
                    errors.recipientName
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-[#7C3AED] focus:shadow-sm focus:shadow-purple-100"
                  }`}
                />
                {errors.recipientName && (
                  <p className="mt-1 text-xs text-red-500">{errors.recipientName}</p>
                )}
              </div>
              <SelectField
                label="Your Relationship"
                placeholder="Select relationship"
                options={RELATIONSHIPS}
                value={order.relationship}
                onChange={(v) => update("relationship", v)}
                error={errors.relationship}
              />
            </StepCard>
          )}

          {/* Step 3: Occasion */}
          {step === 3 && (
            <StepCard
              icon={STEP_ICONS[3]}
              title="Occasion"
              stepNumber={3}
              totalSteps={TOTAL_STEPS}
              onBack={handleBack}
              onNext={handleNext}
            >
              <SelectField
                label="What's the Occasion?"
                placeholder="Select occasion"
                options={OCCASIONS}
                value={order.occasion}
                onChange={(v) => update("occasion", v)}
                error={errors.occasion}
              />
            </StepCard>
          )}

          {/* Step 4: Story */}
          {step === 4 && (
            <StepCard
              icon={STEP_ICONS[4]}
              title="Story"
              stepNumber={4}
              totalSteps={TOTAL_STEPS}
              onBack={handleBack}
              onNext={handleNext}
            >
              <div className="mb-5">
                <label className="block text-sm font-semibold text-red-500 mb-1">
                  Share Your Story
                </label>
                <p className="text-gray-500 text-xs mb-2">
                  Tell us about special moments, inside jokes, or memories (min 10 chars).
                </p>
                <textarea
                  value={order.story}
                  onChange={(e) => update("story", e.target.value)}
                  placeholder="E.g. We met at a coffee shop in 2018. She always laughs at my terrible jokes. We love hiking and our dog Biscuit..."
                  rows={5}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 outline-none resize-none transition-all duration-200 text-sm ${
                    errors.story
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-[#7C3AED] focus:shadow-sm focus:shadow-purple-100"
                  }`}
                />
                {errors.story && (
                  <p className="mt-1 text-xs text-red-500">{errors.story}</p>
                )}
                <p className="text-gray-400 text-xs mt-1 text-right">
                  {order.story.length} characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specific Lyrics{" "}
                  <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={order.specificLyrics}
                  onChange={(e) => update("specificLyrics", e.target.value)}
                  placeholder="Any specific phrases you want included?"
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none resize-none focus:border-[#7C3AED] focus:shadow-sm focus:shadow-purple-100 transition-all duration-200 text-sm"
                />
              </div>
            </StepCard>
          )}

          {/* Step 5: Delivery */}
          {step === 5 && (
            <StepCard
              icon={STEP_ICONS[5]}
              title="Delivery"
              stepNumber={5}
              totalSteps={TOTAL_STEPS}
              onBack={handleBack}
              onNext={handleNext}
              nextLabel={isLoadingSecret ? "Loading..." : "Next Step"}
              nextDisabled={isLoadingSecret}
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Your Email Address
                </label>
                <p className="text-gray-400 text-xs mb-3">
                  We&apos;ll send the song here when it&apos;s ready.
                </p>
                <input
                  type="email"
                  value={order.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 ${
                    errors.email
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-[#7C3AED] focus:shadow-sm focus:shadow-purple-100"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </StepCard>
          )}

          {/* Step 6: Checkout */}
          {step === 6 && (
            <>
              {isLoadingSecret ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center gap-4">
                  <svg className="animate-spin w-8 h-8 text-[#7C3AED]" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  <p className="text-gray-500 text-sm">Preparing your order...</p>
                </div>
              ) : clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#7C3AED",
                        colorBackground: "#ffffff",
                        colorText: "#1F2937",
                        colorDanger: "#EF4444",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        borderRadius: "12px",
                        spacingUnit: "4px",
                      },
                    },
                  }}
                >
                  <CheckoutStep
                    orderData={order}
                    clientSecret={clientSecret}
                    onBack={handleBack}
                  />
                </Elements>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <p className="text-red-500 mb-4">Failed to load payment form. Please try again.</p>
                  <button
                    onClick={fetchClientSecret}
                    className="bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Retry
                  </button>
                </div>
              )}
            </>
          )}

          {/* Payment security note */}
          <div className="mt-6 flex flex-col items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-green-500">
                <path d="M8 1L2 3v5c0 3.31 2.69 6 6 6s6-2.69 6-6V3L8 1z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <span>SECURE PAYMENT VIA</span>
            </div>
            <div className="flex items-center gap-3">
              {["VISA", "MASTERCARD", "APPLE PAY", "GOOGLE PAY"].map((p) => (
                <div
                  key={p}
                  className="h-6 px-2 bg-white border border-gray-200 rounded text-[8px] font-bold text-gray-500 flex items-center shadow-sm"
                >
                  {p}
                </div>
              ))}
            </div>
            <p>256-bit SSL encryption · Your data is always safe</p>
          </div>
        </div>
      </main>
    </>
  );
}
