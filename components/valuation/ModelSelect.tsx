"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { getModelsForBrand, getPopularModelsForBrand } from "@/services/vehicleDataService";

type Props = { brand: string; year?: string; value: string; onChange: (value: string) => void; grid?: boolean };

export function ModelSelect({ brand, year, value, onChange, grid = false }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const models = getModelsForBrand(brand);
  const popular = getPopularModelsForBrand(brand);
  const normalize = (text: string) => text.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const matchesQuery = (model: string) => normalize(model).includes(normalize(query));
  const matches = models.filter(matchesQuery).slice(0, 80);
  const popularMatches = popular.filter(matchesQuery);

  if (grid) {
    return (
      <div className="model-picker valuation-field">
        <label className="selection-search" htmlFor="vehicle-model-search">
          <Search size={18} aria-hidden="true" />
          <input id="vehicle-model-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Modele göre ara" autoComplete="off" />
        </label>
        {!query && popularMatches.length > 0 && (
          <>
            <h5>En çok seçilen modeller</h5>
            <div className="model-picker__grid">
              {popularMatches.slice(0, 8).map((model) => (
                <button type="button" key={`popular-${model}`} aria-pressed={value === model} className={value === model ? "is-selected" : ""} onClick={() => onChange(model)}>{model}</button>
              ))}
            </div>
          </>
        )}
        <h5>Tüm modeller</h5>
        <div className="model-picker__grid">
          {matches.map((model) => (
            <button type="button" key={model} aria-pressed={value === model} className={value === model ? "is-selected" : ""} onClick={() => onChange(model)}>{model}</button>
          ))}
        </div>
        {!matches.length && <small>Aramanızla eşleşen model bulunamadı.</small>}
      </div>
    );
  }

  const disabled = !brand || (year !== undefined && !year);
  return (
    <div className="model-picker valuation-field">
      <label htmlFor="vehicle-model-search">Model</label>
      <input id="vehicle-model-search" type="search" role="combobox" aria-expanded={open} aria-controls="vehicle-model-results" value={open ? query : value} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); if (event.key === "Enter" && matches.length === 1) { event.preventDefault(); onChange(matches[0]); setOpen(false); setQuery(""); } }} placeholder={disabled ? "Önce marka ve model yılı seçin" : "Modele göre ara"} disabled={disabled} autoComplete="off" />
      {open && !disabled && (
        <div id="vehicle-model-results" className="model-results" role="listbox">
          {matches.map((model) => <button type="button" role="option" aria-selected={model === value} key={model} onClick={() => { onChange(model); setOpen(false); setQuery(""); }}>{model}</button>)}
          {!matches.length && <small>Aramanızla eşleşen model bulunamadı.</small>}
          <button type="button" className="model-picker__close" onClick={() => setOpen(false)}>Listeyi kapat</button>
        </div>
      )}
      {!disabled && <small>{models.length} model seçeneği</small>}
    </div>
  );
}
