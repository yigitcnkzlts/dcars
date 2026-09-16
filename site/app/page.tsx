import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { PremiumProcess } from "@/components/home/PremiumProcess";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { QuickValuationForm } from "@/components/valuation/QuickValuationForm";

export default function Home() {
  return (
    <main className="site-shell">
      <Navbar />
      <HeroSection />
      <QuickValuationForm />
      <PremiumProcess />
      <HomeHighlights />
    </main>
  );
}
