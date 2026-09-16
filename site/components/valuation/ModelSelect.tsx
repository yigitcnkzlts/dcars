"use client";

import { getModelsForBrand } from "@/services/vehicleDataService";

type Props = { brand: string; value: string; onChange: (value: string) => void };

export function ModelSelect({ brand, value, onChange }: Props) {
  const models = getModelsForBrand(brand);
  return <label className="valuation-field"><span>Model</span><select value={value} onChange={(event) => onChange(event.target.value)} disabled={!brand}><option value="">{brand ? "Model seçin" : "Önce marka seçin"}</option>{models.map((model) => <option key={model} value={model}>{model}</option>)}</select>{brand && <small>{models.length} hazır model seçeneği</small>}</label>;
}
