"use client";

import { useState } from "react";
import { getModelsForBrand } from "@/services/vehicleDataService";

type Props = { brand: string; value: string; onChange: (value: string) => void };

export function ModelSelect({ brand, value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const models = getModelsForBrand(brand);
  const normalize = (text: string) => text.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const matches = models.filter((model) => normalize(model).includes(normalize(query))).slice(0, 80);
  return <div className="model-picker valuation-field"><label htmlFor="vehicle-model-search">Model</label><input id="vehicle-model-search" type="search" role="combobox" aria-expanded={open} aria-controls="vehicle-model-results" value={open ? query : value} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); if (event.key === "Enter" && matches.length === 1) { event.preventDefault(); onChange(matches[0]); setOpen(false); setQuery(""); } }} placeholder={brand ? "Model ara veya seç" : "Önce marka seçin"} disabled={!brand} autoComplete="off" />{open && brand && <div id="vehicle-model-results" className="model-results" role="listbox">{matches.map((model) => <button type="button" role="option" aria-selected={model === value} key={model} onClick={() => { onChange(model); setOpen(false); setQuery(""); }}>{model}</button>)}{!matches.length && <small>Model bulunamadı; manuel giriş kullanabilirsiniz.</small>}<button type="button" className="model-picker__close" onClick={() => setOpen(false)}>Listeyi kapat</button></div>}{brand && <small>{models.length} model seçeneği</small>}</div>;
}
