import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { PremiumProcess } from "@/components/home/PremiumProcess";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { FaqSection } from "@/components/home/FaqSection";
import { VehicleComparison } from "@/components/ai/VehicleComparison";

export default function Home() {
  return (
    <main className="site-shell">
      <Navbar />
      <HeroSection />
      <section className="home-comparison" aria-label="Ana sayfa araç karşılaştırması">
        <VehicleComparison />
      </section>
      <PremiumProcess />
      <HomeHighlights />
      <FaqSection />
    </main>
  );
}
