"use client";

import { useState } from "react";
import { Check, ChevronRight, Search, CarFront } from "lucide-react";
import { BrandSelect } from "./BrandSelect";
import { ModelSelect } from "./ModelSelect";
import { selectedVariant, variantsFor, type VehicleSelection } from "@/services/vehicleCatalogService";
import { getPackageSuggestions } from "@/services/vehiclePackageService";
import type { VehicleVariant } from "@/data/vehicle-catalog/variants";

type Props = {
  phase: number;
  selection: Partial<VehicleSelection>;
  color: string;
  onColor: (color: string) => void;
  onSelect: (field: keyof VehicleSelection, value: string | number) => void;
  onVariant: (variant: VehicleVariant) => void;
  onFallbackVersion: (transmission: string, trim: string) => void;
  onChangePhase: (phase: number) => void;
};

const swatches: Record<string, string> = {
  Siyah: "#17191d", Beyaz: "#fafafa", Gri: "#858991", Gümüş: "#c8cbd0", Füme: "#5c6168",
  Lacivert: "#162c51", Mavi: "#3172ad", Kırmızı: "#b32c38", Bordo: "#653043", Turuncu: "#d27a32",
  Sarı: "#e2ba43", Yeşil: "#39765b", Bej: "#c4ad88", Kahverengi: "#66503e", Şampanya: "#c0aa83",
  Altın: "#c6a15b", Mor: "#72527b", Diğer: "#e9e9e9",
};
const labels = ["Model Yılı", "Marka", "Model", "Vites Tipi", "Yakıt Tipi", "Model Uzantısı / Versiyon", "Renk"];
const titles = ["Aracınızın model yılı nedir?", "Hangi marka aracı satıyorsunuz?", "Aracınızın modelini seçin", "Vites tipini seçin", "Yakıt tipini seçin", "Aracınızın versiyonunu seçin", "Aracınızın rengi"];
const searchLabels = ["Yıla göre ara", "Markaya göre ara", "Modele göre ara", "", "", "Versiyona göre ara", ""];

export function versionLabel(variant: VehicleVariant): string {
  const commercial = variant.version && variant.version !== `${variant.engine} · ${variant.transmission}` ? variant.version : "";
  return commercial ? (commercial.includes(variant.trim) ? commercial : `${commercial} · ${variant.trim}`) : [variant.engine, variant.trim, variant.transmission, variant.bodyType && !["Sedan", "Hatchback"].includes(variant.bodyType) ? variant.bodyType : ""].filter(Boolean).join(" · ");
}

