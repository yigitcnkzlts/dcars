"use client";

import { BrandSelect } from "./BrandSelect";
import { ModelSelect } from "./ModelSelect";
import { variantsFor, type VehicleSelection } from "@/services/vehicleCatalogService";
import type { VehicleVariant } from "@/data/vehicle-catalog/variants";

type Props = {
  phase: number;
  manual: boolean;
  selection: Partial<VehicleSelection>;
  onSelect: (field: keyof VehicleSelection, value: string | number) => void;
  onVariant: (variant: VehicleVariant) => void;
  onManual: () => void;
  onChangeVehicle: () => void;
};
const manualLabels: Record<"brand" | "model" | "engine" | "fuelType" | "transmission" | "trim", string> = { brand: "Marka", model: "Model", engine: "Motor", fuelType: "Yakıt", transmission: "Şanzıman", trim: "Paket" };

export function VehicleSelectionSteps({ phase, manual, selection, onSelect, onVariant, onManual, onChangeVehicle }: Props) {
  const variants = variantsFor(selection.year ?? 0, selection.brand ?? "", selection.model ?? "");
  const engines = [...new Map(variants.map((variant) => [[variant.generation, variant.engine, variant.fuelType, variant.transmission].join("|"), variant])).values()];
  const trims = [...new Set(variants.filter((variant) => variant.generation === selection.generation && variant.engine === selection.engine && variant.fuelType === selection.fuelType && variant.transmission === selection.transmission).map((variant) => variant.trim))];
  const summary = [selection.year, selection.brand, selection.model, selection.generation, selection.engine, selection.transmission, selection.trim].filter(Boolean).join(" · ");

  return <div className="vehicle-selection">
    <div className="vehicle-selection__progress" aria-label="Araç seçimi aşaması">{["Yıl ve marka", "Model", "Motor ve vites", "Paket"].map((label, index) => <span key={label} className={index === phase ? "is-current" : index < phase ? "is-done" : ""}><b>{index + 1}</b>{label}</span>)}</div>
    {phase === 0 && <div className="detailed-vehicle-grid"><label className="valuation-field"><span>Model yılı</span><select value={selection.year ?? ""} onChange={(event) => onSelect("year", event.target.value ? Number(event.target.value) : "")}><option value="">Yıl seçin</option>{Array.from({ length: 70 }, (_, index) => new Date().getFullYear() + 1 - index).map((year) => <option key={year} value={year}>{year}</option>)}</select></label><BrandSelect value={selection.brand ?? ""} onChange={(value) => onSelect("brand", value)} disabled={!selection.year} /></div>}
    {phase === 1 && <><ModelSelect brand={selection.brand ?? ""} value={selection.model ?? ""} onChange={(value) => onSelect("model", value)} /><p className="vehicle-selection__hint">{selection.year} {selection.brand} için modelinizi arayın veya listeden seçin.</p></>}
    {phase === 2 && <><h4>Motor ve şanzıman</h4>{engines.length ? <div className="vehicle-selection__cards">{engines.map((variant) => <button type="button" key={[variant.generation, variant.engine, variant.transmission].join("|")} className="vehicle-selection__card" onClick={() => onVariant(variant)}><strong>{variant.engine}</strong><span>{variant.fuelType} · {variant.transmission}</span><small>{variant.generation ?? "Nesil belirtilmedi"}</small></button>)}</div> : <p className="vehicle-selection__empty">Bu yıl ve model için doğrulanmış motor kaydı henüz yok. Aracınızı manuel olarak belirtebilirsiniz.</p>}</>}
    {phase === 3 && (manual ? <div className="vehicle-selection__manual"><p>Katalogda bulunmayan aracınızın bildiğiniz bilgilerini yazın. Emin olmadığınız alanlara “Bilmiyorum” yazabilirsiniz.</p><div className="detailed-vehicle-grid">{(Object.keys(manualLabels) as (keyof typeof manualLabels)[]).map((field) => <label className="valuation-field" key={field}><span>{manualLabels[field]}</span><input value={String(selection[field] ?? "")} onChange={(event) => onSelect(field, event.target.value)} maxLength={80} /></label>)}</div></div> : <><h4>Donanım paketi</h4>{trims.length ? <div className="vehicle-selection__cards">{trims.map((trim) => <button type="button" key={trim} className={selection.trim === trim ? "vehicle-selection__card is-selected" : "vehicle-selection__card"} onClick={() => onSelect("trim", trim)}><strong>{trim}</strong></button>)}</div> : <p className="vehicle-selection__empty">Bu motor için doğrulanmış paket bulunmuyor.</p>}<button type="button" className="vehicle-selection__unknown" onClick={() => onSelect("trim", "Bilmiyorum")}>Paketimi bilmiyorum</button></>)}
    {(phase > 0 || manual) && <button type="button" className="vehicle-selection__fallback" onClick={onManual}>Aracımı bulamadım · Bilgileri kendim gireceğim</button>}
    {summary && phase > 0 && <div className="vehicle-selection__summary"><span>Seçiminiz</span><strong>{summary}</strong><button type="button" onClick={onChangeVehicle}>Değiştir</button></div>}
  </div>;
}
