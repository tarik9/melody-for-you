"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/components/MetaPixel";
import { trackTikTokViewContent } from "@/components/TikTokPixel";
import { SONG_PRICE } from "@/lib/types";

export default function HeroSection() {
  useEffect(() => {
    trackViewContent(SONG_PRICE);
    // TikTok pixel uses lazyOnload — retry until ready
    if ((window as unknown as { ttq?: unknown }).ttq) {
      trackTikTokViewContent();
    } else {
      const interval = setInterval(() => {
        if ((window as unknown as { ttq?: unknown }).ttq) {
          clearInterval(interval);
          trackTikTokViewContent();
        }
      }, 100);
      setTimeout(() => clearInterval(interval), 10000);
    }
  }, []);
  const scrollToForm = () => {
    const el = document.getElementById("order-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1E0A4A 0%, #3B0F8C 25%, #5B21B6 55%, #7C3AED 80%, #9333EA 100%)",
      }}
    >
      {/* Background musical elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='600' height='600' viewBox='0 0 600 600' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='300' cy='300' r='250' stroke='white' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='300' cy='300' r='200' stroke='white' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='300' cy='300' r='150' stroke='white' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(ellipse at 70% 40%, rgba(167,139,250,0.25) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(109,40,217,0.4) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20 pb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          A{" "}
          <em className="not-italic font-bold" style={{ fontStyle: "italic" }}>
            personalized song
          </em>{" "}
          made from your story,{" "}
          <span className="block mt-1">delivered in 24 hours</span>
        </h1>

        <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Turn your memories into a studio-quality song. Professional musicians
          craft your personal story into music, delivered in 24 hours.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={scrollToForm}
            className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
          >
            Start Your Song
          </button>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <div className="flex -space-x-2">
              {["#8B5CF6", "#A78BFA", "#C4B5FD"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: c }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="font-semibold text-white">500+ Songs Created</span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
          {[
            { icon: "✓", text: "100% Satisfaction" },
            { icon: "⏱", text: "24-Hour Delivery" },
            { icon: "🎵", text: "Studio Quality" },
            { icon: "✕", text: "No Subscription" },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-1.5">
              <span className="text-green-400 font-bold">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
