import Link from "@/components/layout/NativeLink";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";

const quickLinks = [["Aracımı Sat", "/aracimi-sat"], ["Satılık Araçlar", "/araclar"], ["Blog", "/blog"], ["Başvuru Kontrolü", "/basvuru-takip"], ["Nasıl Çalışır?", "/nasil-calisir"], ["S.S.S.", "/sss"], ["İletişim", "/iletisim"]] as const;
const legalLinks = [["Gizlilik Sözleşmesi", "/gizlilik-sozlesmesi"], ["Aydınlatma Metni", "/aydinlatma-metni"], ["Çerez Politikası", "/cerez-politikasi"], ["Şartlar ve Koşullar", "/sartlar-ve-kosullar"]] as const;

export function Footer() {
  return <footer className="site-footer"><div className="site-footer__top"><div className="site-footer__brand"><Logo /><p>Aracını kolayca anlat, varsa hasarı fotoğraflarla göster ve teklif talebini güvenle ilet.</p><Link href="/arac-degerleme">Ücretsiz teklif iste <ArrowUpRight size={16} /></Link></div><div><h2>Hızlı Linkler</h2><nav>{quickLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav></div><div><h2>Bağlantılar</h2><nav>{legalLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav></div><div className="site-footer__contact"><h2>İletişim</h2><p><MapPin size={16} /> İstanbul, Türkiye<br />Randevulu showroom</p><a href="mailto:info@dcars.tr"><Mail size={16} /> info@dcars.tr</a></div></div><div className="site-footer__bottom"><span>© 2026 D CARS. Tüm hakları saklıdır.</span><span>Araç satışında açık süreç</span></div></footer>;
}
