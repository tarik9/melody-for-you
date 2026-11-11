import Header from "@/components/Header";
import ChristmasHero from "@/components/ChristmasHero";
import SampleSongs from "@/components/SampleSongs";
import HowItWorks from "@/components/HowItWorks";
import OrderForm from "@/components/OrderForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export const metadata = {
  title: "A Personalized Christmas Song – MelodyForYou",
  description:
    "Give a personal song made from your story this Christmas. Delivered by email in 24–48 hours.",
};

export default function ChristmasPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <ChristmasHero />
      <SampleSongs />
      <HowItWorks />
      <OrderForm />
      <FAQ />
      <Footer />
    </main>
  );
}
