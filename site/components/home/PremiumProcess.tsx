import { ArrowUpRight, BadgeCheck, CarFront, CircleDollarSign, ScanSearch } from "lucide-react";
import Link from "@/components/layout/NativeLink";

const steps = [
  [ScanSearch, "01", "Bilgileri paylaşın", "Yıl, marka, model ve kilometreyi girin; hasar varsa açıklama ve fotoğraf ekleyin."],
  [BadgeCheck, "02", "İnceleme ve teklif", "Başvurunuz incelenir. Araç durumu doğrulandıktan sonra teklif koşulları sizinle paylaşılır."],
  [CircleDollarSign, "03", "Karar ve devir", "Teklifi kabul ederseniz ödeme, noter ve teslim adımları birlikte planlanır."],
] as const;

export function PremiumProcess() {
  return (
    <section className="premium-process" aria-labelledby="process-title">
      <div className="process-heading">
        <div><span className="section-index">02 — SATIŞ SÜRECİ</span><h2 id="process-title">Tekliften satışa<br /><em>adım adım.</em></h2></div>
        <div><p>Başvurudan sonra ne olacağını bilin. Teklif bağlayıcı değildir; satış kararı sizindir.</p><Link href="/nasil-calisir">Süreci inceleyin <ArrowUpRight size={17} /></Link></div>
      </div>
      <div className="process-grid">
        {steps.map(([Icon, number, title, detail]) => <article className="process-card" key={number}><div className="process-card__top"><Icon size={23} /><span>{number}</span></div><h3>{title}</h3><p>{detail}</p></article>)}
        <article className="process-card process-card--accent"><CarFront size={28} /><span>ÜCRETSİZ BAŞVURU</span><strong>Aracın için<br />teklif iste.</strong><Link href="/arac-degerleme">Başvuruyu başlat <ArrowUpRight size={17} /></Link></article>
      </div>
    </section>
  );
}
