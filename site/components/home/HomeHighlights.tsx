"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, ScanSearch, ShieldCheck } from "lucide-react";
import Link from "@/components/layout/NativeLink";

const highlights = [
  [ScanSearch, "Kısa başvuru", "Araç bilgilerini birkaç adımda paylaşın. Bildiğiniz hasarları ve beklediğiniz fiyatı da ekleyebilirsiniz."],
  [BadgeCheck, "Fotoğraflarla açık bilgi", "Kazalı veya boyalı bölgeleri fotoğraflarla gösterebilirsiniz. Böylece ilk görüşme daha somut bilgilerle başlar."],
  [ShieldCheck, "Karar sizde", "İncelemeden sonra iletilen teklifi değerlendirirsiniz. Uygun bulursanız ödeme ve devir adımlarına geçilir."],
] as const;

export function HomeHighlights() {
  const reduceMotion = useReducedMotion();
  const viewport = { once: true, amount: 0.2 };
  const gridVariants = { hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } } };
  const cardVariants = { hidden: reduceMotion ? {} : { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] as const } } };
  return <section className="home-highlights" aria-labelledby="highlights-title"><motion.div className="home-highlights__heading" initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}><span>04 — SATIŞ DENEYİMİ</span><h2 id="highlights-title">Aracını anlat.<br /><em>Kararını rahat ver.</em></h2><Link href="/aracimi-sat">Satış adımlarını incele <ArrowUpRight size={17} /></Link></motion.div><motion.div className="home-highlights__grid" variants={gridVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }}>{highlights.map(([Icon, title, text], index) => <motion.article key={title} variants={cardVariants}><div><small>0{index + 1}</small><Icon size={24} /></div><h3>{title}</h3><p>{text}</p></motion.article>)}</motion.div></section>;
}
