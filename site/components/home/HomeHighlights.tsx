import { BadgeCheck, ScanSearch, ShieldCheck } from "lucide-react";
import Link from "@/components/layout/NativeLink";
import { ArrowRight } from "lucide-react";

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
    </section>
  );
}
