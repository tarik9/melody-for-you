"use client";

export default function PricingCTA() {
  const scrollToForm = () => {
    const el = document.getElementById("order-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="py-20 bg-[#F8F7FF]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-purple-200 text-[#7C3AED] font-semibold px-5 py-2 rounded-full text-sm shadow-sm mb-4">
          <span className="w-2 h-2 bg-[#7C3AED] rounded-full animate-pulse" />
          Limited Time Offer: $19.99 USD
        </div>

        <p className="text-gray-400 text-sm mb-6">
          (Regular price <span className="line-through">$99.99 USD</span>)
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-gray-500 text-sm mb-8">
          {["Custom-written", "Recorded", "Mixed", "Mastered"].map((item) => (
            <span key={item} className="flex items-center gap-1">
              <span className="text-purple-400">•</span> {item}
            </span>
          ))}
          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-medium">
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Your song in 24–48h
          </span>
        </div>

        <button
          onClick={scrollToForm}
          className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-12 py-4 rounded-full text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 inline-block"
        >
          Create Your Song — $19.99
        </button>

        <p className="text-gray-400 text-xs mt-4">
          100% Satisfaction Guarantee · No subscription required
        </p>
      </div>
    </section>
  );
}
