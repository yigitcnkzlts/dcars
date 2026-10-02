"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "@/components/layout/NativeLink";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";

const quickLinks = [["Aracımı Değerle", "/arac-degerleme?new=1"], ["Satılık Araçlar", "/araclar"], ["Blog", "/blog"], ["Başvuru Kontrolü", "/basvuru-takip"], ["S.S.S.", "/sss"], ["İletişim", "/iletisim"]] as const;
const legalLinks = [["Gizlilik Sözleşmesi", "/gizlilik-sozlesmesi"], ["Aydınlatma Metni", "/aydinlatma-metni"], ["Çerez Politikası", "/cerez-politikasi"], ["Şartlar ve Koşullar", "/sartlar-ve-kosullar"]] as const;

export function Footer() {
  const reduceMotion = useReducedMotion();
  const reveal = (index: number) => ({ initial: reduceMotion ? false as const : { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.1 }, transition: { duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.055, ease: [0.22, 1, 0.36, 1] as const } });
  return <footer className="site-footer"><div className="site-footer__top"><motion.div className="site-footer__brand" {...reveal(0)}><Logo /><p>Araç bilgilerinizi paylaşın. D CARS aracınızı değerlendirerek sonraki adımları sizinle planlasın.</p><Link href="/arac-degerleme?new=1">Ücretsiz Teklif Al <ArrowUpRight size={16} /></Link></motion.div><motion.div {...reveal(1)}><h2>Hızlı Linkler</h2><nav>{quickLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav></motion.div><motion.div {...reveal(2)}><h2>Bağlantılar</h2><nav>{legalLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav></motion.div><motion.div className="site-footer__contact" {...reveal(3)}><h2>İletişim</h2><p><MapPin size={16} /> İstanbul, Türkiye</p><a href="mailto:info@dcars.tr"><Mail size={16} /> info@dcars.tr</a><a href="https://www.instagram.com/dcars.tr" target="_blank" rel="noopener noreferrer">Instagram: dcars.tr</a></motion.div></div><motion.div className="site-footer__bottom" {...reveal(2)}><span>© 2026 D CARS. Tüm hakları saklıdır.</span><span>Araç satışında açık süreç</span></motion.div></footer>;
}
