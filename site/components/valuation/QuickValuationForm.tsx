"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { BrandSelect } from "./BrandSelect";
import { ModelSelect } from "./ModelSelect";
import { PackageSelect } from "./PackageSelect";
import { ValuationWizard } from "./ValuationWizard";
import type { VehicleContext } from "@/types/vehicle";
import { optionsFor } from "@/services/vehicleCatalogService";

export function QuickValuationForm({ onVehicleChange }: { onVehicleChange?: (vehicle: VehicleContext) => void }) {
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
  const changeYear = (value: string) => { setYear(value); setEngine(""); setFuelType(""); setTransmission(""); setTrim(""); onVehicleChange?.({ ...vehicle, year: value ? Number(value) : undefined }); };
  const changeMileage = (value: string) => { setMileage(value); onVehicleChange?.({ ...vehicle, mileage: value ? Number(value) : undefined }); };
  const changeBrand = (value: string) => { setBrand(value); setModel(""); setEngine(""); setFuelType(""); setTransmission(""); setTrim(""); onVehicleChange?.({ ...vehicle, brand: value, model: "", engine: "", fuelType: "", transmission: "", trim: "" }); };
  const changeModel = (value: string) => { setModel(value); setEngine(""); setFuelType(""); setTransmission(""); setTrim(""); onVehicleChange?.({ ...vehicle, model: value, engine: "", fuelType: "", transmission: "", trim: "" }); };
  const changeTrim = (value: string) => { setTrim(value); onVehicleChange?.({ ...vehicle, trim: value }); };
  const engineOptions = optionsFor({ year: Number(year), brand, model }, "engine");
  const ready = Boolean(year && brand.trim() && model.trim() && mileage !== "" && Number(mileage) >= 0);
  return <>
    <section className="valuation-section" id="teklif-formu" aria-labelledby="valuation-title"><div className="valuation-card"><div className="valuation-heading"><span className="section-index">ÜCRETSİZ TEKLİF BAŞVURUSU</span><h2 id="valuation-title">Aracını anlat,<br /><em>teklif iste.</em></h2><p>Önce temel bilgileri seç. Sonraki adımlarda aracın durumunu anlatıp fotoğraf ekleyebilirsin.</p><div className="valuation-benefits"><span><Check size={16} /> İlan hazırlamadan başvur</span><span><Check size={16} /> Hasarı açıkça anlat</span><span><Check size={16} /> Teklifi değerlendir, kararını ver</span></div></div><div className="valuation-form"><BrandSelect value={brand} onChange={changeBrand} /><label className="valuation-field"><span>Model yılı</span><select value={year} onChange={(event) => changeYear(event.target.value)}><option value="">Yıl seçin</option>{Array.from({ length: 70 }, (_, index) => new Date().getFullYear() + 1 - index).map((item) => <option value={item} key={item}>{item}</option>)}</select></label><ModelSelect brand={brand} value={model} onChange={changeModel} /><label className="valuation-field"><span>Motor</span><select value={engine} disabled={!model} onChange={(event) => { setEngine(event.target.value); setFuelType(""); setTransmission(""); setTrim(""); }}><option value="">Motor seçin</option>{engineOptions.map((item) => <option key={item}>{item}</option>)}<option value="Bilmiyorum">Bilmiyorum</option></select></label><label className="valuation-field"><span>Yakıt tipi</span><select value={fuelType} disabled={!engine} onChange={(event) => { setFuelType(event.target.value); setTransmission(""); setTrim(""); }}><option value="">Yakıt seçin</option>{[...new Set([...optionsFor({ year: Number(year), brand, model, engine }, "fuelType"), "Benzin", "Dizel", "LPG", "Hibrit", "Elektrik", "Bilmiyorum"])].map((item) => <option key={item}>{item}</option>)}</select></label><label className="valuation-field"><span>Vites</span><select value={transmission} disabled={!fuelType} onChange={(event) => { setTransmission(event.target.value); setTrim(""); }}><option value="">Vites seçin</option>{[...new Set([...optionsFor({ year: Number(year), brand, model, engine, fuelType }, "transmission"), "Manuel", "Otomatik", "Yarı otomatik", "Bilmiyorum"])].map((item) => <option key={item}>{item}</option>)}</select></label><PackageSelect year={Number(year)} brand={brand} model={model} engine={engine} fuelType={fuelType} transmission={transmission} value={trim} onChange={changeTrim} /><label className="valuation-field"><span>Kilometre</span><input type="number" min="0" value={mileage} onChange={(event) => changeMileage(event.target.value)} placeholder="Örn. 85000" inputMode="numeric" /></label><div className="valuation-submit-wrap"><button className="button button--primary valuation-submit" type="button" onClick={() => setWizardOpen(true)} disabled={!ready}><span><Sparkles size={16} /> Devam et</span><ArrowRight size={17} /></button><small>{ready ? "Hazır! Araç durumu ve fotoğraflarla devam edin." : "Devam etmek için yıl, marka, model ve kilometreyi girin."}</small></div></div></div></section>{wizardOpen && <ValuationWizard vehicle={vehicle} onClose={() => setWizardOpen(false)} />}</>;
}
