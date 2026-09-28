"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "@/components/layout/NativeLink";
import Image from "next/image";

const wordLines = [["ARACINI", "SAT."], ["TEKLİFİNİ", "AL."]] as const;

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [parallaxEnabled, setParallaxEnabled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const carX = useSpring(pointerX, { stiffness: 95, damping: 22, mass: 0.7 });
  const carY = useSpring(pointerY, { stiffness: 95, damping: 22, mass: 0.7 });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1101px) and (hover: hover) and (pointer: fine)");
    const update = () => setParallaxEnabled(query.matches && !reduceMotion);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [reduceMotion]);

  const updateParallax = (event: PointerEvent<HTMLElement>) => {
    if (!parallaxEnabled || !heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    pointerX.set((((event.clientX - bounds.left) / bounds.width) - 0.5) * 20);
    pointerY.set((((event.clientY - bounds.top) / bounds.height) - 0.5) * 14);
  };

  const resetParallax = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section ref={heroRef} className="hero" aria-labelledby="hero-title" onPointerMove={updateParallax} onPointerLeave={resetParallax}>
      <div className="hero__ambient" aria-hidden="true" />
      <div className="hero__copy">
        <motion.div className="eyebrow" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}><span /> Aracını satmak isteyenler için</motion.div>
        <h1 id="hero-title" aria-label="Aracını sat. Teklifini al.">{wordLines.map((line, lineIndex) => <span className="hero__title-line" key={lineIndex} aria-hidden="true">{line.map((word, wordIndex) => { const index = lineIndex * 2 + wordIndex; return <span className="hero__word-mask" key={word}><motion.span className={lineIndex === 1 ? "hero__word hero__word--muted" : "hero__word"} initial={reduceMotion ? false : { opacity: 0, y: "105%" }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.18 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}>{word}</motion.span></span>; })}</span>)}</h1>
        <motion.p initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.65, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}>Aracını birkaç adımda anlat. Hasar varsa fotoğraflarını ekle. Bilgiler incelendikten sonra sana özel teklif için iletişime geçelim.</motion.p>
        <motion.div className="hero__actions" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}><Link className="button button--primary" href="/arac-degerleme">Ücretsiz teklif iste <ArrowUpRight size={17} /></Link><Link className="button button--ghost" href="/nasil-calisir">Nasıl çalışır? <ArrowDownRight size={17} /></Link></motion.div>
      </div>
      <motion.div className="hero__visual" initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: 18, y: 8 }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 1.05, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}><div className="hero__visual-glow" aria-hidden="true" /><motion.div className="hero__visual-stage" style={parallaxEnabled ? { x: carX, y: carY } : undefined}><Image src="/images/q8-cutout.png" alt="Siyah otomobil görseli" fill priority sizes="(max-width: 900px) 100vw, 55vw" style={{ objectFit: "contain" }} /></motion.div></motion.div>
      <div className="hero__meta"><div><span>01</span><strong>Araç bilgilerini paylaş</strong></div><div><span>02</span><strong>Durumu fotoğraflarla göster</strong></div><div><span>03</span><strong>Teklifi değerlendir</strong></div></div>
    </section>
  );
}
