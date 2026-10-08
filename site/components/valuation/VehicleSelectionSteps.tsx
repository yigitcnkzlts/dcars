"use client";

import { useEffect, useState } from "react";
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
const labels = ["Model Yılı", "Marka", "Model", "Vites Tipi", "Yakıt Tipi", "Motor ve Donanım", "Renk"];
const titles = ["Aracınızın model yılı nedir?", "Hangi marka aracı satıyorsunuz?", "Aracınızın modelini seçin", "Vites tipini seçin", "Yakıt tipini seçin", "Motor ve donanım paketini seçin", "Aracınızın rengi"];
const searchLabels = ["Yıla göre ara", "Markaya göre ara", "Modele göre ara", "", "", "Motor ve versiyonda ara", ""];

export function versionLabel(variant: VehicleVariant): string {
  const commercial = variant.version && variant.version !== `${variant.engine} · ${variant.transmission}` ? variant.version : "";
  return commercial ? (commercial.includes(variant.trim) ? commercial : `${commercial} · ${variant.trim}`) : [variant.engine, variant.trim, variant.transmission, variant.bodyType && !["Sedan", "Hatchback"].includes(variant.bodyType) ? variant.bodyType : ""].filter(Boolean).join(" · ");
}

export function VehicleSelectionSteps({ phase, selection, color, onColor, onSelect, onVariant, onFallbackVersion, onChangePhase }: Props) {
  const [query, setQuery] = useState("");
  const [manualVersionOpen, setManualVersionOpen] = useState(false);
  const [manualVersion, setManualVersion] = useState("");

  // ── CSV catalog options (fetched from /api/catalog-options when no verified variants) ──
  const [csvTransmissions, setCsvTransmissions] = useState<string[]>([]);
  const [csvFuels, setCsvFuels] = useState<string[]>([]);
  const [csvEngines, setCsvEngines] = useState<string[]>([]);

  const variants = variantsFor(selection.year ?? 0, selection.brand ?? "", selection.model ?? "");
  const hasVerified = variants.length > 0;

  // Fetch CSV transmissions when brand/model/year change and no verified variants
  useEffect(() => {
    if (hasVerified || !selection.brand || !selection.model) {
      setCsvTransmissions([]);
      return;
    }
    const params = new URLSearchParams({ brand: selection.brand, model: selection.model, field: "transmission" });
    if (selection.year) params.set("year", String(selection.year));
    fetch(`/api/catalog-options?${params}`).then((r) => r.json()).then((data) => setCsvTransmissions(data as string[])).catch(() => setCsvTransmissions([]));
  }, [hasVerified, selection.brand, selection.model, selection.year]);

  // Fetch CSV fuel types when transmission changes
  useEffect(() => {
    if (hasVerified || !selection.brand || !selection.model) {
      setCsvFuels([]);
      return;
    }
    const params = new URLSearchParams({ brand: selection.brand, model: selection.model, field: "fuelType" });
    if (selection.year) params.set("year", String(selection.year));
    fetch(`/api/catalog-options?${params}`).then((r) => r.json()).then((data) => setCsvFuels(data as string[])).catch(() => setCsvFuels([]));
  }, [hasVerified, selection.brand, selection.model, selection.year]);

  // Fetch CSV engines when fuelType or transmission changes
  useEffect(() => {
    if (hasVerified || !selection.brand || !selection.model) {
      setCsvEngines([]);
      return;
    }
    const params = new URLSearchParams({ brand: selection.brand, model: selection.model, field: "engine" });
    if (selection.year) params.set("year", String(selection.year));
    if (selection.fuelType) params.set("fuelType", selection.fuelType);
    if (selection.transmission) params.set("transmission", selection.transmission);
    fetch(`/api/catalog-options?${params}`).then((r) => r.json()).then((data) => setCsvEngines(data as string[])).catch(() => setCsvEngines([]));
  }, [hasVerified, selection.brand, selection.model, selection.year, selection.fuelType, selection.transmission]);

  // ── Cascading options ──────────────────────────────────────────────────────
  const transmissions = hasVerified
    ? [...new Set(variants.map((item) => item.transmission))]
    : csvTransmissions.length ? csvTransmissions : ["Otomatik", "Manuel", "Yarı otomatik"];

  const byTransmission = variants.filter((item) => item.transmission === selection.transmission);

  const fuels = hasVerified
    ? [...new Set(byTransmission.map((item) => item.fuelType))]
    : csvFuels.length ? csvFuels : ["Benzin", "Dizel", "Hibrit", "Elektrik", "LPG"];

  const byFuel = byTransmission.filter((item) => item.fuelType === selection.fuelType);

  const engines = hasVerified
    ? [...new Set(byFuel.map((item) => item.engine))]
    : csvEngines;
  const matches = (text: string) => text.toLocaleLowerCase("tr-TR").includes(query.trim().toLocaleLowerCase("tr-TR"));
  const versions = byFuel.filter((item) => (!selection.engine || item.engine === selection.engine) && matches(versionLabel(item)));
  const packages = getPackageSuggestions(selection.brand ?? "", selection.model ?? "");
  const verifiedCatalogPriorityBrand = ["Volkswagen", "Renault", "Fiat"].includes(selection.brand ?? "");
  // Hibrit filtresi: pakette "hybrid" geçiyorsa yalnızca hibrit yakıt seçiminde göster.
  // Türkçe "Hibrit" / "Mild Hibrit" / "Plug-in Hibrit" kontrolü yapıyoruz.
  const fuelIsHybrid = /hibrit/i.test(selection.fuelType ?? "");
  const filteredPackages = packages
    .filter((item) => {
      const itemIsHybrid = /hybrid/i.test(item);
      // Eğer listede hiç hybrid paketi yoksa filtreleme yapma
      if (!packages.some((p) => /hybrid/i.test(p))) return true;
      // Hibrit yakıt seçildiyse hibrit paketleri göster, diğerleri gizle
      return itemIsHybrid === fuelIsHybrid;
    })
    .filter(matches);
  // Verified versiyonlar: byFuel'de engine eşleşmesi varsa
  const showVerifiedVersions = versions.length > 0;
  // Paket önerileri: verified yoksa veya engine seçildi ama verified match bulunamadıysa
  const showPackageSuggestions = !verifiedCatalogPriorityBrand && !showVerifiedVersions && filteredPackages.length > 0;
  // Manuel giriş: hem verified hem paket yoksa, ya da kullanıcı bulamadı diyorsa
  const showManualAlways = !showVerifiedVersions;
  const matched = selectedVariant(selection);
  const motorAndTrim = selection.engine && selection.trim
    ? `${selection.engine} · ${matched ? versionLabel(matched) : selection.trim}`
    : selection.engine;
  const answers = [selection.year, selection.brand, selection.model, selection.transmission, selection.fuelType, motorAndTrim, color];
  const years = Array.from({ length: new Date().getFullYear() + 2 - 1985 }, (_, index) => new Date().getFullYear() + 1 - index).filter((year) => matches(String(year)));

  return (
    <div className="vehicle-selection vehicle-selection--layout">
      <div className="vehicle-selection__main">
        <nav className="selection-trail" aria-label="Araç bilgisi alt adımları">
          {labels.map((label, index) => <button type="button" key={label} disabled={index > phase || !answers[index]} aria-current={index === phase ? "step" : undefined} onClick={() => onChangePhase(index)}><span>{index + 1}</span>{label}</button>)}
        </nav>
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
            <div className="vehicle-selection__cards">{(phase === 3 ? transmissions : fuels).map((value) => <Choice key={value} label={value} selected={(phase === 3 ? selection.transmission : selection.fuelType) === value} onClick={() => onSelect(phase === 3 ? "transmission" : "fuelType", value)} />)}</div>
          </>
        )}
        {phase === 5 && (
          <>
            <p className="selection-source">Önce motoru, ardından uyumlu versiyon / donanımı seçin.</p>
            <div className="vehicle-selection__cards">{engines.filter(matches).map((value) => <Choice key={value} label={value} selected={selection.engine === value} onClick={() => onSelect("engine", value)} />)}</div>
            {engines.length > 0 && !engines.filter(matches).length && <p className="vehicle-selection__empty">Arama ile eşleşen motor bulunamadı. Aramayı temizleyin.</p>}
            {selection.engine && (
              <>
                {showVerifiedVersions && <p className="selection-source"><Check size={14} /> Uyumlu doğrulanmış versiyon / donanımlar</p>}
                {!showVerifiedVersions && showPackageSuggestions && <p className="selection-notice">Seçili kombinasyon için doğrulanmış paket bulunamadı. Model ailesine ait paket önerileri gösteriliyor.</p>}
                {!showVerifiedVersions && !showPackageSuggestions && <p className="selection-notice">Bu motor kombinasyonu için doğrulanmış veya önerilen paket bulunamadı. Aşağıdan kendiniz ekleyebilirsiniz.</p>}
                <div className="vehicle-selection__cards vehicle-selection__cards--versions">
                  {showVerifiedVersions
                    ? versions.map((item) => <Choice key={[item.generation, item.engine, item.version, item.trim, item.bodyType].join("|")} label={versionLabel(item)} detail={`${item.fuelType} · ${item.transmission}`} selected={matched === item} onClick={() => onVariant(item)} />)
                    : filteredPackages.map((item) => <Choice key={item} label={item} detail="Paket önerisi" selected={selection.trim === item} onClick={() => onFallbackVersion(selection.transmission!, item)} />)}
                </div>
                {showManualAlways && <>
                  <button type="button" className="vehicle-selection__unknown" aria-expanded={manualVersionOpen} onClick={() => setManualVersionOpen((open) => !open)}>Paketimi bulamadım</button>
                  {manualVersionOpen && <div className="manual-version"><label htmlFor="manual-version">Paket / versiyon adı</label><div><input id="manual-version" value={manualVersion} onChange={(event) => setManualVersion(event.target.value)} placeholder="Örn. Titanium, Shine veya Edition" /><button type="button" disabled={!manualVersion.trim()} onClick={() => onFallbackVersion(selection.transmission!, manualVersion.trim())}>Paketi kullan</button></div></div>}
                </>}
              </>
            )}
            {!selection.engine && engines.length > 0 && (
              <p className="selection-notice">Versiyon / donanım seçeneklerini görmek için bir motor seçin.</p>
            )}
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
        <details open>
          <summary><CarFront size={20} aria-hidden="true" /> Araç özetini göster / gizle</summary>
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
        </details>
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
