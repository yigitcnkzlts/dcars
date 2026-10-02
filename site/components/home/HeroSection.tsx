"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "@/components/layout/NativeLink";
import Image from "next/image";
import { vehicleBrands } from "@/services/vehicleDataService";

const draftKey = "dcars-detailed-valuation-v1";
const years = Array.from({ length: 25 }, (_, index) => new Date().getFullYear() + 1 - index);

export function HeroSection() {
  const router = useRouter();
  const [year, setYear] = useState("");
  const [brand, setBrand] = useState("");

  const startValuation = (event: FormEvent) => {
    event.preventDefault();
    try {
      const current = JSON.parse(localStorage.getItem(draftKey) || "{}") as { selection?: Record<string, unknown> };
      localStorage.setItem(draftKey, JSON.stringify({
        ...current,
        selection: {
          ...(current.selection ?? {}),
          ...(year ? { year: Number(year) } : {}),
          ...(brand ? { brand } : {}),
        },
        mileage: current.mileage ?? "",
        color: current.color ?? "",
        accidentStatus: current.accidentStatus ?? "",
        damageAmount: current.damageAmount ?? "",
        inspection: current.inspection,
        optionalEquipment: current.optionalEquipment ?? [],
      }));
    } catch { /* Draft is optional; the valuation page still starts empty. */ }
    router.push("/arac-degerleme");
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow">D CARS · Ücretsiz ön değerleme</p>
        <h1 id="hero-title">Aracınızın değerini öğrenin, teklifinizi değerlendirin.</h1>
        <p>Araç bilgilerinizi paylaşın. D CARS aracınızı değerlendirerek sonraki adımları sizinle planlasın.</p>
        <Link className="button button--primary" href="/arac-degerleme">Ücretsiz Teklif Al <ArrowRight size={17} /></Link>
        <form className="hero-start" onSubmit={startValuation}>
          <label>
            <span>Model yılı</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="">Seçin</option>
              {years.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>Marka</span>
            <select value={brand} onChange={(event) => setBrand(event.target.value)}>
              <option value="">Seçin</option>
              {vehicleBrands.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>
          </label>
          <button className="button button--primary" type="submit">Değerlemeye başla</button>
        </form>
      </div>
      <div className="hero__visual">
        <Image src="/images/q8-cutout.png" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" priority style={{ objectFit: "contain", objectPosition: "right center" }} />
      </div>
    </section>
  );
}
