import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { PremiumProcess } from "@/components/home/PremiumProcess";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { QuickValuationForm } from "@/components/valuation/QuickValuationForm";
import { Car3DViewer } from "@/components/car3d/Car3DViewer";

export default function Home() {
  return (
    <main className="site-shell">
      <Navbar />
      <HeroSection />
      <Car3DViewer />
      <QuickValuationForm />
      <PremiumProcess />
      <HomeHighlights />
    </main>
  );
}
