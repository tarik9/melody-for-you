import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy – MelodyForYou",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <Link href="/" className="text-[#7C3AED] text-sm hover:underline mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-600 text-sm leading-relaxed">
            <p>Last updated: January 2025</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">Information We Collect</h2>
            <p>We collect information you provide when placing an order: your name, email address, and the story details you share. Payment information is processed securely by Stripe and is never stored on our servers.</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">How We Use Your Information</h2>
            <p>Your information is used solely to create your custom song and deliver it to your email address. We do not sell your data to third parties.</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">Cookies & Tracking</h2>
            <p>We use Meta Pixel for advertising analytics. This helps us understand how customers find us. You can opt out via your browser settings.</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">Contact</h2>
            <p>Questions? Email <a href="mailto:melodyforyou.music@gmail.com" className="text-[#7C3AED]">melodyforyou.music@gmail.com</a></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
