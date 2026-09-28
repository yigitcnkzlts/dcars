"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, CarFront, CircleDollarSign, ScanSearch } from "lucide-react";
import Link from "@/components/layout/NativeLink";

const steps = [
  [ScanSearch, "01", "Bilgileri paylaşın", "Yıl, marka, model ve kilometreyi girin; hasar varsa açıklama ve fotoğraf ekleyin."],
  [BadgeCheck, "02", "İnceleme ve teklif", "Başvurunuz incelenir. Araç durumu doğrulandıktan sonra teklif koşulları sizinle paylaşılır."],
  [CircleDollarSign, "03", "Karar ve devir", "Teklifi kabul ederseniz ödeme, noter ve teslim adımları birlikte planlanır."],
] as const;

export function PremiumProcess() {
  const reduceMotion = useReducedMotion();
  const hidden = reduceMotion ? false : { opacity: 0, y: 24 };
  const reveal = { opacity: 1, y: 0 };
  const viewport = { once: true, amount: 0.22 };
  const gridVariants = { hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.075 } } };
  const cardVariants = { hidden: reduceMotion ? {} : { opacity: 0, y: 26, scale: 0.99 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] as const } } };
  const detailVariants = { hidden: reduceMotion ? {} : { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.1 } } };

  return (
    <section className="premium-process" aria-labelledby="process-title">
      <div className="process-heading">
        <motion.div initial={hidden} whileInView={reveal} viewport={viewport} transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}><span className="section-index">02 — SATIŞ SÜRECİ</span><h2 id="process-title">Tekliften satışa<br /><em>adım adım.</em></h2></motion.div>
        <motion.div initial={hidden} whileInView={reveal} viewport={viewport} transition={{ duration: reduceMotion ? 0 : 0.58, delay: reduceMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}><p>Başvurudan sonra ne olacağını bilin. Teklif bağlayıcı değildir; satış kararı sizindir.</p><Link href="/nasil-calisir">Süreci inceleyin <ArrowUpRight size={17} /></Link></motion.div>
      </div>
      <motion.div className="process-grid" variants={gridVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }}>
        {steps.map(([Icon, number, title, detail]) => <motion.article className="process-card" key={number} variants={cardVariants}><motion.div className="process-card__top" variants={detailVariants}><Icon size={23} /><span>{number}</span></motion.div><h3>{title}</h3><p>{detail}</p></motion.article>)}
        <motion.article className="process-card process-card--accent" variants={cardVariants}><motion.div className="process-card__accent-icon" variants={detailVariants}><CarFront size={28} /></motion.div><span>ÜCRETSİZ BAŞVURU</span><strong>Aracın için<br />teklif iste.</strong><Link href="/arac-degerleme">Başvuruyu başlat <ArrowUpRight size={17} /></Link></motion.article>
      </motion.div>
    </section>
  );
}
