"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/components/MetaPixel";
import { SONG_PRICE } from "@/lib/types";

// Christmas landing hero — used only on /christmas
export default function ChristmasHero() {
  useEffect(() => {
    trackViewContent(SONG_PRICE);
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById("order-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #3B0A0A 0%, #7F1D1D 35%, #5B21B6 75%, #7C3AED 100%)",
      }}
    >
      {/* Deadline ribbon */}
      <div className="absolute top-16 left-0 right-0 bg-[#D97706] text-white text-center text-sm font-semibold py-2 px-4">
        🎄 Order by December 20 to have your song ready for Christmas
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-32 pb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          This Christmas, give them{" "}
          <span style={{ fontStyle: "italic" }}>a song about them</span>
        </h1>

        <p className="text-white/85 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Tell us their name, your memories and the little things only you know.
          We turn it into a personal song, sent to your inbox in 24–48 hours —
          ready to play on Christmas morning.
        </p>

        <div className="flex flex-col items-center gap-3 mb-12">
          <button
            onClick={scrollToForm}
            className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Their Christmas Song — ${SONG_PRICE}
          </button>
          <span className="text-white/70 text-sm">
            Takes 2–3 minutes · Choose Christmas as the occasion
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
          {[
            "🎁 A gift no one else can buy",
            "⏱ Delivered in 24–48h",
            "📧 MP3 by email — easy to share",
          ].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
