import type { Metadata } from "next";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import RedditPixel from "@/components/RedditPixel";
import TikTokPixel from "@/components/TikTokPixel";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://melodyforyou.store"),
  title: "MelodyForYou – A Personalized Song Made From Your Story",
  description:
    "Turn your memories into a studio-quality song. Professional musicians craft your personal story into music, delivered in 24 hours.",
  keywords: "personalized song, custom song, gift, anniversary, birthday, wedding song",
  openGraph: {
    title: "MelodyForYou – A Personalized Song Made From Your Story",
    description: "Turn your memories into a studio-quality song, delivered in 24 hours.",
    type: "website",
    siteName: "MelodyForYou",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <MetaPixel />
        <RedditPixel />
        <TikTokPixel />
        {children}
      </body>
    </html>
  );
}
