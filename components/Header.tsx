"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleCTA = () => {
    if (isHome) {
      const el = document.getElementById("order-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19V6l12-3v13" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="19" r="3" stroke="#7C3AED" strokeWidth="2" />
              <circle cx="18" cy="16" r="3" stroke="#7C3AED" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">MelodyForYou</span>
        </Link>

        {/* CTA */}
        {isHome ? (
          <button
            onClick={handleCTA}
            className="bg-[#D97706] hover:bg-[#B45309] text-white font-semibold px-4 py-2 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Listen to Our Songs
          </button>
        ) : (
          <Link
            href="/#order-form"
            className="bg-[#D97706] hover:bg-[#B45309] text-white font-semibold px-4 py-2 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Listen to Our Songs
          </Link>
        )}
      </div>
    </header>
  );
}
