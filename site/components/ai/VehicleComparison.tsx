"use client";

import { Scale } from "lucide-react";
import { useState } from "react";
import { verifiedVariants, type VehicleVariant } from "@/data/vehicle-catalog/variants";

const label = (car: VehicleVariant) => `${car.year} ${car.brand} ${car.model} · ${car.engine} · ${car.transmission} · ${car.trim}`;
const cars = [...new Map(verifiedVariants.map((car) => [label(car), car])).values()];
const technicalSource = (car: VehicleVariant) => car.year === 2026 && car.brand === "Nissan" && car.model === "Qashqai"
  ? "https://www.nissan.com.tr/content/dam/Nissan/turkey/brochures/NISSAN_QASHQAI_BROSUR_260211_WEB.pdf"
  : car.sourceUrl;

function boot(car: VehicleVariant): string {
  if ([2024, 2026].includes(car.year) && car.brand === "Toyota" && car.model === "Corolla") return "471 lt";
  if (car.year === 2026 && car.brand === "Nissan" && car.model === "Qashqai") return "455–504 lt (donanıma göre)";
  return "Doğrulanmış veri bekleniyor";
}

function consumption(car: VehicleVariant): string {
  if (car.year === 2026 && car.brand === "Toyota" && car.model === "Corolla" && car.engine === "1.5 L") return "6,1–6,3 lt/100 km (WLTP birleşik)";
  if (car.year === 2026 && car.brand === "Nissan" && car.model === "Qashqai") {
    return car.trim.includes("4x4") ? "7,0 lt/100 km (WLTP birleşik)" : "6,4 lt/100 km (WLTP birleşik)";
  }
  return "Doğrulanmış veri bekleniyor";
}

function equipment(car: VehicleVariant): string {
  if (car.factoryEquipment.length) return car.factoryEquipment.join(", ");
  if (car.year === 2026 && car.brand === "Nissan" && car.model === "Qashqai") {
    if (car.trim.startsWith("Designpack")) return "215/65 R17 lastik";
    if (car.trim.startsWith("Skypack")) return "235/55 R18 lastik";
    if (car.trim.startsWith("Platinum Premium")) return "235/45 R20 lastik";
    if (car.trim.startsWith("Platinum")) return "235/50 R19 lastik";
  }
  return "Paket bazında doğrulanmış veri bekleniyor";
}

export function VehicleComparison() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(Math.min(1, cars.length - 1));
  if (!cars.length) return null;
  const selected = [cars[left], cars[right]];
  const rows = [
    ["Motor", (car: VehicleVariant) => car.engine],
    ["Yakıt", (car: VehicleVariant) => car.fuelType],
    ["Vites", (car: VehicleVariant) => car.transmission],
    ["Paket", (car: VehicleVariant) => car.trim],
    ["Bagaj", boot],
    ["Tüketim (WLTP)", consumption],
    ["Doğrulanmış donanım", equipment],
  ] as const;
  return <section className="vehicle-comparison" aria-label="Araçları karşılaştır"><div className="comparison-title"><Scale size={17} /><strong>Kaynaklı araç karşılaştırması</strong></div><p>Yıl, motor ve paket seçin. Yalnızca doğrulanmış katalog kayıtları listelenir.</p><div className="comparison-pickers">{[left, right].map((value, index) => <label key={index}><span>{index === 0 ? "Birinci araç" : "İkinci araç"}</span><select aria-label={index === 0 ? "Birinci araç" : "İkinci araç"} value={value} onChange={(event) => (index === 0 ? setLeft : setRight)(Number(event.target.value))}>{cars.map((car, optionIndex) => <option key={label(car)} value={optionIndex}>{label(car)}</option>)}</select></label>)}</div><div className="comparison-table" role="table" aria-label="Teknik karşılaştırma"><div className="comparison-row comparison-row--head" role="row"><span role="columnheader">Özellik</span>{selected.map((car, index) => <strong role="columnheader" key={index}>{car.brand} {car.model}<small>{car.year} · {car.trim}</small></strong>)}</div>{rows.map(([name, value]) => <div className="comparison-row" role="row" key={name}><span role="rowheader">{name}</span>{selected.map((car, index) => <span role="cell" key={index}>{value(car)}</span>)}</div>)}</div><div className="comparison-sources">{selected.map((car, index) => <a key={index} href={technicalSource(car)} target="_blank" rel="noopener noreferrer">{index + 1}. araç üretici kaynağı ↗</a>)}</div><p>Fabrika değerleri gerçek kullanımda değişebilir. Kaynakta doğrulanmayan paket donanımı gösterilmez.</p></section>;
}
