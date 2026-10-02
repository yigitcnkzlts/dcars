import { ArrowRight } from "lucide-react";
import Link from "@/components/layout/NativeLink";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow">D CARS · Ücretsiz ön değerleme</p>
        <h1 id="hero-title">Aracınızın değerini öğrenin, teklifinizi değerlendirin.</h1>
        <p>Araç bilgilerinizi paylaşın. D CARS aracınızı değerlendirerek sonraki adımları sizinle planlasın.</p>
        <Link className="button button--primary" href="/arac-degerleme?new=1">Ücretsiz Teklif Al <ArrowRight size={17} /></Link>
      </div>
      <div className="hero__visual">
        <Image src="/images/q8-cutout.png" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" priority style={{ objectFit: "contain", objectPosition: "right center" }} />
      </div>
    </section>
  );
}
