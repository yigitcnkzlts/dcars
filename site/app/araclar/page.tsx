import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/layout/NativeLink";
import { ArrowUpRight, CarFront } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { demoVehicles, formatKm, formatPrice } from "@/lib/demoVehicles";

export const metadata: Metadata = {
  title: "Araç Vitrini",
  robots: { index: false, follow: false },
  description: "D CARS araç vitrini. Şu an gösterilen üç ilan örnektir; güncel satış ve stok bilgisi için iletişime geçin.",
};

export default function VehiclesPage() {
  return <><Navbar /><main className="content-page vehicle-catalog">
    <header className="vehicle-catalog__header">
      <div><span className="vehicle-eyebrow">D CARS ARAÇ VİTRİNİ</span><h1>Satılık Araçlar</h1><p>Aracın temel bilgilerini bir bakışta görün, detay sayfasında tüm özellikleri inceleyin.</p></div>
      <div className="vehicle-demo-notice"><strong>3 örnek ilan</strong><span>Bu araçlar tasarım demosudur. Fiyat, kilometre, donanım ve stok bilgileri gerçek ilan değildir.</span></div>
    </header>
    <section className="vehicle-catalog__list" aria-label="Örnek araçlar">
      {demoVehicles.map((vehicle) => <article className="vehicle-card" key={vehicle.slug}>
        <Link className="vehicle-card__media" href={`/araclar/${vehicle.slug}`} aria-label={`${vehicle.title} örnek ilanını incele`}>
          {vehicle.images[0]?.url ? <Image src={vehicle.images[0].url} alt={vehicle.images[0].alt} fill sizes="(max-width: 780px) 100vw, 36vw" /> : <span className="vehicle-media-placeholder"><CarFront size={48} strokeWidth={1.1} /><strong>{vehicle.title}</strong><small>10 görsellik galeri hazır</small></span>}
          <span className="vehicle-card__badge">ÖRNEK İLAN</span>
        </Link>
        <div className="vehicle-card__body">
          <div className="vehicle-card__heading"><div><span>{vehicle.year} · {vehicle.body}</span><h2><Link href={`/araclar/${vehicle.slug}`}>{vehicle.title}</Link></h2></div><div className="vehicle-card__price"><small>ÖRNEK FİYAT</small><strong>{formatPrice(vehicle.priceTry)}</strong></div></div>
          <table className="vehicle-spec-table"><tbody>
            <tr><th scope="row">Kilometre</th><td>{formatKm(vehicle.mileageKm)}</td></tr>
            <tr><th scope="row">Yakıt</th><td>{vehicle.fuel}</td></tr>
            <tr><th scope="row">Vites</th><td>{vehicle.transmission}</td></tr>
            <tr><th scope="row">Renk</th><td>{vehicle.color}</td></tr>
          </tbody></table>
          <p className="vehicle-card__description">{vehicle.description}</p>
          <div className="vehicle-card__highlights">{vehicle.highlights.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
          <Link className="vehicle-card__link" href={`/araclar/${vehicle.slug}`}>Tüm bilgileri incele <ArrowUpRight size={17} /></Link>
        </div>
      </article>)}
    </section>
    <aside className="vehicle-catalog__footnote">Her araçta 10 görsellik galeri, ayrıntılı açıklama, donanım listesi, teknik bilgiler ve ekspertiz notları için hazır alan bulunur.</aside>
  </main></>;
}
