import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service – MelodyForYou",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <Link href="/" className="text-[#7C3AED] text-sm hover:underline mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <p>Last updated: January 2025</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">Service Description</h2>
            <p>MelodyForYou creates custom, personalized songs based on information provided by customers. Each song is uniquely crafted by professional musicians and delivered digitally.</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">Ordering</h2>
            <p>By placing an order, you confirm that the information provided is accurate and that you have the right to share any personal stories included. We reserve the right to decline orders that contain inappropriate, harmful, or illegal content.</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">Intellectual Property</h2>
            <p>You own full rights to use your song for personal, non-commercial purposes. You may share it with family and friends, play it at personal events, and keep it permanently. Commercial licensing is not included.</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">Delivery</h2>
            <p>Songs are typically delivered within 24–48 hours to the email address provided. Delivery times may vary during peak periods.</p>
            <h2 className="text-lg font-bold text-gray-900 mt-6">Contact</h2>
            <p>Email <a href="mailto:melodyforyou.music@gmail.com" className="text-[#7C3AED]">melodyforyou.music@gmail.com</a> for any questions.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
