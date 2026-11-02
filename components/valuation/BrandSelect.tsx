"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { vehicleBrands } from "@/services/vehicleDataService";
import { BrandLogo } from "./BrandLogo";

type Props = { value: string; onChange: (value: string) => void; disabled?: boolean };
const popular = ["Volkswagen", "Renault", "Fiat", "Toyota", "Ford", "BMW", "Mercedes-Benz", "Hyundai"];
const normalize = (value: string) => value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function BrandSelect({ value, onChange, disabled = false }: Props) {
  const [query, setQuery] = useState("");
  const matches = vehicleBrands.filter((brand) => normalize(brand.name).includes(normalize(query.trim())));
  const select = (brand: string) => { onChange(brand); setQuery(""); };
  return (
    <fieldset className="brand-picker">
      <legend className="sr-only">Marka seçin</legend>
      <label className="selection-search">
        <Search size={18} aria-hidden="true" />
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Markaya göre ara" aria-label="Markaya göre ara" autoComplete="off" disabled={disabled} />
      </label>
      {!query && (
        <>
          <span className="brand-picker__hint">Sık seçilen markalar</span>
          <div className="brand-popular">
            {popular.map((brand) => (
              <button type="button" key={brand} onClick={() => select(brand)} aria-pressed={value === brand} disabled={disabled}>
                <BrandLogo name={brand} />{brand}
              </button>
            ))}
          </div>
        </>
      )}
      <span className="brand-picker__hint">{query ? "Arama sonuçları" : "Tüm markalar"}</span>
      <div className="brand-results" aria-label="Marka sonuçları">
        {matches.length ? matches.map((brand) => (
          <button type="button" key={brand.name} onClick={() => select(brand.name)} className={value === brand.name ? "brand-result brand-result--active" : "brand-result"} disabled={disabled}>
            <BrandLogo name={brand.name} />{brand.name}
          </button>
        )) : <span className="brand-result brand-result--custom">Bu marka katalogda bulunmuyor.</span>}
      </div>
    </fieldset>
  );
}
