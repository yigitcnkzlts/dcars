"use client";

import { trimOptionsFor } from "@/services/vehicleCatalogService";

type Props = { year?: number; brand: string; model: string; engine?: string; fuelType?: string; transmission?: string; value: string; onChange: (value: string) => void };

export function PackageSelect({ year, brand, model, engine, fuelType, transmission, value, onChange }: Props) {
  const verified = trimOptionsFor({ year, brand, model, engine, fuelType, transmission });
  return <label className="valuation-field"><span>Donanım paketi (ör. Sky Pack)</span><select value={value} onChange={(event) => onChange(event.target.value)} disabled={!model.trim()}><option value="">{model ? "Paket seçin" : "Önce model seçin"}</option>{verified.map((item) => <option key={item} value={item}>{item}</option>)}<option value="Bilmiyorum">Bilmiyorum</option></select><small>{verified.length ? "Seçilen yıl ve motor için üretici kaynağında bulunan paketler." : "Bu araç için doğrulanmış paket bulunamadı; bilmiyorum seçeneğini kullanabilirsiniz."}</small></label>;
}
