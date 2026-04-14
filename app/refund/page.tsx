import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Refund Policy – MelodyForYou",
};

export default function RefundPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <Link href="/" className="text-[#7C3AED] text-sm hover:underline mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <p>Last updated: January 2025</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">100% Satisfaction Guarantee</h2>
            <p>We stand behind the quality of every song we create. If you&apos;re not satisfied with your song, we offer one free revision. Simply reply to your delivery email with specific feedback about what you&apos;d like changed.</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">Refund Eligibility</h2>
            <p>If after the revision you&apos;re still not satisfied, you may request a full refund within 14 days of delivery. Refunds are processed within 5–10 business days to your original payment method.</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">How to Request a Refund</h2>
            <p>Email <a href="mailto:melodyforyou.music@gmail.com" className="text-[#7C3AED]">melodyforyou.music@gmail.com</a> with your order details and reason for the refund request.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
