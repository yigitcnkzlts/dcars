import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { demoVehicles } from "@/lib/demoVehicles";

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ arac?: string }> }) {
  const { arac } = await searchParams;
  const vehicle = demoVehicles.find((item) => item.slug === arac);
  const subject = vehicle ? `${vehicle.title} benzeri güncel araçlar hakkında bilgi` : "D CARS bilgi ve randevu talebi";
  const body = vehicle ? `Merhaba, ${vehicle.title} örnek ilanını gördüm. Buna benzer güncel satıştaki araçlar hakkında bilgi almak istiyorum.` : "Merhaba, araç alım / satım süreci hakkında bilgi almak istiyorum.";
  const emailHref = `mailto:info@dcars.tr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return <><Navbar /><main className="content-page"><section className="content-hero"><span>İLETİŞİM & RANDEVU</span><h1>{vehicle ? `${vehicle.title} benzeri araçları sorun.` : "Sorunuzu kolayca iletin."}</h1><p>{vehicle ? "Gördüğünüz ilan örnektir. Güncel satıştaki araçları öğrenmek için hazır mesajı gönderebilirsiniz." : "Araç alımı, satışı veya değerleme hakkındaki sorunuzu e-postayla iletebilirsiniz."}</p><a className="button button--primary" href={emailHref}>Hazır e-posta oluştur <ArrowUpRight size={17} /></a></section><section className="contact-grid"><a href={emailHref}><Mail /><span><small>E-POSTA</small><strong>info@dcars.tr</strong><small>{vehicle ? `${vehicle.title} konusu hazır` : "Sorunuzu yazın"}</small></span></a><div><MapPin /><span><small>SHOWROOM</small><strong>İstanbul, Türkiye</strong><small>Ziyaret öncesinde konum ve uygun saat bilgisini isteyin.</small></span></div></section><section className="contact-note"><span>RANDEVULU HİZMET</span><h2>Gelmeden önce bilgi alın.</h2><p>İlgilendiğiniz araç, istediğiniz görüşme zamanı ve telefon numaranızı e-postaya eklerseniz görüşmeyi planlamak kolaylaşır.</p></section></main></>;
}
