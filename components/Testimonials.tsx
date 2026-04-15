"use client";

import { useState } from "react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Richard & Diane M.",
    location: "Scottsdale, AZ",
    rating: 5,
    short: "Thirty years of memories in three minutes",
    text: "We celebrated our 30th anniversary last month and I wanted something different. I gave the song during dinner and she absolutely lost it. The song captured everything I wrote about our life together — our first apartment, our kids, our dog Max. I honestly didn't expect it to be this good.",
    image: "/photos/1757039375__1757039372326-fb_img_1724502883125__original.avif",
    facePosition: "center 20%",
    cardBg: "bg-amber-50",
    verified: true,
  },
  {
    id: 2,
    name: "Samantha K.",
    location: "Indianapolis, IN",
    rating: 5,
    short: "My favorite birthday gift ever",
    text: "My husband surprised me with this for my birthday and I was NOT expecting it to cry my face off! The song talked about how we met at that coffee shop and our inside jokes. I've listened to it probably 100 times already.",
    image: "/photos/1757889937__1757889927404-img_7195__original.avif",
    facePosition: "center 75%",  // face is in bottom half, sky/umbrellas at top
    cardBg: "bg-sky-50",
    verified: true,
  },
  {
    id: 3,
    name: "Michelle T.",
    location: "Sugar Land, Texas",
    rating: 5,
    short: "Sounds like something you'd hear on the radio",
    text: "Got this as a birthday present for my dad's 60th. Professional quality, beautifully sung. We've played it at least 20 times. It perfectly captured his entire life story in a 4-minute song.",
    image: "/photos/1758025917__1758025904102-img_20240512_1420432__original.avif",
    facePosition: "center 15%",  // full body, face near top
    cardBg: "bg-teal-50",
    verified: true,
  },
  {
    id: 4,
    name: "Sally & Jim",
    location: "Calgary, AB",
    rating: 5,
    short: "The most personal gift I've ever received",
    text: "After 30 years I thought I'd given every possible gift. Then my daughter ordered this for Father's Day and it changed everything. The song was everything I love — our family memories, my favorite fishing spots, even our dog's name. I actually cried.",
    image: "/photos/1769515984__1769515961554-img_0912__original.avif",
    facePosition: "center 30%",
    cardBg: "bg-rose-50",
    verified: true,
  },
  {
    id: 5,
    name: "Steve W.",
    location: "Austin, TX",
    rating: 5,
    short: "Something I'll treasure forever",
    text: "My daughter made this for Father's Day and it hit different. The artists captured exactly what she wrote about our relationship from when she was little – it felt authentic and deeply personal.",
    image: "/photos/iimg.avif",
    facePosition: "center 25%",
    cardBg: "bg-orange-50",
    verified: true,
  },
  {
    id: 6,
    name: "Marcus & Denise J.",
    location: "Kingston, Jamaica",
    rating: 5,
    short: "We both ended up crying",
    text: "Ordered this for my husband's 40th birthday and we both ended up crying. Twenty-five years of marriage and this song captured it beautifully. We played it at our anniversary dinner with the whole family. A gift that keeps giving every time we play it.",
    image: "/photos/img.avif",
    facePosition: "center 20%",
    cardBg: "bg-purple-50",
    verified: true,
  },
  {
    id: 7,
    name: "Lisa & Karen S.",
    location: "Gold Coast, Australia",
    rating: 5,
    short: "Made us both cry on the beach",
    text: "I surprised my sister with this song for her 40th and she couldn't believe how personal it was. We grew up by the ocean and hearing our whole childhood captured in a song — that spot, those summers, our late mum — absolutely wrecked us both in the best way.",
    image: "/photos/immg.avif",
    facePosition: "center 35%",
    cardBg: "bg-slate-50",
    verified: true,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill={i < count ? "#F59E0B" : "#E5E7EB"}
          className="w-4 h-4"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Process steps visual */}
        <div className="flex justify-center mb-14">
          <div className="flex items-center gap-2 bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-100">
            {["📝", "🎵", "🎤", "📧", "🎁"].map((emoji, i, arr) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xl">{emoji}</span>
                {i < arr.length - 1 && (
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-purple-300">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-lg">Real stories from people who gave the gift of music</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className={`${t.cardBg} rounded-2xl p-5 shadow-sm border border-white hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <StarRating count={t.rating} />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                    {t.verified && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs">{t.location}</span>
                </div>
              </div>

              {/* Real customer photo */}
              <div className="w-full h-44 rounded-xl mb-3 overflow-hidden relative">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: t.facePosition }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <p className="font-semibold text-gray-800 text-sm mb-1">{t.short}</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                {expanded === t.id ? t.text : `${t.text.slice(0, 100)}...`}
              </p>
              <button
                onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                className="text-[#7C3AED] text-sm font-medium mt-1 hover:underline"
              >
                {expanded === t.id ? "Show less" : "Read more"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
