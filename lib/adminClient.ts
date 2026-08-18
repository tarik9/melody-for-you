"use client";

const TOKEN_KEY = "mfy_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token || ""}`,
    },
  });

  if (res.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined") window.location.href = "/admin/login";
  }

  return res;
}
