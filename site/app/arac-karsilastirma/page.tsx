import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { VehicleComparison } from "@/components/ai/VehicleComparison";

export const metadata: Metadata = {
  title: "Araç Karşılaştırma",
  description: "Doğrulanmış araçları motor, performans, tüketim ve boyut verileriyle karşılaştırın.",
  alternates: { canonical: "/arac-karsilastirma" },
};

export default function VehicleComparisonPage() {
  return <><Navbar /><main className="standalone-content comparison-page"><header className="comparison-page__header"><span>D CARS ARAÇ REHBERİ</span><h1>Araçları teknik verilerle karşılaştırın.</h1><p>Doğrulanmış üretici kataloglarından alınan motor, tüketim, performans ve boyut bilgilerini yan yana inceleyin.</p></header><VehicleComparison /></main></>;
}
