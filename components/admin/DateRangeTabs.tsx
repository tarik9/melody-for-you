"use client";

import { useState } from "react";
import { RANGE_OPTIONS, RangeKey, DateRangeValue, computeRange } from "@/lib/adminRanges";

export default function DateRangeTabs({
  onChange,
  defaultKey = "30d",
}: {
  onChange: (range: DateRangeValue) => void;
  defaultKey?: RangeKey;
}) {
  const [active, setActive] = useState<RangeKey>(defaultKey);
  const [customSince, setCustomSince] = useState("");
  const [customUntil, setCustomUntil] = useState("");

  function select(key: RangeKey) {
    setActive(key);
    if (key !== "custom") {
      onChange(computeRange(key));
    } else if (customSince) {
      onChange(computeRange(key, customSince, customUntil));
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => select(opt.key)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
            active === opt.key
              ? "bg-[#5B21B6] text-white"
              : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
          }`}
        >
          {opt.label}
        </button>
      ))}
      {active === "custom" && (
        <div className="flex items-center gap-2 ml-1">
          <input
            type="date"
            value={customSince}
            onChange={(e) => {
              setCustomSince(e.target.value);
              if (e.target.value) onChange(computeRange("custom", e.target.value, customUntil));
            }}
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={customUntil}
            onChange={(e) => {
              setCustomUntil(e.target.value);
              if (customSince) onChange(computeRange("custom", customSince, e.target.value));
            }}
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600"
          />
        </div>
      )}
    </div>
  );
}
