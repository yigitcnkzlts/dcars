import { FaqSection, faqCategories } from "@/components/home/FaqSection";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sıkça Sorulan Sorular", description: "Araç teklifi, ödeme, noter, ekspertiz ve rehinli araç süreci hakkında yanıtlar.", alternates: { canonical: "/sss" } };

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Object.values(faqCategories).flat().map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return <><Navbar /><main className="standalone-content"><FaqSection /></main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} /></>;
}
