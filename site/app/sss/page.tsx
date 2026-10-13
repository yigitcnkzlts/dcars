import { FaqSection } from "@/components/home/FaqSection";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sıkça Sorulan Sorular", description: "Araç teklifi, ödeme, noter, ekspertiz ve rehinli araç süreci hakkında yanıtlar.", alternates: { canonical: "/sss" } };

export default function FaqPage() {
  return <><Navbar /><main className="standalone-content"><FaqSection /></main></>;
}
