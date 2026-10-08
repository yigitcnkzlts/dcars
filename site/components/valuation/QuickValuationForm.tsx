"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Gauge, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BrandSelect } from "./BrandSelect";
import { ModelSelect } from "./ModelSelect";
import { PackageSelect } from "./PackageSelect";
import { ValuationWizard } from "./ValuationWizard";
import type { VehicleContext } from "@/types/vehicle";
import { optionsFor } from "@/services/vehicleCatalogService";

const steps = ["Araç", "Detaylar", "Kullanım", "Durum", "Başvuru"];
const years = Array.from({ length: 70 }, (_, index) => new Date().getFullYear() + 1 - index);
const fuelFallbacks = ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik", "Bilmiyorum"];
const transmissionFallbacks = ["Manuel", "Otomatik", "Yarı otomatik", "Bilmiyorum"];
const mileageShortcuts = ["25000", "50000", "100000", "150000"];
const digits = (value: string) => value.replace(/\D/g, "").slice(0, 9);
const formatNumber = (value: string) => value ? new Intl.NumberFormat("tr-TR").format(Number(value)) : "";

export function QuickValuationForm({ onVehicleChange }: { onVehicleChange?: (vehicle: VehicleContext) => void }) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [year, setYear] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [engine, setEngine] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [mileage, setMileage] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const vehicle = { year: year ? Number(year) : undefined, brand, model, engine, fuelType, transmission, trim, mileage: mileage ? Number(mileage) : undefined };
  const notify = (next: VehicleContext) => onVehicleChange?.(next);
  const resetDetails = () => { setEngine(""); setFuelType(""); setTransmission(""); setTrim(""); };
  const changeYear = (value: string) => { setYear(value); setModel(""); resetDetails(); notify({ ...vehicle, year: value ? Number(value) : undefined, model: "", engine: "", fuelType: "", transmission: "", trim: "" }); };
  const changeMileage = (value: string) => { const next = digits(value); setMileage(next); notify({ ...vehicle, mileage: next ? Number(next) : undefined }); };
  const changeBrand = (value: string) => { setBrand(value); setModel(""); resetDetails(); notify({ ...vehicle, brand: value, model: "", engine: "", fuelType: "", transmission: "", trim: "" }); };
  const changeModel = (value: string) => { setModel(value); resetDetails(); notify({ ...vehicle, model: value, engine: "", fuelType: "", transmission: "", trim: "" }); };
  const changeTrim = (value: string) => { setTrim(value); notify({ ...vehicle, trim: value }); };

  // ── Verified catalog options ───────────────────────────────────────────────
  const verifiedEngines = useMemo(() => optionsFor({ year: Number(year), brand, model }, "engine"), [year, brand, model]);
  const verifiedFuels = useMemo(() => optionsFor({ year: Number(year), brand, model, engine }, "fuelType"), [year, brand, model, engine]);
  const verifiedTrans = useMemo(() => optionsFor({ year: Number(year), brand, model, engine, fuelType }, "transmission"), [year, brand, model, engine, fuelType]);

  // ── CSV catalog fallback (fetched when no verified options) ────────────────
  const [csvEngines, setCsvEngines] = useState<string[]>([]);
  const [csvFuels, setCsvFuels] = useState<string[]>([]);
  const [csvTrans, setCsvTrans] = useState<string[]>([]);

  useEffect(() => {
    if (!brand || !model) { setCsvEngines([]); return; }
    if (verifiedEngines.length > 0) { setCsvEngines([]); return; }
    const p = new URLSearchParams({ brand, model, field: "engine" });
    if (year) p.set("year", year);
    if (fuelType) p.set("fuelType", fuelType);
    if (transmission) p.set("transmission", transmission);
    fetch(`/api/catalog-options?${p}`).then((r) => r.json()).then((data) => setCsvEngines(data as string[])).catch(() => setCsvEngines([]));
  }, [brand, model, year, fuelType, transmission, verifiedEngines.length]);

  useEffect(() => {
    if (!brand || !model) { setCsvFuels([]); return; }
    if (verifiedFuels.length > 0) { setCsvFuels([]); return; }
    const p = new URLSearchParams({ brand, model, field: "fuelType" });
    if (year) p.set("year", year);
    fetch(`/api/catalog-options?${p}`).then((r) => r.json()).then((data) => setCsvFuels(data as string[])).catch(() => setCsvFuels([]));
  }, [brand, model, year, verifiedFuels.length]);

  useEffect(() => {
    if (!brand || !model) { setCsvTrans([]); return; }
    if (verifiedTrans.length > 0) { setCsvTrans([]); return; }
    const p = new URLSearchParams({ brand, model, field: "transmission" });
    if (year) p.set("year", year);
    fetch(`/api/catalog-options?${p}`).then((r) => r.json()).then((data) => setCsvTrans(data as string[])).catch(() => setCsvTrans([]));
  }, [brand, model, year, verifiedTrans.length]);

  // ── Merged options: verified first, then CSV, then static fallback ─────────
  const engineOptions = verifiedEngines.length ? verifiedEngines : csvEngines;
  const fuelOptions = [...new Set([...verifiedFuels, ...csvFuels, ...fuelFallbacks])];
  const transmissionOptions = [...new Set([...verifiedTrans, ...csvTrans, ...transmissionFallbacks])];
  const canContinue = step === 0 ? Boolean(year && brand && model) : step === 1 ? Boolean(engine && fuelType && transmission && trim) : Boolean(mileage && Number(mileage) >= 0);
  const validation = step === 0 ? (!brand ? "Marka seçin" : !year ? "Model yılı seçin" : !model ? "Model seçin" : "") : step === 1 ? (!engine ? "Motor seçin" : !fuelType ? "Yakıt tipi seçin" : !transmission ? "Vites tipi seçin" : !trim ? "Donanım paketi seçin" : "") : !mileage ? "Kilometre girin" : "";
  const goNext = () => { if (!canContinue) return; if (step < 2) setStep((current) => current + 1); else setWizardOpen(true); };
  const motionProps = reduceMotion ? { initial: false as const } : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: .24, ease: [0.22, 1, 0.36, 1] as const } };

  return <>
    <section className="valuation-section" id="teklif-formu" aria-labelledby="valuation-title"><div className="valuation-shell">
      <div className="valuation-heading"><span className="section-index">ÜCRETSİZ TEKLİF BAŞVURUSU</span><h2 id="valuation-title">Aracını anlat,<br /><em>teklif iste.</em></h2><p>Aracını birkaç kısa adımda tanımla. İlan hazırlamadan, satış zorunluluğu olmadan teklif sürecini başlat.</p><div className="valuation-benefits"><span><Check size={16} /> İlan hazırlamadan başvur</span><span><Check size={16} /> Hasarı açıkça anlat</span><span><Check size={16} /> Teklifi değerlendir, kararını ver</span></div></div>
      <div className="valuation-card valuation-card--wizard"><header className="valuation-progress"><div className="valuation-progress__mobile"><span>{step + 1} / 5</span><strong>{steps[step]}</strong></div><div className="valuation-progress__bar" aria-hidden="true"><motion.span animate={{ width: `${((step + 1) / 5) * 100}%` }} transition={reduceMotion ? { duration: 0 } : { duration: .3 }} /></div><ol>{steps.map((item, index) => <li key={item} className={index === step ? "is-active" : index < step ? "is-complete" : ""} aria-current={index === step ? "step" : undefined}><i>{index < step ? <Check size={13} /> : index + 1}</i><span>{item}</span></li>)}</ol></header>
        <div className="valuation-workspace"><div className="valuation-stage"><AnimatePresence mode="wait" initial={false}><motion.div className="valuation-step" key={step} {...motionProps}>
          {step === 0 && <><StepHeading eyebrow="ADIM 01" title="Aracını seç" text="Marka, model yılı ve modeli belirleyerek başlayalım." /><BrandSelect value={brand} onChange={changeBrand} /><YearPicker value={year} onChange={changeYear} /><ModelSelect brand={brand} year={year} value={model} onChange={changeModel} /></>}
          {step === 1 && <><StepHeading eyebrow="ADIM 02" title="Araç detayları" text="Emin olmadığın alanlarda Bilmiyorum seçeneğiyle devam edebilirsin." /><SearchChoice label="Motor" value={engine} disabled={!model} options={engineOptions} emptyText="Motor seçenekleri yükleniyor..." onChange={(value) => { setEngine(value); setFuelType(""); setTransmission(""); setTrim(""); }} /><ChipChoice label="Yakıt tipi" value={fuelType} options={fuelOptions} onChange={(value) => { setFuelType(value); setTransmission(""); setTrim(""); }} /><ChipChoice label="Vites" value={transmission} options={transmissionOptions} onChange={(value) => { setTransmission(value); setTrim(""); }} /><PackageSelect year={Number(year)} brand={brand} model={model} engine={engine} fuelType={fuelType} transmission={transmission} value={trim} onChange={changeTrim} /></>}
          {step === 2 && <><StepHeading eyebrow="ADIM 03" title="Kullanım bilgileri" text="Güncel kilometre bilgisi, daha sağlıklı bir ilk değerlendirme sağlar." /><label className="valuation-field valuation-mileage"><span>Kilometre *</span><div className="number-input"><Gauge size={19} aria-hidden="true" /><input aria-describedby="mileage-help" inputMode="numeric" value={formatNumber(mileage)} onChange={(event) => changeMileage(event.target.value)} placeholder="85.000" /><span>km</span></div><small id="mileage-help">Yalnızca rakam girin; binlik ayırıcı otomatik eklenir.</small></label><div className="mileage-shortcuts" aria-label="Hızlı kilometre seçimi">{mileageShortcuts.map((value) => <button type="button" key={value} aria-pressed={mileage === value} onClick={() => changeMileage(value)}>{formatNumber(value)}{value === "150000" ? "+" : ""}</button>)}</div></>}
        </motion.div></AnimatePresence><div className="valuation-actions"><button className="valuation-back" type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ArrowLeft size={17} /> Geri</button><div>{!canContinue && validation && <small className="valuation-inline-hint">{validation}</small>}<button className="button button--primary valuation-submit" type="button" onClick={goNext} disabled={!canContinue}><span>{step === 2 && <Sparkles size={16} />}{step === 2 ? "Araç durumuna geç" : "Devam et"}</span><ArrowRight size={17} /></button></div></div></div><VehicleSummary vehicle={vehicle} /></div>
      </div>
    </div></section>{wizardOpen && <ValuationWizard vehicle={vehicle} onClose={() => setWizardOpen(false)} />}
  </>;
}

function StepHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="valuation-step__heading"><span>{eyebrow}</span><h3>{title}</h3><p>{text}</p></div>; }

function YearPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [query, setQuery] = useState(""); const [open, setOpen] = useState(false);
  const matches = useMemo(() => years.filter((year) => String(year).includes(query.trim())).slice(0, 18), [query]);
  const choose = (year: number) => { onChange(String(year)); setQuery(""); setOpen(false); };
  return <div className="year-picker valuation-field"><label htmlFor="valuation-year">Model yılı</label><div className="year-picker__input"><Search size={17} aria-hidden="true" /><input id="valuation-year" role="combobox" aria-expanded={open} aria-controls="valuation-year-results" value={open ? query : value} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(digits(event.target.value).slice(0, 4)); setOpen(true); }} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); if (event.key === "Enter" && matches.length) { event.preventDefault(); choose(matches[0]); } }} placeholder="Yıl ara, örn. 2021" inputMode="numeric" autoComplete="off" /></div>{open && <div id="valuation-year-results" className="year-picker__results" role="listbox">{matches.map((year) => <button type="button" role="option" aria-selected={String(year) === value} key={year} onClick={() => choose(year)}>{year}{String(year) === value && <Check size={14} />}</button>)}{!matches.length && <small>Geçerli bir model yılı bulunamadı.</small>}</div>}</div>;
}

