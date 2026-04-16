"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { trackPurchase } from "@/components/MetaPixel";
import { trackRedditPurchase } from "@/components/RedditPixel";

function SuccessContent() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const recipient = params.get("recipient") || "";
  const occasion = params.get("occasion") || "";

  useEffect(() => {
    // Fire client-side purchase pixel events
    trackPurchase(29.99, "USD");
    trackRedditPurchase(29.99, "USD");
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F7FF] pt-20 pb-16 flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          {/* Success card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-10 text-center">
            {/* Animated checkmark */}
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                viewBox="0 0 52 52"
                fill="none"
                className="w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="26" cy="26" r="25" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />
                <path
                  d="M14 26l9 9 15-15"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Your Order is Confirmed! 🎵
            </h1>

            <p className="text-gray-500 mb-6 leading-relaxed">
              {recipient
                ? `We've received your order for ${recipient}'s ${occasion} song!`
                : "We've received your order!"}
              {" "}Our musicians are already getting to work on your custom track.
            </p>

            {/* Timeline */}
            <div className="bg-[#F8F7FF] rounded-2xl p-5 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">What happens next:</h3>
              <div className="space-y-3">
                {[
                  { icon: "✅", title: "Order received", desc: "Your details are with our team", done: true },
                  { icon: "🎵", title: "Song production", desc: "Artists are composing your custom track", done: false },
                  { icon: "🎤", title: "Recording & mixing", desc: "Professional studio production", done: false },
                  { icon: "📧", title: "Delivery", desc: `Your song arrives at ${email || "your email"} within 24–48 hours`, done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <div>
                      <p className={`text-sm font-semibold ${item.done ? "text-green-600" : "text-gray-700"}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {email && (
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
                <p className="text-[#7C3AED] text-sm font-medium">
                  📬 Confirmation sent to <strong>{email}</strong>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Check your inbox (and spam folder) for your order confirmation.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-all text-center"
              >
                Back to Home
              </Link>
              <Link
                href="/create"
                className="flex-1 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold text-sm transition-all text-center shadow-md"
              >
                Order Another Song
              </Link>
            </div>
          </div>

          {/* Support note */}
          <p className="text-center text-gray-400 text-xs mt-6">
            Questions? Email us at{" "}
            <a href="mailto:melodyforyou.music@gmail.com" className="text-[#7C3AED] hover:underline">
              melodyforyou.music@gmail.com
            </a>
          </p>
        </div>
      </main>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
