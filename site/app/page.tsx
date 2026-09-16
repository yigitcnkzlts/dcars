import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { PremiumProcess } from "@/components/home/PremiumProcess";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { VehicleExperience } from "@/components/home/VehicleExperience";

export default function Home() {
  return (
    <main className="site-shell">
      <Navbar />
      <HeroSection />
      <VehicleExperience />
      <PremiumProcess />
      <HomeHighlights />
    </main>
  );
}
