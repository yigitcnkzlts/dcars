import type { ValuationRequest } from "@/types/valuation";

export type ValuationEstimate = {
  low: number;
  midpoint: number;
  high: number;
  basis: "illustrative";
  adjustments: { label: string; value: string; tone: "positive" | "negative" | "neutral" }[];
};

const brandBase: Record<string, number> = {
  "Audi": 4_150_000, "BMW": 4_250_000, "Mercedes-Benz": 4_450_000, "Porsche": 8_900_000,
  "Land Rover": 6_100_000, "Range Rover": 7_200_000, "Volvo": 3_650_000, "Lexus": 4_300_000,
  "Volkswagen": 2_250_000, "Toyota": 1_950_000, "Honda": 1_800_000, "Hyundai": 1_650_000,
  "Kia": 1_700_000, "Renault": 1_500_000, "Peugeot": 1_650_000, "Citroen": 1_500_000,
  "Fiat": 1_250_000, "Ford": 1_650_000, "Opel": 1_550_000, "Skoda": 1_850_000,
  "Seat": 1_650_000, "Cupra": 2_600_000, "Nissan": 1_750_000, "Tesla": 2_650_000,
  "BYD": 2_150_000, "Chery": 1_850_000, "MG": 1_750_000,
};

// Illustrative fixtures only: these prices and multipliers are NOT market data.
// Do not expose this calculation as an appraisal or a confidence-scored quote.
const modelBase: Record<string, number> = {
  "Toyota|Corolla": 2_350_000,
  "Toyota|Yaris": 1_850_000,
  "Toyota|C-HR": 2_650_000,
  "Renault|Clio": 1_550_000,
  "Renault|Megane": 2_050_000,
  "Fiat|Egea": 1_450_000,
  "Volkswagen|Polo": 1_850_000,
  "Volkswagen|Golf": 2_450_000,
  "Volkswagen|Passat": 3_250_000,
  "BMW|3 Serisi": 4_050_000,
  "Mercedes-Benz|C-Serisi": 4_250_000,
  "Nissan|Qashqai": 2_750_000,
  "Hyundai|i20": 1_550_000,
  "Hyundai|Tucson": 2_850_000,
  "Peugeot|3008": 2_850_000,
};

function modelWeight(model = "") {
  if (/Q8|Q7|X7|X6|X5|S-Serisi|GLE|GLS|Cayenne|911|Panamera|Defender|Range Rover|XC90|Land Cruiser/i.test(model)) return 1.55;
  if (/A3|A-Serisi|1 Serisi|i10|i20|Yaris|Clio|208|C3|Egea|Polo|Fabia|Ibiza|Corsa/i.test(model)) return .72;
  return 1;
}

export function estimateVehicleValue(vehicle: Partial<ValuationRequest>): ValuationEstimate {
  const base = modelBase[`${vehicle.brand}|${vehicle.model}`] ?? brandBase[vehicle.brand ?? ""] ?? 1_650_000;
  const age = Math.max(0, new Date().getFullYear() - (vehicle.year ?? new Date().getFullYear()));
  const ageFactor = Math.max(.22, Math.pow(.88, age));
  const mileage = vehicle.mileage === undefined ? age * 15_000 : Math.max(0, Number(vehicle.mileage) || 0);
  const expectedMileage = Math.max(10_000, age * 15_000);
  const mileageFactor = Math.min(1.08, Math.max(.72, 1 - ((mileage - expectedMileage) / 500_000)));
  const condition = (vehicle.condition ?? "").toLocaleLowerCase("tr-TR");
  const conditionFactor = condition.includes("çok iyi") ? 1.05 : condition.includes("orta") ? .9 : .98;
  const replacedCount = vehicle.replacedParts?.split(",").filter(Boolean).length ?? 0;
  const paintedCount = vehicle.paintedParts?.split(",").filter(Boolean).length ?? 0;
  const damageFactor = /var|evet/i.test(vehicle.severeDamage ?? "") ? .72 : Math.max(.76, 1 - replacedCount * .035 - paintedCount * .012);
  const transmissionFactor = /otomatik|dsg|tiptronic|cvt/i.test(vehicle.transmission ?? "") ? 1.04 : 1;
  const fuelFactor = /hibrit/i.test(vehicle.fuelType ?? "") ? 1.06 : /elektrik/i.test(vehicle.fuelType ?? "") ? .98 : 1;
  const midpoint = Math.round((base * (modelBase[`${vehicle.brand}|${vehicle.model}`] ? 1 : modelWeight(vehicle.model)) * ageFactor * mileageFactor * conditionFactor * damageFactor * transmissionFactor * fuelFactor) / 10_000) * 10_000;
  const spread = .15;
  const mileageDifference = mileage - expectedMileage;
  const adjustments: ValuationEstimate["adjustments"] = [
    { label: `${age} yaş araç etkisi`, value: `${Math.round((ageFactor - 1) * 100)}%`, tone: age ? "negative" : "neutral" },
    { label: `${new Intl.NumberFormat("tr-TR").format(mileage)} km`, value: `${mileageDifference <= 0 ? "+" : ""}${Math.round((mileageFactor - 1) * 100)}%`, tone: mileageFactor >= 1 ? "positive" : "negative" },
    { label: vehicle.transmission || "Vites belirtilmedi", value: transmissionFactor > 1 ? "+%4" : "%0", tone: transmissionFactor > 1 ? "positive" : "neutral" },
    { label: replacedCount || paintedCount ? `${replacedCount} değişen · ${paintedCount} boyalı` : "Orijinal gövde", value: `${damageFactor < 1 ? "" : "+"}${Math.round((damageFactor - 1) * 100)}%`, tone: damageFactor < 1 ? "negative" : "positive" },
  ];
  return { low: Math.round(midpoint * (1 - spread) / 10_000) * 10_000, midpoint, high: Math.round(midpoint * (1 + spread) / 10_000) * 10_000, basis: "illustrative", adjustments };
}
