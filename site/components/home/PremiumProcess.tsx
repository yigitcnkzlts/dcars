import { ArrowRight, BadgeCheck, ClipboardList, CalendarCheck } from "lucide-react";
import Link from "@/components/layout/NativeLink";

const steps = [
  [ClipboardList, "01", "Araç bilgileri", "Yıl, marka, model, vites, yakıt, versiyon ve rengi seçin."],
  [BadgeCheck, "02", "Kilometre ve ekspertiz", "Kilometre, tramer ve kaporta durumunu paylaşın. Fotoğraf eklemek isteğe bağlıdır."],
  [CalendarCheck, "03", "Ön değerleme ve randevu", "Simülasyon ön değerini görün, randevu veya arama talebinizi iletin."],
] as const;

export function PremiumProcess() {
  return (
    <section className="journey" aria-labelledby="process-title">
      <div className="journey__heading">
        <span>Değerleme süreci</span>
        <h2 id="process-title">Kısa, sade ve net bir yolculuk.</h2>
        <p>Başvuru satış zorunluluğu doğurmaz. Ön değer bir simülasyondur; nihai teklif inceleme sonrasında belirlenir.</p>
      </div>
      <div className="journey__grid">
        {steps.map(([Icon, number, title, detail]) => (
          <article key={number}>
            <Icon size={22} />
            <small>{number}</small>
            <h3>{title}</h3>
            <p>{detail}</p>
          </article>
        ))}
      </div>
      <Link className="button button--primary" href="/arac-degerleme?new=1">Ücretsiz Teklif Al <ArrowRight size={16} /></Link>
    </section>
  );
}