export function VehicleSelectionSteps({ phase, selection, color, onColor, onSelect, onVariant, onFallbackVersion, onChangePhase }: Props) {
  const [query, setQuery] = useState("");
  const variants = variantsFor(selection.year ?? 0, selection.brand ?? "", selection.model ?? "");
  const transmissions = variants.length ? [...new Set(variants.map((item) => item.transmission))] : ["Otomatik", "Manuel", "Yarı otomatik"];
  const byTransmission = variants.filter((item) => item.transmission === selection.transmission);
  const fuels = variants.length ? [...new Set(byTransmission.map((item) => item.fuelType))] : ["Benzin", "Dizel", "Hibrit", "Elektrik", "LPG"];
  const matches = (text: string) => text.toLocaleLowerCase("tr-TR").includes(query.trim().toLocaleLowerCase("tr-TR"));
  const versions = byTransmission.filter((item) => item.fuelType === selection.fuelType && matches(versionLabel(item)));
  const packages = getPackageSuggestions(selection.brand ?? "", selection.model ?? "");
  const filteredPackages = packages.filter((item) => (!packages.some((name) => /hybrid/i.test(name)) || (selection.fuelType === "Hibrit") === /hybrid/i.test(item)) && matches(item));
  const matched = selectedVariant(selection);
  const answers = [selection.year, selection.brand, selection.model, selection.transmission, selection.fuelType, matched ? versionLabel(matched) : selection.trim, color];
  const years = Array.from({ length: new Date().getFullYear() + 2 - 1985 }, (_, index) => new Date().getFullYear() + 1 - index).filter((year) => matches(String(year)));

  return (
    <div className="vehicle-selection vehicle-selection--layout">
      <div className="vehicle-selection__main">
        <div className="selection-heading">
          <span className="vehicle-eyebrow">{labels[phase]}</span>
          <h3 tabIndex={-1} data-selection-heading>{titles[phase]}</h3>
          <p>Seçiminizle bir sonraki adıma geçebilirsiniz.</p>
        </div>
        {(phase === 0 || phase === 5) && (
          <label className="selection-search">
            <Search size={18} aria-hidden="true" />
            <input aria-label={searchLabels[phase]} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchLabels[phase]} />
          </label>
        )}
        {phase === 0 && <div className="selection-years">{years.map((year) => <Choice key={year} label={String(year)} selected={selection.year === year} onClick={() => onSelect("year", year)} />)}{!years.length && <p>Bu yıl bulunamadı. 1985–{new Date().getFullYear() + 1} arasında arayın.</p>}</div>}
        {phase === 1 && <BrandSelect value={selection.brand ?? ""} onChange={(value) => onSelect("brand", value)} />}
        {phase === 2 && <ModelSelect grid brand={selection.brand ?? ""} value={selection.model ?? ""} onChange={(value) => onSelect("model", value)} />}
        {(phase === 3 || phase === 4) && (
          <>
            {!variants.length && <p className="selection-notice">Bu model yılı için seçenekler katalogdan doğrulanamadı. Aracınızda bulunan bilgiyi seçin; başvuruda ayrıca kontrol edilecektir.</p>}
            <div className="vehicle-selection__cards">{(phase === 3 ? transmissions : fuels).map((value) => <Choice key={value} label={value} selected={(phase === 3 ? selection.transmission : selection.fuelType) === value} onClick={() => onSelect(phase === 3 ? "transmission" : "fuelType", value)} />)}</div>
          </>
        )}
        {phase === 5 && (
          <>
            {!variants.length && <p className="selection-notice">Paket adları model ailesine ait önerilerdir; model yılına uygunluğu henüz doğrulanmamıştır.</p>}
            <div className="vehicle-selection__cards vehicle-selection__cards--versions">
              {variants.length
                ? versions.map((item) => <Choice key={[item.generation, item.engine, item.version, item.trim, item.bodyType].join("|")} label={versionLabel(item)} detail={`${item.fuelType} · ${item.transmission}`} selected={matched === item} onClick={() => onVariant(item)} />)
                : filteredPackages.map((item) => <Choice key={item} label={item} selected={selection.trim === item} onClick={() => onFallbackVersion(selection.transmission!, item)} />)}
            </div>
            {!(variants.length ? versions.length : filteredPackages.length) && <p className="vehicle-selection__empty">Eşleşen versiyon bulunamadı.</p>}
            <button type="button" className="vehicle-selection__unknown" onClick={() => onFallbackVersion(selection.transmission!, "Bilmiyorum")}>Paket bilgimden emin değilim</button>
          </>
        )}
        {phase === 6 && (
          <div className="vehicle-selection__colors" role="group" aria-label="Araç rengi">
            {Object.entries(swatches).map(([name, swatch]) => (
              <button type="button" key={name} aria-pressed={color === name} className={color === name ? "vehicle-selection__color is-selected" : "vehicle-selection__color"} onClick={() => onColor(name)}>
                <i style={{ backgroundColor: swatch }} aria-hidden="true" />
                {name}
                {color === name && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>
      <aside className="vehicle-selection__summary" aria-label="Seçilen araç özeti">
        <div className="selection-car"><CarFront size={66} strokeWidth={1} aria-hidden="true" /><span>D CARS</span></div>
        <span className="vehicle-eyebrow">ARAÇ ÖZETİ</span>
        <h4>{selection.brand ? `${selection.brand} ${selection.model ?? ""}` : "Seçtikçe özet dolacak."}</h4>
        <dl>
          {labels.map((label, index) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{answers[index] ? <button type="button" onClick={() => onChangePhase(index)} aria-label={`${label} değiştir: ${answers[index]}`}>{answers[index]}<ChevronRight size={13} /></button> : "—"}</dd>
            </div>
          ))}
        </dl>
        <p>Seçtiğiniz bir bilgiyi değiştirmek için üzerine dokunun.</p>
      </aside>
    </div>
  );
}

function Choice({ label, detail, selected, onClick }: { label: string; detail?: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`vehicle-selection__card${selected ? " is-selected" : ""}`} aria-pressed={selected} onClick={onClick}>
      <strong>{label}</strong>
      {detail && <span>{detail}</span>}
      <ChevronRight className="choice-arrow" size={17} aria-hidden="true" />
    </button>
  );
}
