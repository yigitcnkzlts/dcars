import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Analytics, CookieConsent } from "@/components/analytics/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "D CARS | Aracını Sat, Teklifini Al", template: "%s | D CARS" },
  description: "Aracının bilgilerini ve varsa hasar fotoğraflarını paylaş. Ücretsiz teklif talebi oluştur, satış kararını sen ver.",
  metadataBase: new URL("https://dcars.tr"),
  alternates: { canonical: "/" },
  openGraph: { title: "D CARS | Aracını Sat, Teklifini Al", description: "Aracını anlat, fotoğraflarını ekle ve teklif talebi oluştur.", locale: "tr_TR", type: "website", siteName: "D CARS", images: [{ url: "/images/dcars-logo-profile.png", width: 1024, height: 1024, alt: "D CARS logosu" }] },
  twitter: { card: "summary", title: "D CARS | Aracını Sat, Teklifini Al", description: "Aracını anlat, ücretsiz teklif talebi oluştur.", images: ["/images/dcars-logo-profile.png"] },
  icons: {
    icon: "/images/dcars-logo-profile.png",
    shortcut: "/images/dcars-logo-profile.png",
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
