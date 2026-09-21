"use client";

import { ArrowLeftRight, Scale } from "lucide-react";
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

export function VehicleComparison() {
  const sedanIndex = cars.findIndex((car) => car.year === 2026 && car.brand === "Toyota" && car.model === "Corolla");
  const suvIndex = cars.findIndex((car) => car.year === 2026 && car.brand === "Nissan" && car.model === "Qashqai" && !car.trim.includes("4x4"));
  const [left, setLeft] = useState(Math.max(0, sedanIndex));
  const [right, setRight] = useState(suvIndex >= 0 ? suvIndex : Math.min(1, cars.length - 1));
  if (!cars.length) return null;

  const selected = [cars[left], cars[right]];
  const specs = selected.map(technicalSpecsFor);
  const rows: Array<[string, (car: VehicleVariant, index: number) => string]> = [
    ["Gövde tipi", (car, index) => show(specs[index].bodyType ?? car.bodyType)],
    ["Motor", (car) => car.engine],
    ["Güç", (car, index) => show(specs[index].powerHp ?? car.powerHp, " HP")],
    ["Tork", (_car, index) => show(specs[index].torqueNm)],
    ["Yakıt", (car) => car.fuelType],
    ["Vites", (car) => car.transmission],
    ["Çekiş", (car, index) => show(specs[index].driveType ?? car.driveType)],
    ["Paket", (car) => car.trim],
    ["Uzunluk", (_car, index) => show(specs[index].lengthMm, " mm")],
    ["Genişlik", (_car, index) => show(specs[index].widthMm, " mm")],
    ["Yükseklik", (_car, index) => show(specs[index].heightMm, " mm")],
    ["Aks mesafesi", (_car, index) => show(specs[index].wheelbaseMm, " mm")],
    ["Bagaj", (_car, index) => show(specs[index].cargoLiters)],
    ["Boş ağırlık", (_car, index) => show(specs[index].curbWeightKg)],
    ["0–100 km/sa", (_car, index) => show(specs[index].acceleration0100)],
    ["Azami hız", (_car, index) => show(specs[index].topSpeedKph, " km/sa")],
    ["Tüketim (WLTP)", (_car, index) => show(specs[index].combinedConsumption)],
    ["CO₂ (WLTP)", (_car, index) => show(specs[index].co2Gkm)],
    ["Yakıt deposu", (_car, index) => show(specs[index].fuelTankLiters, " lt")],
    ["Koltuk", (_car, index) => show(specs[index].seats)],
  ];

  const completeDimensions = specs.every((spec) => spec.lengthMm && spec.widthMm && spec.heightMm);
  const dimensionSummary = completeDimensions
    ? `${selected[0].brand} ${selected[0].model}, ${selected[1].brand} ${selected[1].model}'den ${Math.abs(specs[0].lengthMm! - specs[1].lengthMm!)} mm ${specs[0].lengthMm! > specs[1].lengthMm! ? "daha uzun" : "daha kısa"}; ${Math.abs(specs[0].widthMm! - specs[1].widthMm!)} mm ${specs[0].widthMm! > specs[1].widthMm! ? "daha geniş" : "daha dar"} ve ${Math.abs(specs[0].heightMm! - specs[1].heightMm!)} mm ${specs[0].heightMm! > specs[1].heightMm! ? "daha yüksek" : "daha alçak"}.`
    : null;

  return <section className="vehicle-comparison" aria-label="Araçları karşılaştır">
    <div className="comparison-title"><Scale size={17} /><strong>Kaynaklı araç karşılaştırması</strong></div>
    <p>Yıl, marka, model ve versiyon seçin. Yalnızca doğrulanmış katalog kayıtları listelenir.</p>
    {sedanIndex >= 0 && suvIndex >= 0 && <button className="comparison-preset" type="button" onClick={() => { setLeft(sedanIndex); setRight(suvIndex); }}><ArrowLeftRight size={14} /> SUV ile sedanı karşılaştır</button>}
    <div className="comparison-pickers"><VehiclePicker title="Birinci araç" value={left} onChange={setLeft} /><VehiclePicker title="İkinci araç" value={right} onChange={setRight} /></div>
    {dimensionSummary && <div className="comparison-insight"><strong>{specs[0].bodyType} / {specs[1].bodyType}</strong><span>{dimensionSummary}</span></div>}
    <div className="comparison-table" role="table" aria-label="Teknik karşılaştırma">
      <div className="comparison-row comparison-row--head" role="row"><span role="columnheader">Özellik</span>{selected.map((car) => <strong role="columnheader" key={carKey(car)}>{car.brand} {car.model}<small>{car.year} · {car.trim}</small></strong>)}</div>
      {rows.map(([name, value]) => <div className="comparison-row" role="row" key={name}><span role="rowheader">{name}</span>{selected.map((car, index) => <span role="cell" key={`${carKey(car)}-${name}`}>{value(car, index)}</span>)}</div>)}
    </div>
    <div className="comparison-sources">{selected.map((car, index) => <a key={carKey(car)} href={specs[index].sourceUrl ?? car.sourceUrl} target="_blank" rel="noopener noreferrer">{index + 1}. araç üretici kaynağı ↗</a>)}</div>
    <p>Ölçüler ve performans değerleri üretici kataloglarından alınır. Versiyona göre değişen değerler aralık olarak gösterilir.</p>
  </section>;
}
