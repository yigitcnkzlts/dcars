"use client";

import { ArrowLeftRight, Gauge, Leaf, Luggage, Scale } from "lucide-react";
import { useState } from "react";
import { technicalSpecsFor } from "@/data/vehicle-catalog/technical-specs";
import { verifiedVariants, type VehicleVariant } from "@/data/vehicle-catalog/variants";

const carKey = (car: VehicleVariant) => [car.year, car.brand, car.model, car.engine, car.transmission, car.trim].join("|");
const cars = [...new Map(verifiedVariants.map((car) => [carKey(car), car])).values()];
const unique = <T,>(items: T[]) => [...new Set(items)];

function VehiclePicker({ title, value, onChange }: { title: string; value: number; onChange: (value: number) => void }) {
  const car = cars[value] ?? cars[0];
  const years = unique(cars.map((item) => item.year)).sort((a, b) => b - a);
  const brands = unique(cars.filter((item) => item.year === car.year).map((item) => item.brand)).sort();
  const models = unique(cars.filter((item) => item.year === car.year && item.brand === car.brand).map((item) => item.model)).sort();
  const versions = cars.map((item, index) => ({ item, index })).filter(({ item }) => item.year === car.year && item.brand === car.brand && item.model === car.model);
  const choose = (predicate: (item: VehicleVariant) => boolean) => {
    const index = cars.findIndex(predicate);
    if (index >= 0) onChange(index);
  };

  return <fieldset className="comparison-picker">
    <legend>{title}</legend>
    <div className="comparison-picker-fields">
      <label><span>Yıl</span><select value={car.year} onChange={(event) => {
        const year = Number(event.target.value);
        choose((item) => item.year === year);
      }}>{years.map((year) => <option key={year}>{year}</option>)}</select></label>
      <label><span>Marka</span><select value={car.brand} onChange={(event) => {
        const brand = event.target.value;
        choose((item) => item.year === car.year && item.brand === brand);
      }}>{brands.map((brand) => <option key={brand}>{brand}</option>)}</select></label>
      <label><span>Model</span><select value={car.model} onChange={(event) => {
        const model = event.target.value;
        choose((item) => item.year === car.year && item.brand === car.brand && item.model === model);
      }}>{models.map((model) => <option key={model}>{model}</option>)}</select></label>
      <label className="comparison-picker-version"><span>Motor, vites ve paket</span><select value={value} onChange={(event) => onChange(Number(event.target.value))}>{versions.map(({ item, index }) => <option key={carKey(item)} value={index}>{item.engine} · {item.transmission} · {item.trim}</option>)}</select></label>
    </div>
  </fieldset>;
}

const show = (value: string | number | undefined, suffix = "") => value === undefined || value === "" ? "Kaynakta belirtilmemiş" : `${value}${suffix}`;
const firstNumber = (value: string | number | undefined) => {
  if (typeof value === "number") return value;
  const match = value?.match(/[\d.,]+/);
  return match ? Number(match[0].replace(".", "").replace(",", ".")) : undefined;
};

type ComparisonRow = {
  label: string;
  section: "Öne çıkanlar" | "Motor ve performans" | "Boyut ve kullanım";
  value: (car: VehicleVariant, index: number) => string;
  score?: (car: VehicleVariant, index: number) => number | undefined;
  lowerWins?: boolean;
};

