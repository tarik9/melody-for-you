"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getAdminToken, clearAdminToken } from "@/lib/adminClient";

const NAV = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <path d="M3 13h4v8H3v-8zm7-9h4v17h-4V4zm7 5h4v12h-4V9z" />
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <path d="M4 4h16v4H4V4zm0 6h16v10H4V10zm3 3h4M7 16h10" />
    ),
  },
  {
    href: "/admin/orderleads",
    label: "Leads",
    icon: (
      <path d="M4 4l16 8-16 8V4z" />
    ),
  },
  {
    href: "/admin/live",
    label: "Live",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </>
    ),
  },
];

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-gray-100">
          <span className="font-bold text-gray-900 text-sm tracking-tight">
            MelodyForYou <span className="text-[#7C3AED]">Admin</span>
          </span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#EDE9FE] text-[#5B21B6]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 shrink-0"
                >
                  {item.icon}
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => {
              clearAdminToken();
              router.push("/admin/login");
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <main className="p-6 sm:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
