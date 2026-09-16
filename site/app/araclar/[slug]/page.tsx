import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CarFront } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { VehicleActions } from "@/components/vehicles/VehicleActions";
import { demoVehicles, formatKm, formatPrice } from "@/lib/demoVehicles";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return demoVehicles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = demoVehicles.find((item) => item.slug === slug);
  return { title: vehicle ? `${vehicle.title} | Örnek İlan | D CARS` : "Araç bulunamadı | D CARS" };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = demoVehicles.find((item) => item.slug === slug);
  if (!vehicle) notFound();
  const specs = [
    ["Marka / model", vehicle.title], ["Model yılı", String(vehicle.year)],
    ["Kilometre", formatKm(vehicle.mileageKm)], ["Kasa tipi", vehicle.body],
    ["Yakıt", vehicle.fuel], ["Vites", vehicle.transmission],
    ["Motor", vehicle.engine], ["Çekiş", vehicle.drive],
    ["Renk", vehicle.color], ["Durum", vehicle.condition],
    ["Hasar / ekspertiz", vehicle.damage],
  ];
  return <><Navbar /><main className="content-page vehicle-detail">
    <div className="vehicle-detail__top"><Link href="/araclar"><ArrowLeft size={16} /> Satılık araçlara dön</Link><span>ÖRNEK İLAN · GERÇEK STOK DEĞİL</span></div>
    <div className="vehicle-detail__layout">
      <section className="vehicle-detail__main">
        <div className="vehicle-detail__media">{vehicle.image ? <Image src={vehicle.image} alt={vehicle.imageAlt ?? vehicle.title} fill priority sizes="(max-width: 900px) 100vw, 65vw" /> : <span className="vehicle-media-placeholder"><CarFront size={64} strokeWidth={1.1} /><strong>{vehicle.title}</strong><small>Fotoğraf panelden eklenecek</small></span>}</div>
        <div className="vehicle-detail__content"><span className="vehicle-eyebrow">ARAÇ BİLGİLERİ</span><h2>Teknik özellikler</h2><table className="vehicle-spec-table vehicle-spec-table--detail"><tbody>{specs.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table><p>Bu sayfadaki bütün araç bilgileri ve fiyat tasarım amaçlı örnektir. Gerçek ilanlarda doğrulanmış veriler ve varsa ekspertiz raporu paylaşılacaktır.</p></div>
      </section>
      <aside className="vehicle-detail__aside"><span className="vehicle-eyebrow">ÖRNEK İLAN</span><h1>{vehicle.title}</h1><p>{vehicle.description}</p><div className="vehicle-detail__price"><small>ÖRNEK FİYAT</small><strong>{formatPrice(vehicle.priceTry)}</strong></div><dl><div><dt>Yıl</dt><dd>{vehicle.year}</dd></div><div><dt>Km</dt><dd>{formatKm(vehicle.mileageKm)}</dd></div><div><dt>Yakıt / vites</dt><dd>{vehicle.fuel} · {vehicle.transmission}</dd></div></dl><VehicleActions vehicleId={vehicle.slug} title={vehicle.title} /><Link className="button button--primary" href={`/iletisim?arac=${vehicle.slug}`}>Güncel araçları sor <ArrowUpRight size={17} /></Link><small className="vehicle-detail__disclaimer">Bu örnek araç için stok veya satış sözü verilmez.</small></aside>
    </div>
  </main></>;
}
