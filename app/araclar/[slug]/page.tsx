import type { Metadata } from "next";
import Link from "@/components/layout/NativeLink";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { VehicleActions } from "@/components/vehicles/VehicleActions";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { demoVehicles, formatKm, formatPrice } from "@/lib/demoVehicles";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return demoVehicles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = demoVehicles.find((item) => item.slug === slug);
  return vehicle ? { title: `${vehicle.title} | Satılık Araç`, description: vehicle.description, robots: { index: false, follow: false }, openGraph: { title: `${vehicle.title} | D CARS`, description: vehicle.description, images: vehicle.images[0]?.url ? [vehicle.images[0].url] : undefined } } : { title: "Araç bulunamadı" };
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
        <VehicleGallery title={vehicle.title} images={vehicle.images} />
        <div className="vehicle-detail__content">
          <section className="vehicle-description"><span className="vehicle-eyebrow">ARAÇ HAKKINDA</span><h2>{vehicle.title} hakkında</h2>{vehicle.longDescription.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
          <section><span className="vehicle-eyebrow">ÖNE ÇIKANLAR</span><h2>Öne çıkan özellikler</h2><ul className="vehicle-feature-list">{vehicle.highlights.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></section>
          <section><span className="vehicle-eyebrow">ARAÇ BİLGİLERİ</span><h2>Teknik özellikler</h2><table className="vehicle-spec-table vehicle-spec-table--detail"><tbody>{[...specs, ...vehicle.technicalDetails.map(({ label, value }) => [label, value])].map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table></section>
          <section><span className="vehicle-eyebrow">DONANIM</span><h2>Donanım ve konfor</h2><ul className="vehicle-equipment-list">{vehicle.equipment.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="vehicle-seller-notes"><span className="vehicle-eyebrow">İLAN NOTU</span><h2>Açıklama ve ekspertiz notu</h2><p>{vehicle.sellerNotes}</p></section>
          <p className="vehicle-demo-disclaimer">Bu sayfadaki bilgiler ve fiyat tasarım amaçlı örnektir. Gerçek ilanda doğrulanmış veriler ve ekspertiz raporu paylaşılacaktır.</p>
        </div>
      </section>
      <aside className="vehicle-detail__aside"><span className="vehicle-eyebrow">ÖRNEK İLAN</span><h1>{vehicle.title}</h1><p>{vehicle.description}</p><div className="vehicle-detail__price"><small>ÖRNEK FİYAT</small><strong>{formatPrice(vehicle.priceTry)}</strong></div><dl><div><dt>Yıl</dt><dd>{vehicle.year}</dd></div><div><dt>Km</dt><dd>{formatKm(vehicle.mileageKm)}</dd></div><div><dt>Yakıt / vites</dt><dd>{vehicle.fuel} · {vehicle.transmission}</dd></div></dl><VehicleActions vehicleId={vehicle.slug} title={vehicle.title} /><Link className="button button--primary" href={`/iletisim?arac=${vehicle.slug}`}>Güncel araçları sor <ArrowUpRight size={17} /></Link><small className="vehicle-detail__disclaimer">Bu örnek araç için stok veya satış sözü verilmez.</small></aside>
    </div>
  </main></>;
}
