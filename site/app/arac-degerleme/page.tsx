import { Navbar } from "@/components/layout/Navbar";
import { ValuationExperience } from "@/components/valuation/ValuationExperience";
import "./valuation.css";

export default function ValuationPage() {
  return (
    <>
      <Navbar />
      <main className="standalone-flow valuation-page">
        <header>
          <div>
            <span>D CARS · ARACIMI DEĞERLE</span>
            <h1>Aracınızın değerini öğrenin.</h1>
            <p>Bilgilerinizi paylaşın; uzmanlarımız aracınızı ve güncel piyasa koşullarını inceleyerek teklif sürecini başlatsın. Satış zorunluluğu yoktur.</p>
          </div>
          <span className="valuation-header-note">Ücretsiz başvuru<br /><b>Satış zorunluluğu yok</b></span>
        </header>
        <ValuationExperience />
      </main>
    </>
  );
}
