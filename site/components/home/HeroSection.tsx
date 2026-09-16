import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "@/components/layout/NativeLink";
import Image from "next/image";

export function HeroSection() {
  return <section className="hero" aria-labelledby="hero-title"><div className="hero__ambient" aria-hidden="true" /><div className="hero__copy"><div className="eyebrow"><span /> Aracını satmak isteyenler için</div><h1 id="hero-title">ARACINI SAT.<br /><em>TEKLİFİNİ AL.</em></h1><p>Aracını birkaç adımda anlat. Hasar varsa fotoğraflarını ekle. Bilgiler incelendikten sonra sana özel teklif için iletişime geçelim.</p><div className="hero__actions"><Link className="button button--primary" href="/#teklif-formu">Ücretsiz teklif iste <ArrowUpRight size={17} /></Link><Link className="button button--ghost" href="/nasil-calisir">Nasıl çalışır? <ArrowDownRight size={17} /></Link></div></div><div className="hero__visual"><div className="hero__visual-glow" aria-hidden="true" /><div className="hero__visual-stage"><Image src="/images/q8-cutout.png" alt="Siyah otomobil görseli" fill priority sizes="(max-width: 900px) 100vw, 55vw" style={{ objectFit: "contain" }} /></div></div><div className="hero__meta"><div><span>01</span><strong>Araç bilgilerini paylaş</strong></div><div><span>02</span><strong>Durumu fotoğraflarla göster</strong></div><div><span>03</span><strong>Teklifi değerlendir</strong></div></div></section>;
}
