import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "D Cars | Aracını Sat, Teklifini Al",
  description: "Aracının bilgilerini ve varsa hasar fotoğraflarını paylaş. Ücretsiz teklif talebi oluştur, satış kararını sen ver.",
  metadataBase: new URL("https://dcars.tr"),
  openGraph: { title: "D Cars | Aracını Sat, Teklifini Al", description: "Aracını anlat, fotoğraflarını ekle ve teklif talebi oluştur.", locale: "tr_TR", type: "website" },
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
      <body>{children}<Footer /></body>
    </html>
  );
}
