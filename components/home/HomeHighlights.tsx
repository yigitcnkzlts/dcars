import { BadgeCheck, ScanSearch, ShieldCheck } from "lucide-react";
import Link from "@/components/layout/NativeLink";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const highlights = [
  [ScanSearch, "Kısa başvuru", "Araç bilgilerini adım adım paylaşın. Bildiğiniz hasarları ve ekspertiz detaylarını ekleyebilirsiniz."],
  [BadgeCheck, "Açık inceleme", "Kaporta durumunu işaretleyin, isterseniz fotoğraf ekleyin. İlk değerlendirme bu bilgilerle başlar."],
  [ShieldCheck, "Karar sizde", "Uzman incelemesi sonrasında hazırlanan teklifi değerlendirin. Teklifi kabul etmek size kalır."],
] as const;

export function HomeHighlights() {
  return (
    <section className="home-highlights" aria-labelledby="highlights-title">
      <div className="home-highlights__heading">
        <span>Neden D CARS</span>
        <h2 id="highlights-title">Değerleme odaklı, şeffaf bir süreç.</h2>
        <Link href="/arac-degerleme?new=1">Ücretsiz Teklif Al <ArrowRight size={17} /></Link>
      </div>
      <div className="home-highlights__grid">
        {highlights.map(([Icon, title, text], index) => (
          <article key={title}>
            <div>
              <small>0{index + 1}</small>
              <Icon size={22} />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <article className="driving-guide" aria-labelledby="driving-guide-title">
        <div className="driving-guide__media">
          <Image
            src="/images/dcars-winter-driving-tips.jpg"
            alt="Kışın yapılan en büyük sürüş hatalarını gösteren D CARS rehberi"
            width={691}
            height={864}
            sizes="(max-width: 900px) 100vw, 42vw"
          />
        </div>
        <div className="driving-guide__copy">
          <span>Araç rehberi · Güvenli sürüş</span>
          <h3 id="driving-guide-title">Kışın yapılan en büyük sürüş hataları</h3>
          <p>Kış lastiğini geciktirmek, ani fren yapmak ve sıvı kontrollerini ihmal etmek hem güvenliği hem de aracınızın kondisyonunu etkiler. Soğuk havalara çıkmadan önce temel kontrollerinizi tamamlayın.</p>
          <Link href="/blog">Araç rehberini incele <ArrowRight size={17} /></Link>
        </div>
      </article>
    </section>
  );
}
