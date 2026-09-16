"use client";

import { useState } from "react";
import { getPackageSuggestions } from "@/services/vehiclePackageService";

type Props = { brand: string; model: string; value: string; onChange: (value: string) => void };

export function PackageSelect({ brand, model, value, onChange }: Props) {
  const [focused, setFocused] = useState(false);
  const suggestions = getPackageSuggestions(brand, model);
  const matches = suggestions.filter((item) => item.toLocaleLowerCase("tr-TR").includes(value.trim().toLocaleLowerCase("tr-TR")));
  return <div className="valuation-field model-picker package-picker"><label htmlFor="valuation-package">Paket / donanım <span>(isteğe bağlı)</span></label><input id="valuation-package" value={value} onChange={(event) => onChange(event.target.value)} onFocus={() => setFocused(true)} placeholder={model ? "Paket seçin veya yazın" : "Önce model seçin"} disabled={!model.trim()} autoComplete="off" />
    {focused && matches.length > 0 && <div className="model-results" aria-label="Paket önerileri">{matches.map((item) => <button type="button" key={item} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(item); setFocused(false); }}>{item}</button>)}</div>}
    {focused && suggestions.length > 0 && <button type="button" className="model-picker__close" onClick={() => setFocused(false)}>Önerileri kapat</button>}
    {model && <small>{suggestions.length > 0 ? `${suggestions.length} paket önerisi · Yıla ve motora göre değişebilir.` : "Bu model için doğrulanmış paket listesi yok; paket adını yazabilirsiniz."}</small>}
  </div>;
}
