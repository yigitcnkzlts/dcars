import { BadgeCheck, Gauge, Gem, Settings2 } from "lucide-react";

const features = [[Gauge, "SUV", "Heybetli ve çok yönlü"], [Settings2, "8 ileri Tiptronic", "Akıcı vites geçişleri"], [Gem, "quattro", "Dört tekerlekten çekiş"], [BadgeCheck, "Premium", "Seçkin donanım"]] as const;

export function VehicleFeatureIcons() {
  return <div className="vehicle-features" aria-label="Audi Q8 özellikleri">{features.map(([Icon, title, detail]) => <div className="vehicle-feature" key={title}><Icon size={17} /><span><strong>{title}</strong><small>{detail}</small></span></div>)}</div>;
}
