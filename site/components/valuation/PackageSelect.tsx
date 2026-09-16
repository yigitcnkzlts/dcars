"use client";

import { getPackageSuggestions } from "@/services/vehiclePackageService";

type Props = { brand: string; model: string; value: string; onChange: (value: string) => void };

export function PackageSelect({ brand, model, value, onChange }: Props) {
  const suggestions = getPackageSuggestions(brand, model);
  return <label className="valuation-field"><span>Paket / donanım (isteğe bağlı)</span><select value={value} onChange={(event) => onChange(event.target.value)} disabled={!model.trim()}><option value="">{model ? "Paket seçin" : "Önce model seçin"}</option>{suggestions.map((item) => <option key={item} value={item}>{item}</option>)}<option value="Bilmiyorum">Bilmiyorum</option></select><small>Öneriler model yılı ve motora göre doğrulanmalıdır.</small></label>;
}
