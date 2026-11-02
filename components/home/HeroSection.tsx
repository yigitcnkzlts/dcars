import Image from "next/image";
import { HeroValuationStart } from "./HeroValuationStart";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow">D CARS · Güvenilir Araç Değerleme Süreci</p>
        <h1 id="hero-title">Aracınız için teklif alın, kararınızı güvenle verin.</h1>
        <p>Araç bilgilerinizi paylaşın. Başvurunuzun ardından uzmanımız sizi 10 dakika içinde arasın.</p>
        <HeroValuationStart />
      </div>
      <div className="hero__visual">
        <Image src="/images/q8-cutout.png" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" priority style={{ objectFit: "contain", objectPosition: "right center" }} />
      </div>
    </section>
  );
}
