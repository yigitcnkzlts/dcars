import { ArrowRight, Scale } from "lucide-react";

export function VehicleComparison({ prompt }: { prompt: string }) {
  return <div className="vehicle-comparison"><div className="comparison-title"><Scale size={17} /><strong>Karşılaştırma modu</strong><span>{prompt}</span></div><div className="comparison-grid">{["Performans", "Yakıt", "Konfor", "Bagaj", "Güvenlik", "Bakım", "İkinci el", "Fiyat / performans"].map((label) => <div key={label}><span>{label}</span><b>Versiyona göre değişir</b></div>)}</div><p><strong>Kim hangisini tercih etmeli?</strong> Karar verirken kullanım şekliniz, motor seçeneği ve doğrulanmış güncel fiyat verisi birlikte değerlendirilmelidir.</p><button type="button">Detaylı kıyas isteyin <ArrowRight size={15} /></button></div>;
}
