"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How long does it take?",
    a: "Most songs are delivered within 24 hours. In peak periods it may take up to 48 hours. We'll keep you updated by email.",
  },
  {
    q: "Can I request revisions?",
    a: "Yes! We offer one free revision if you feel the song doesn't match your vision. Simply reply to your delivery email with feedback and we'll adjust it.",
  },
  {
    q: "What if I don't like it?",
    a: "We have a 100% satisfaction guarantee. If you're not happy with your song after the revision, we'll give you a full refund — no questions asked.",
  },
  {
    q: "Can I choose the lyrics?",
    a: "You can include specific phrases or lines you want in the song. Our artists will weave them into the composition naturally. Full lyric control is not included but we take your input very seriously.",
  },
  {
    q: "What format will I receive?",
    a: "You'll receive a high-quality MP3 file (320kbps) delivered directly to your email inbox. Perfect for playing on any device or sharing.",
  },
  {
    q: "Who owns the rights?",
    a: "You own full rights to use your song for personal purposes — play it at events, share it with loved ones, keep it forever. Commercial use requires a separate license.",
  },
  {
    q: "Can I order a duet?",
    a: "Yes! Select 'Duet' as your vocal preference in the Style step and our team will create a beautiful two-voice arrangement.",
  },
  {
    q: "Is payment secure?",
    a: "Absolutely. Payments are processed through Stripe, the same secure payment system used by Amazon, Google, and millions of other companies. We never store your card details.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-1">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-100 last:border-0">
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="font-medium text-gray-800 group-hover:text-[#7C3AED] transition-colors pr-4">
                  {faq.q}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                    open === idx ? "rotate-180 text-[#7C3AED]" : ""
                  }`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {open === idx && (
                <div className="pb-5 text-gray-500 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
