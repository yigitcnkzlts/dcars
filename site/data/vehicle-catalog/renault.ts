import type { VehicleVariant } from "./variants";

const source2020 = "https://www.oyak-renault.com/wp-content/uploads/2020/06/OYAK-Grup-Sirketleri-Otomobil-Kampanyasi-Fiyat-Listesi-2020.pdf";
const source2021 = "https://www.oyak-renault.com/wp-content/uploads/2022/01/OR-Mais-Satis-Kampanyasi-100122.pdf";
const austral2023Source = "https://www.renault.com.tr/renault-haberler/renault-haberler-urun-lansman/renault-haberler-urun-lansman-yeni-austral-e-tech-full-hybrid.html";

type Combination = {
  model: string;
  generation: string;
  bodyType: string;
  year: number;
  engine: string;
  powerHp: number;
  fuelType: string;
  transmission: string;
  trims: readonly string[];
  sourceUrl: string;
};

// Every trim in a combination appears beside that engine and gearbox in the
// manufacturer price list. The years describe the evidenced model year only.
const combinations: Combination[] = [
  { model: "Clio", generation: "Clio IV", bodyType: "Hatchback", year: 2020, engine: "0.9 TCe 90 bg", powerHp: 90, fuelType: "Benzin", transmission: "Manuel", trims: ["Joy"], sourceUrl: source2020 },
  { model: "Clio Sport Tourer", generation: "Clio IV", bodyType: "Station Wagon", year: 2020, engine: "0.9 TCe 90 bg", powerHp: 90, fuelType: "Benzin", transmission: "Manuel", trims: ["Joy"], sourceUrl: source2020 },
  { model: "Clio", generation: "Clio V", bodyType: "Hatchback", year: 2020, engine: "1.0 SCe 72 bg", powerHp: 72, fuelType: "Benzin", transmission: "5 ileri Manuel", trims: ["Joy"], sourceUrl: source2020 },
  { model: "Clio", generation: "Clio V", bodyType: "Hatchback", year: 2020, engine: "1.0 TCe 100 bg", powerHp: 100, fuelType: "Benzin", transmission: "X-Tronic", trims: ["Joy", "Touch", "Icon"], sourceUrl: source2020 },
  { model: "Clio", generation: "Clio V", bodyType: "Hatchback", year: 2020, engine: "1.0 TCe 100 bg", powerHp: 100, fuelType: "Benzin", transmission: "5 ileri Manuel", trims: ["Touch", "Icon"], sourceUrl: source2020 },
  { model: "Clio", generation: "Clio V", bodyType: "Hatchback", year: 2020, engine: "1.3 TCe 130 bg", powerHp: 130, fuelType: "Benzin", transmission: "EDC", trims: ["Touch", "Icon"], sourceUrl: source2020 },
  { model: "Clio", generation: "Clio V", bodyType: "Hatchback", year: 2020, engine: "1.5 Blue dCi 85 bg", powerHp: 85, fuelType: "Dizel", transmission: "Manuel", trims: ["Joy"], sourceUrl: source2020 },
  { model: "Clio", generation: "Clio V", bodyType: "Hatchback", year: 2020, engine: "1.5 Blue dCi 115 bg", powerHp: 115, fuelType: "Dizel", transmission: "Manuel", trims: ["Touch", "Icon"], sourceUrl: source2020 },
  { model: "Symbol", generation: "Symbol III", bodyType: "Sedan", year: 2020, engine: "0.9 TCe 90 bg", powerHp: 90, fuelType: "Benzin", transmission: "Manuel", trims: ["Joy"], sourceUrl: source2020 },
  { model: "Kadjar", generation: "Kadjar I", bodyType: "SUV", year: 2020, engine: "1.3 TCe 160 bg", powerHp: 160, fuelType: "Benzin", transmission: "EDC", trims: ["Touch Roof"], sourceUrl: source2020 },
  { model: "Megane", generation: "Megane IV Sedan", bodyType: "Sedan", year: 2020, engine: "1.3 TCe 140 bg", powerHp: 140, fuelType: "Benzin", transmission: "Manuel", trims: ["Joy"], sourceUrl: source2020 },
  { model: "Megane", generation: "Megane IV Sedan", bodyType: "Sedan", year: 2020, engine: "1.3 TCe 140 bg", powerHp: 140, fuelType: "Benzin", transmission: "EDC", trims: ["Joy", "Touch", "Icon"], sourceUrl: source2020 },
  { model: "Megane", generation: "Megane IV Sedan", bodyType: "Sedan", year: 2020, engine: "1.5 Blue dCi 115 bg", powerHp: 115, fuelType: "Dizel", transmission: "Manuel", trims: ["Joy"], sourceUrl: source2020 },
  { model: "Megane", generation: "Megane IV Sedan", bodyType: "Sedan", year: 2020, engine: "1.5 Blue dCi 115 bg", powerHp: 115, fuelType: "Dizel", transmission: "EDC", trims: ["Joy", "Touch", "Icon"], sourceUrl: source2020 },
  { model: "Clio", generation: "Clio V", bodyType: "Hatchback", year: 2021, engine: "1.0 TCe 90 bg", powerHp: 90, fuelType: "Benzin", transmission: "X-Tronic", trims: ["Joy", "Touch"], sourceUrl: source2021 },
  { model: "Megane", generation: "Megane IV Sedan", bodyType: "Sedan", year: 2021, engine: "1.3 TCe 140 bg", powerHp: 140, fuelType: "Benzin", transmission: "EDC", trims: ["Joy"], sourceUrl: source2021 },
  { model: "Captur", generation: "Captur II", bodyType: "SUV", year: 2021, engine: "1.3 TCe 140 bg", powerHp: 140, fuelType: "Benzin", transmission: "EDC", trims: ["Touch"], sourceUrl: source2021 },
  { model: "Austral", generation: "Austral I", bodyType: "SUV", year: 2023, engine: "E-Tech Full Hybrid 200 hp", powerHp: 200, fuelType: "Hibrit", transmission: "Otomatik", trims: ["Techno Esprit Alpine"], sourceUrl: austral2023Source },
];

export const renaultVariants: VehicleVariant[] = combinations.flatMap((item) => item.trims.map((trim) => ({
  year: item.year,
  yearFrom: item.year,
  yearTo: item.year,
  brand: "Renault",
  model: item.model,
  generation: item.generation,
  bodyType: item.bodyType,
  engine: item.engine,
  powerHp: item.powerHp,
  fuelType: item.fuelType,
  transmission: item.transmission,
  version: `${item.engine} · ${item.transmission}`,
  trim,
  factoryEquipment: [],
  sourceUrl: item.sourceUrl,
  sourceUrls: [item.sourceUrl],
  verified: true,
  lastUpdated: "2026-09-21",
})));
