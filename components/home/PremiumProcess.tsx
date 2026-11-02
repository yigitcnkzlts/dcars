import { ArrowRight, BadgeCheck, ClipboardList, CalendarCheck } from "lucide-react";
import Link from "@/components/layout/NativeLink";
import Image from "next/image";

const steps = [
  [ClipboardList, "01", "Araç bilgileri", "Yıl, marka, model, vites, yakıt, versiyon ve rengi seçin."],
  [BadgeCheck, "02", "Kilometre ve ekspertiz", "Kilometre, tramer ve kaporta durumunu paylaşın. Fotoğraf eklemek isteğe bağlıdır."],
  [CalendarCheck, "03", "Teklif talebi ve iletişim", "Bilgilerinizi kontrol edin; teklif talebinizi ve iletişim tercihinizi tamamlayın."],
] as const;

export function PremiumProcess() {
  return (
    <section className="journey" aria-labelledby="process-title">
      <div className="journey__heading">
        <span>Değerleme süreci</span>
        <h2 id="process-title">Kısa, sade ve net bir yolculuk.</h2>
        <p>Başvuru satış zorunluluğu doğurmaz. Otomatik fiyat göstermeyiz; teklif uzman incelemesi sonrasında belirlenir.</p>
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
      <div className="journey__nationwide">
        <div className="journey__nationwide-media">
          <Image
            src="/images/dcars-nationwide-car-selling.jpg"
            alt="Türkiye haritası üzerinde D CARS araç satış hizmet noktaları"
            width={691}
            height={848}
            sizes="(max-width: 900px) 100vw, 42vw"
          />
        </div>
        <div className="journey__nationwide-copy">
          <span>Türkiye genelinde</span>
          <h3>Aracınızı bulunduğunuz yerden değerlemeye başlayın.</h3>
          <p>Şehir bilginizi ve aracınızın özelliklerini paylaşın. Güncel hizmet kapsamı doğrulandıktan sonra ekibimiz sürecin devamı için sizinle iletişime geçsin.</p>
          <Link className="button button--primary" href="/arac-degerleme?new=1">Ücretsiz Teklif Al <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
