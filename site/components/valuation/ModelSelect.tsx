"use client";

import { useState } from "react";
import { getModelsForBrand } from "@/services/vehicleDataService";

type Props = { brand: string; value: string; onChange: (value: string) => void };

export function ModelSelect({ brand, value, onChange }: Props) {
  const [focused, setFocused] = useState(false);
  const models = getModelsForBrand(brand);
  const matches = models.filter((model) => model.toLocaleLowerCase("tr-TR").includes(value.trim().toLocaleLowerCase("tr-TR"))).slice(0, 12);
  return <div className="valuation-field model-picker"><label htmlFor="valuation-model">Model</label><input id="valuation-model" value={value} onChange={(event) => onChange(event.target.value)} onFocus={() => setFocused(true)} placeholder={brand ? "Model ara veya yazın" : "Önce marka seçin"} disabled={!brand} autoComplete="off" />
    {focused && brand && matches.length > 0 && <div className="model-results" aria-label="Model önerileri">{matches.map((model) => <button type="button" key={model} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(model); setFocused(false); }}>{model}</button>)}</div>}
    {focused && brand && <button type="button" className="model-picker__close" onClick={() => setFocused(false)}>Önerileri kapat</button>}
    {brand && <small>Model listede yoksa adını yazabilirsiniz.</small>}
  </div>;
}
