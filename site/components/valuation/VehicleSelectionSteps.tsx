"use client";

import { useState } from "react";
import { BrandSelect } from "./BrandSelect";
import { ModelSelect } from "./ModelSelect";
import { selectedVariant, variantsFor, type VehicleSelection } from "@/services/vehicleCatalogService";
import type { VehicleVariant } from "@/data/vehicle-catalog/variants";

type Props = { phase: number; manual: boolean; selection: Partial<VehicleSelection>; color: string; onColor: (color: string) => void; onSelect: (field: keyof VehicleSelection, value: string | number) => void; onVariant: (variant: VehicleVariant) => void; onManual: () => void; onChangeVehicle: () => void };
const colors = ["Siyah", "Beyaz", "Gri", "Gümüş", "Lacivert", "Mavi", "Kırmızı", "Yeşil", "Bej", "Şampanya", "Bordo", "Kahverengi", "Turuncu", "Sarı", "Mor", "Diğer"];
const swatches: Record<string, string> = { Siyah: "#17191d", Beyaz: "#fafafa", Gri: "#858991", "Gümüş": "#c8cbd0", Lacivert: "#162c51", Mavi: "#3172ad", Kırmızı: "#b32c38", Yeşil: "#39765b", Bej: "#c4ad88", Şampanya: "#c0aa83", Bordo: "#653043", Kahverengi: "#66503e", Turuncu: "#d27a32", Sarı: "#e2ba43", Mor: "#72527b", Diğer: "#e9e9e9" };
const labels = ["Yıl ve marka", "Model", "Yakıt", "Versiyon", "Renk"];
const manualLabels: Record<"brand" | "model" | "fuelType" | "version", string> = { brand: "Marka", model: "Model", fuelType: "Yakıt", version: "Versiyon" };

export function versionLabel(variant: VehicleVariant): string {
  const commercial = variant.version && variant.version !== `${variant.engine} · ${variant.transmission}` ? variant.version : "";
  return commercial ? (commercial.includes(variant.trim) ? commercial : `${commercial} · ${variant.trim}`) : [variant.engine, variant.trim, variant.transmission, variant.bodyType && !["Sedan", "Hatchback"].includes(variant.bodyType) ? variant.bodyType : ""].filter(Boolean).join(" · ");
}

