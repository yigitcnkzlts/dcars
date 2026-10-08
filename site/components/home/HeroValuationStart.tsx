"use client";

import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import Link from "@/components/layout/NativeLink";
import { vehicleBrands } from "@/services/vehicleDataService";

export function HeroValuationStart() {
  const [year, setYear] = useState("");
  const [brand, setBrand] = useState("");
  const years = Array.from({ length: new Date().getFullYear() + 2 - 1985 }, (_, index) => new Date().getFullYear() + 1 - index);
  const validBrand = vehicleBrands.some((item) => item.name === brand);
  const href = year && validBrand ? `/arac-degerleme?new=1&year=${year}&brand=${encodeURIComponent(brand)}` : "#hero-valuation";

  return <div className="hero-start" id="hero-valuation">
    <label><span>Model Yılı</span><select value={year} onChange={(event) => setYear(event.target.value)}><option value="">Yıl seçin</option>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Marka</span><div className="hero-brand-input"><Search size={17} aria-hidden="true" /><input list="hero-brands" value={brand} onChange={(event) => setBrand(event.target.value)} placeholder="Marka ara veya seç" autoComplete="off" /></div><datalist id="hero-brands">{vehicleBrands.map((item) => <option key={item.name} value={item.name} />)}</datalist></label>
    <Link className={`button button--primary${!year || !validBrand ? " is-disabled" : ""}`} href={href} aria-disabled={!year || !validBrand} onClick={(event) => { if (!year || !validBrand) event.preventDefault(); }}>Ücretsiz Teklif Al <ArrowRight size={18} /></Link>
  </div>;
}
