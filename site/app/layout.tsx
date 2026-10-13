import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Analytics, CookieConsent } from "@/components/analytics/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "D CARS | Aracını Sat, Teklifini Al", template: "%s | D CARS" },
  description: "Aracının bilgilerini ve varsa hasar fotoğraflarını paylaş. Ücretsiz teklif talebi oluştur, satış kararını sen ver.",
  metadataBase: new URL("https://dcars.tr"),
  alternates: { canonical: "/" },
  openGraph: { title: "D CARS | Aracını Sat, Teklifini Al", description: "Aracını anlat, fotoğraflarını ekle ve teklif talebi oluştur.", locale: "tr_TR", type: "website", siteName: "D CARS", images: [{ url: "/images/q8-showroom.png", width: 1200, height: 630, alt: "D CARS araç teklif hizmeti" }] },
  twitter: { card: "summary_large_image", title: "D CARS | Aracını Sat, Teklifini Al", description: "Aracını anlat, ücretsiz teklif talebi oluştur.", images: ["/images/q8-showroom.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}<Footer /><CookieConsent /><Analytics /></body>
    </html>
  );
}
