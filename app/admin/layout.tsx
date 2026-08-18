import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin – MelodyForYou",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
