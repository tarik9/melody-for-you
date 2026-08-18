"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { setAdminToken } from "@/lib/adminClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Incorrect password");
        return;
      }

      setAdminToken(data.token);
      router.push("/admin");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F7FF] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19V6l12-3v13" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="19" r="3" stroke="#7C3AED" strokeWidth="2" />
              <circle cx="18" cy="16" r="3" stroke="#7C3AED" strokeWidth="2" />
            </svg>
            <span className="font-bold text-gray-900 text-lg tracking-tight">MelodyForYou</span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Admin Login</h1>
          <p className="text-gray-400 text-sm text-center mb-6">Enter the admin password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#5B21B6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-md"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
