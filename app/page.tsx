import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SampleSongs from "@/components/SampleSongs";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import WatchReactions from "@/components/WatchReactions";
import OrderForm from "@/components/OrderForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <SampleSongs />
      <Testimonials />
      <WhyChooseUs />
      <HowItWorks />
      <WatchReactions />
      <OrderForm />
      <FAQ />
      <Footer />
    </main>
  );
}
