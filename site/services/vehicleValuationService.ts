import type { ValuationRequest } from "@/types/valuation";

export type ValuationEstimate = { low: number; midpoint: number; high: number; confidence: "Orta" | "Yüksek"; indexDate: string };

const brandBase: Record<string, number> = {
  "Audi": 4_150_000, "BMW": 4_250_000, "Mercedes-Benz": 4_450_000, "Porsche": 8_900_000,
  "Land Rover": 6_100_000, "Range Rover": 7_200_000, "Volvo": 3_650_000, "Lexus": 4_300_000,
  "Volkswagen": 2_250_000, "Toyota": 1_950_000, "Honda": 1_800_000, "Hyundai": 1_650_000,
  "Kia": 1_700_000, "Renault": 1_500_000, "Peugeot": 1_650_000, "Citroen": 1_500_000,
  "Fiat": 1_250_000, "Ford": 1_650_000, "Opel": 1_550_000, "Skoda": 1_850_000,
  "Seat": 1_650_000, "Cupra": 2_600_000, "Nissan": 1_750_000, "Tesla": 2_650_000,
  "BYD": 2_150_000, "Chery": 1_850_000, "MG": 1_750_000,
};

function modelWeight(model = "") {
  if (/Q8|Q7|X7|X6|X5|S-Serisi|GLE|GLS|Cayenne|911|Panamera|Defender|Range Rover|XC90|Land Cruiser/i.test(model)) return 1.55;
  if (/A3|A-Serisi|1 Serisi|i10|i20|Yaris|Clio|208|C3|Egea|Polo|Fabia|Ibiza|Corsa/i.test(model)) return .72;
  return 1;
}

export function estimateVehicleValue(vehicle: ValuationRequest): ValuationEstimate {
  const base = brandBase[vehicle.brand ?? ""] ?? 1_650_000;
  const age = Math.max(0, 2026 - (vehicle.year ?? 2020));
  const ageFactor = Math.max(.22, Math.pow(.88, age));
  const mileage = Number(vehicle.mileage) || age * 15_000;
  const expectedMileage = Math.max(10_000, age * 15_000);
  const mileageFactor = Math.min(1.08, Math.max(.72, 1 - ((mileage - expectedMileage) / 500_000)));
  const condition = (vehicle.condition ?? "").toLocaleLowerCase("tr-TR");
  const conditionFactor = condition.includes("çok iyi") ? 1.05 : condition.includes("orta") ? .9 : .98;
  const damageFactor = /var|evet/i.test(vehicle.severeDamage ?? "") ? .72 : (vehicle.replacedParts || vehicle.paintedParts) ? .92 : 1;
  const transmissionFactor = /otomatik|dsg|tiptronic|cvt/i.test(vehicle.transmission ?? "") ? 1.04 : 1;
  const midpoint = Math.round((base * modelWeight(vehicle.model) * ageFactor * mileageFactor * conditionFactor * damageFactor * transmissionFactor) / 10_000) * 10_000;
  const spread = vehicle.engine && vehicle.trim && vehicle.condition ? .075 : .11;
  return { low: Math.round(midpoint * (1 - spread) / 10_000) * 10_000, midpoint, high: Math.round(midpoint * (1 + spread) / 10_000) * 10_000, confidence: spread < .1 ? "Yüksek" : "Orta", indexDate: "Eylül 2026" };
}