export function VehicleSelectionSteps({ phase, manual, selection, color, onColor, onSelect, onVariant, onManual, onChangeVehicle }: Props) {
  const [versionQuery, setVersionQuery] = useState("");
  const variants = variantsFor(selection.year ?? 0, selection.brand ?? "", selection.model ?? "");
  const fuels = [...new Set(variants.map((variant) => variant.fuelType))];
  const versions = variants.filter((variant) => variant.fuelType === selection.fuelType && versionLabel(variant).toLocaleLowerCase("tr-TR").includes(versionQuery.trim().toLocaleLowerCase("tr-TR")));
  const matched = selectedVariant(selection);
  const summary: [string, string | number | undefined][] = [["Model yılı", selection.year], ["Marka", selection.brand], ["Model", selection.model], ["Yakıt", selection.fuelType], ["Versiyon", selection.trim === "Bilmiyorum" ? "Bilmiyorum" : matched ? versionLabel(matched) : manual ? selection.version : undefined], ["Renk", color]];

  return <div className="vehicle-selection vehicle-selection--layout"><div className="vehicle-selection__main">
    <div className="vehicle-selection__progress" aria-label="Araç seçimi aşaması">{labels.map((label, index) => <span key={label} className={index === phase ? "is-current" : index < phase ? "is-done" : ""}><b>{index + 1}</b>{label}</span>)}</div>
    {manual ? <div className="vehicle-selection__manual"><h4>Aracınızı kendiniz tanımlayın</h4><p>Katalogda bulunmayan bilgileri yazın. Bilmediğiniz versiyon için “Bilmiyorum” kullanabilirsiniz.</p><div className="detailed-vehicle-grid"><label className="valuation-field"><span>Model yılı</span><input type="number" min="1985" max={new Date().getFullYear() + 1} value={selection.year ?? ""} onChange={(event) => onSelect("year", Number(event.target.value))} /></label>{(Object.keys(manualLabels) as (keyof typeof manualLabels)[]).map((field) => <label className="valuation-field" key={field}><span>{manualLabels[field]}</span><input value={String(selection[field] ?? "")} onChange={(event) => onSelect(field, event.target.value)} maxLength={80} /></label>)}</div><h4>Renk</h4><ColorChoices value={color} onChange={onColor} /></div> : <>
      {phase === 0 && <div className="detailed-vehicle-grid"><label className="valuation-field"><span>Model yılı</span><select value={selection.year ?? ""} onChange={(event) => onSelect("year", event.target.value ? Number(event.target.value) : "")}><option value="">Yıl seçin</option>{Array.from({ length: new Date().getFullYear() + 2 - 1985 }, (_, index) => new Date().getFullYear() + 1 - index).map((year) => <option key={year} value={year}>{year}</option>)}</select></label><BrandSelect value={selection.brand ?? ""} onChange={(value) => onSelect("brand", value)} disabled={!selection.year} /></div>}
      {phase === 1 && <><h4>Araç / Model Seçimi</h4><ModelSelect grid brand={selection.brand ?? ""} value={selection.model ?? ""} onChange={(value) => onSelect("model", value)} /></>}
      {phase === 2 && <><h4>Yakıt tipini seçin</h4>{fuels.length ? <div className="vehicle-selection__cards">{fuels.map((fuel) => <button type="button" key={fuel} className={selection.fuelType === fuel ? "vehicle-selection__card is-selected" : "vehicle-selection__card"} onClick={() => onSelect("fuelType", fuel)}><strong>{fuel}</strong></button>)}</div> : <p className="vehicle-selection__empty">Bu yıl ve model için doğrulanmış versiyon kaydı henüz yok. Aracınızı manuel girebilirsiniz.</p>}</>}
      {phase === 3 && <><h4>Versiyon seçimi</h4><label className="valuation-field"><span>Versiyona göre ara</span><input type="search" value={versionQuery} onChange={(event) => setVersionQuery(event.target.value)} placeholder="Örn. DSG, Comfortline, Sky Pack" /></label>{versions.length ? <div className="vehicle-selection__cards vehicle-selection__cards--versions">{versions.map((variant) => <button type="button" key={[variant.year, variant.brand, variant.model, variant.generation, variant.engine, variant.transmission, variant.trim].join("|")} className="vehicle-selection__card" onClick={() => onVariant(variant)}><strong>{versionLabel(variant)}</strong><span>{variant.fuelType} · {variant.transmission}{variant.bodyType ? ` · ${variant.bodyType}` : ""}</span></button>)}</div> : <p className="vehicle-selection__empty">Aramanızla eşleşen doğrulanmış versiyon yok.</p>}<button type="button" className="vehicle-selection__unknown" onClick={() => onSelect("trim", "Bilmiyorum")}>Versiyonumu bilmiyorum</button></>}
      {phase === 4 && <><h4>Araç rengi</h4><ColorChoices value={color} onChange={onColor} /></>}
    </>}
    {!manual && phase > 0 && <button type="button" className="vehicle-selection__fallback" onClick={onManual}>Aracımı bulamadım · Bilgileri kendim gireceğim</button>}
  </div><aside className="vehicle-selection__summary" aria-label="Seçilen araç özeti"><span className="vehicle-eyebrow">SEÇİLEN ARAÇ</span><div className="vehicle-selection__silhouette" aria-hidden="true">◢ ▰ ▰ ◣</div><dl>{summary.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl><button type="button" onClick={onChangeVehicle}>Seçimi düzenle</button></aside></div>;
}

function ColorChoices({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return <div className="vehicle-selection__colors" role="group" aria-label="Araç rengi">{colors.map((color) => <button type="button" key={color} aria-pressed={value === color} className={value === color ? "vehicle-selection__color is-selected" : "vehicle-selection__color"} onClick={() => onChange(color)}><i style={{ backgroundColor: swatches[color] }} aria-hidden="true" />{color}</button>)}</div>;
}