export function VehicleComparison() {
  const sedanIndex = cars.findIndex((car) => car.year === 2026 && car.brand === "Toyota" && car.model === "Corolla");
  const suvIndex = cars.findIndex((car) => car.year === 2026 && car.brand === "Nissan" && car.model === "Qashqai" && !car.trim.includes("4x4"));
  const [left, setLeft] = useState(Math.max(0, sedanIndex));
  const [right, setRight] = useState(suvIndex >= 0 ? suvIndex : Math.min(1, cars.length - 1));
  if (!cars.length) return null;

  const selected = [cars[left], cars[right]];
  const specs = selected.map(technicalSpecsFor);
  const rows: ComparisonRow[] = [
    { section: "Öne çıkanlar", label: "Güç", value: (car, index) => show(specs[index].powerHp ?? car.powerHp, " HP"), score: (car, index) => specs[index].powerHp ?? car.powerHp },
    { section: "Öne çıkanlar", label: "Tork", value: (_car, index) => show(specs[index].torqueNm), score: (_car, index) => firstNumber(specs[index].torqueNm) },
    { section: "Öne çıkanlar", label: "Tüketim (WLTP)", value: (_car, index) => show(specs[index].combinedConsumption), score: (_car, index) => firstNumber(specs[index].combinedConsumption), lowerWins: true },
    { section: "Öne çıkanlar", label: "0–100 km/sa", value: (_car, index) => show(specs[index].acceleration0100), score: (_car, index) => firstNumber(specs[index].acceleration0100), lowerWins: true },
    { section: "Öne çıkanlar", label: "Bagaj hacmi", value: (_car, index) => show(specs[index].cargoLiters), score: (_car, index) => firstNumber(specs[index].cargoLiters) },
    { section: "Motor ve performans", label: "Motor", value: (car) => car.engine },
    { section: "Motor ve performans", label: "Yakıt", value: (car) => car.fuelType },
    { section: "Motor ve performans", label: "Vites", value: (car) => car.transmission },
    { section: "Motor ve performans", label: "Çekiş", value: (car, index) => show(specs[index].driveType ?? car.driveType) },
    { section: "Motor ve performans", label: "Azami hız", value: (_car, index) => show(specs[index].topSpeedKph, " km/sa"), score: (_car, index) => specs[index].topSpeedKph },
    { section: "Motor ve performans", label: "CO₂ (WLTP)", value: (_car, index) => show(specs[index].co2Gkm), score: (_car, index) => firstNumber(specs[index].co2Gkm), lowerWins: true },
    { section: "Boyut ve kullanım", label: "Gövde tipi", value: (car, index) => show(specs[index].bodyType ?? car.bodyType) },
    { section: "Boyut ve kullanım", label: "Uzunluk", value: (_car, index) => show(specs[index].lengthMm, " mm") },
    { section: "Boyut ve kullanım", label: "Genişlik", value: (_car, index) => show(specs[index].widthMm, " mm") },
    { section: "Boyut ve kullanım", label: "Yükseklik", value: (_car, index) => show(specs[index].heightMm, " mm") },
    { section: "Boyut ve kullanım", label: "Aks mesafesi", value: (_car, index) => show(specs[index].wheelbaseMm, " mm") },
    { section: "Boyut ve kullanım", label: "Boş ağırlık", value: (_car, index) => show(specs[index].curbWeightKg) },
    { section: "Boyut ve kullanım", label: "Yakıt deposu", value: (_car, index) => show(specs[index].fuelTankLiters, " lt") },
    { section: "Boyut ve kullanım", label: "Koltuk", value: (_car, index) => show(specs[index].seats) },
  ];

  const winner = (values: Array<number | undefined>, lowerWins = false) => {
    if (values.some((value) => value === undefined) || values[0] === values[1]) return -1;
    return lowerWins ? (values[0]! < values[1]! ? 0 : 1) : (values[0]! > values[1]! ? 0 : 1);
  };
  const performanceWinner = winner(specs.map((spec, index) => spec.powerHp ?? selected[index].powerHp));
  const economyWinner = winner(specs.map((spec) => firstNumber(spec.combinedConsumption)), true);
  const familyWinner = winner(specs.map((spec) => firstNumber(spec.cargoLiters)));
  const badges = [
    { label: "Performans", icon: Gauge, index: performanceWinner },
    { label: "Ekonomi", icon: Leaf, index: economyWinner },
    { label: "Aile kullanımı", icon: Luggage, index: familyWinner },
  ];
  const winnerName = (index: number) => index < 0 ? "Berabere" : `${selected[index].brand} ${selected[index].model}`;
  const summaryParts = badges.filter((badge) => badge.index >= 0).map((badge) => `${winnerName(badge.index)} ${badge.label.toLocaleLowerCase("tr-TR")} tarafında öne çıkıyor`);

  const completeDimensions = specs.every((spec) => spec.lengthMm && spec.widthMm && spec.heightMm);
  const dimensionSummary = completeDimensions
    ? `${selected[0].brand} ${selected[0].model}, ${selected[1].brand} ${selected[1].model}'den ${Math.abs(specs[0].lengthMm! - specs[1].lengthMm!)} mm ${specs[0].lengthMm! > specs[1].lengthMm! ? "daha uzun" : "daha kısa"}; ${Math.abs(specs[0].widthMm! - specs[1].widthMm!)} mm ${specs[0].widthMm! > specs[1].widthMm! ? "daha geniş" : "daha dar"} ve ${Math.abs(specs[0].heightMm! - specs[1].heightMm!)} mm ${specs[0].heightMm! > specs[1].heightMm! ? "daha yüksek" : "daha alçak"}.`
    : null;

  return <section className="vehicle-comparison" aria-label="Araçları karşılaştır">
    <div className="comparison-title"><Scale size={17} /><strong>Kaynaklı araç karşılaştırması</strong></div>
    <p>Yıl, marka, model ve versiyon seçin. Yalnızca doğrulanmış katalog kayıtları listelenir.</p>
    {sedanIndex >= 0 && suvIndex >= 0 && <button className="comparison-preset" type="button" onClick={() => { setLeft(sedanIndex); setRight(suvIndex); }}><ArrowLeftRight size={14} /> SUV ile sedanı karşılaştır</button>}
    <div className="comparison-pickers"><VehiclePicker title="Birinci araç" value={left} onChange={setLeft} /><VehiclePicker title="İkinci araç" value={right} onChange={setRight} /></div>
    <div className="comparison-badges" aria-label="Karşılaştırma kazananları">{badges.map(({ label, icon: Icon, index }) => <div className="comparison-badge" key={label}><Icon size={16} /><span>{label}<strong>{winnerName(index)}</strong></span></div>)}</div>
    {summaryParts.length > 0 && <div className="comparison-summary"><strong>Kısa sonuç</strong><span>{summaryParts.join("; ")}.</span></div>}
    {dimensionSummary && <div className="comparison-insight"><strong>{specs[0].bodyType} / {specs[1].bodyType}</strong><span>{dimensionSummary}</span></div>}
    <div className="comparison-table" role="table" aria-label="Teknik karşılaştırma">
      <div className="comparison-row comparison-row--head" role="row"><span role="columnheader">Özellik</span>{selected.map((car) => <strong role="columnheader" key={carKey(car)}>{car.brand} {car.model}<small>{car.year} · {car.trim}</small></strong>)}</div>
      {rows.map((row, rowIndex) => {
        const isNewSection = rowIndex === 0 || rows[rowIndex - 1].section !== row.section;
        const winningIndex = row.score ? winner(selected.map(row.score), row.lowerWins) : -1;
        return <div key={row.label}>{isNewSection && <div className="comparison-section">{row.section}</div>}<div className="comparison-row" role="row"><span role="rowheader">{row.label}</span>{selected.map((car, index) => <span className={winningIndex === index ? "comparison-winner" : undefined} role="cell" key={`${carKey(car)}-${row.label}`}>{row.value(car, index)}</span>)}</div></div>;
      })}
    </div>
    <div className="comparison-sources">{selected.map((car, index) => <a key={carKey(car)} href={specs[index].sourceUrl ?? car.sourceUrl} target="_blank" rel="noopener noreferrer">{index + 1}. araç üretici kaynağı ↗</a>)}</div>
    <p>Ölçüler ve performans değerleri üretici kataloglarından alınır. Versiyona göre değişen değerler aralık olarak gösterilir.</p>
  </section>;
}
