import { Navbar } from "@/components/layout/Navbar";
import { ValuationExperience } from "@/components/valuation/ValuationExperience";
import "./valuation.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ücretsiz Araç Teklifi Al", description: "Araç bilgilerinizi paylaşın; D CARS uzmanları aracınızı inceleyip teklif sürecini başlatsın.", alternates: { canonical: "/arac-degerleme" } };

export default function ValuationPage() {
  return (
    <>
      <Navbar />
      <main className="standalone-flow valuation-page">
        <header>
          <div>
            <span>D CARS · TEKLİF TALEBİ</span>
            <h1>Aracınız için teklif alın.</h1>
            <p>Bilgilerinizi paylaşın; uzmanlarımız aracınızı ve güncel piyasa koşullarını inceleyerek teklif sürecini başlatsın. Satış zorunluluğu yoktur.</p>
          </div>
          <span className="valuation-header-note">Ücretsiz başvuru<br /><b>Satış zorunluluğu yok</b></span>
        </header>
        <ValuationExperience />
      </main>
    </>
  );
}
