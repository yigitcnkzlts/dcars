import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { PremiumProcess } from "@/components/home/PremiumProcess";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { FaqSection } from "@/components/home/FaqSection";

export default function Home() {
  return (
    <main className="site-shell">
      <Navbar />
      <HeroSection />
      <PremiumProcess />
      <HomeHighlights />
      <FaqSection />
    </main>
  );
}