function SearchChoice({ label, value, options, disabled, emptyText, onChange }: { label: string; value: string; options: string[]; disabled: boolean; emptyText: string; onChange: (value: string) => void }) {
  const [query, setQuery] = useState(""); const filtered = useMemo(() => options.filter((item) => item.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR"))), [options, query]);
  return <div className="search-choice valuation-field"><label htmlFor="valuation-engine">{label}</label><div className="search-choice__input"><Search size={17} aria-hidden="true" /><input id="valuation-engine" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={disabled ? "Önce model seçin" : "Motor ara"} disabled={disabled} /></div>{!disabled && <div className="choice-grid">{filtered.map((item) => <button type="button" key={item} className={item === "Bilmiyorum" ? "is-neutral" : ""} aria-pressed={value === item} onClick={() => onChange(item)}>{item}{value === item && <CheckCircle2 size={15} />}</button>)}</div>}{!disabled && filtered.length === 1 && filtered[0] === "Bilmiyorum" && <p className="valuation-info">{emptyText} “Bilmiyorum” ile devam edebilirsin.</p>}</div>;
}
function ChipChoice({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <fieldset className="chip-choice"><legend>{label}</legend><div className="choice-grid">{options.map((item) => <button type="button" key={item} className={item === "Bilmiyorum" ? "is-neutral" : ""} aria-pressed={value === item} onClick={() => onChange(item)}>{item}{value === item && <CheckCircle2 size={15} />}</button>)}</div></fieldset>; }
function VehicleSummary({ vehicle }: { vehicle: VehicleContext }) { const rows = [["Model yılı", vehicle.year], ["Model", vehicle.model], ["Motor", vehicle.engine], ["Yakıt", vehicle.fuelType], ["Vites", vehicle.transmission], ["Paket", vehicle.trim], ["Kilometre", vehicle.mileage !== undefined ? `${new Intl.NumberFormat("tr-TR").format(vehicle.mileage)} km` : undefined]]; return <aside className="valuation-summary" aria-label="Seçilen araç özeti"><span>ARACIN</span><h4>{vehicle.brand || "Seçimlerin burada görünecek"}</h4>{vehicle.brand ? <dl>{rows.filter(([, value]) => value).map(([label, value]) => <div key={String(label)}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : <p>Markanı seçerek aracını oluşturmaya başla.</p>}</aside>; }
