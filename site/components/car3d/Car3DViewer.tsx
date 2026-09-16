"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Car3DFallback } from "./Car3DFallback";
import styles from "./Car3DViewer.module.css";

const CarScene = lazy(() => import("./CarScene"));

export function Car3DViewer() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController();
    fetch("/models/car.glb", { method: "HEAD", signal: controller.signal })
      .then((response) => setAvailable(response.ok && !response.headers.get("content-type")?.includes("text/html")))
      .catch(() => { if (!controller.signal.aborted) setAvailable(false); });
    return () => controller.abort();
  }, [visible]);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="3D araç inceleme">
      <div className={styles.card}>
        <div className={styles.heading}>
          <span className={styles.kicker}>D CARS / SHOWROOM</span>
          <span className={styles.badge}>360° İncele</span>
        </div>
        <div className={styles.stage}>
          {visible && available ? <Suspense fallback={<Car3DFallback loading />}><CarScene /></Suspense> : <Car3DFallback loading={visible && available === null} />}
        </div>
        <p className={styles.hint}>Sürükleyerek aracı döndür</p>
      </div>
    </section>
  );
}
