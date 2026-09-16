"use client";

import { useState } from "react";

const slugs: Record<string, string> = {
  "Mercedes-Benz": "mercedesbenz", "Alfa Romeo": "alfaromeo", "Land Rover": "landrover", "Range Rover": "landrover", "DS Automobiles": "dsautomobiles", "Rolls-Royce": "rollsroyce", "Aston Martin": "astonmartin", "TOFAŞ": "fiat", "Seat Cupra": "cupra", "SsangYong": "kgmobility", "Citroen": "citroen",
};

export function BrandLogo({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const slug = slugs[name] ?? name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return <span className="brand-result__mark" aria-hidden="true">{failed ? name.slice(0, 2).toLocaleUpperCase("tr-TR") : <img src={`https://cdn.simpleicons.org/${slug}`} alt="" loading="lazy" onError={() => setFailed(true)} />}</span>;
}
