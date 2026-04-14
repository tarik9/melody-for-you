"use client";

import { useState, useRef, useEffect } from "react";

interface SelectFieldProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export default function SelectField({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div ref={ref} className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault(); // prevent page scroll on focus
            setOpen((o) => !o);
          }}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 bg-white text-left transition-all duration-200 ${
            error
              ? "border-red-300"
              : open
              ? "border-[#7C3AED] shadow-sm shadow-purple-100"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-[200] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent scroll-to-focus behavior
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                  opt === value
                    ? "bg-[#7C3AED] text-white font-semibold"
                    : i === 0 && !value
                    ? "bg-[#D97706] text-white font-medium hover:bg-[#B45309]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
