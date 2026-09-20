import type { VehicleVariant } from "./variants";

// Manufacturer announcements name the exact Turkish market engine, gearbox and trim combinations.
const source2024 = "https://basin.peugeot.com.tr/elektrikli-peugeot-208-turkiyede-yollara-cikti";
const source2026 = "https://basin.peugeot.com.tr/peugeot-408-ve-2008-48v-hibrit-teknolojili-yeni-motor-secenekleri-ile-turkiyede";

const offers: VehicleVariant[] = [
  { year: 2024, brand: "Peugeot", model: "208", generation: "II facelift", engine: "1.2 PureTech 100 HP", powerHp: 100, fuelType: "Benzin", transmission: "EAT8", version: "1.2 PureTech 100 HP · EAT8", trim: "Active Prime", factoryEquipment: [], sourceUrl: source2024, verified: true, lastUpdated: "2026-09-21" },
  ...(["Allure", "GT"] as const).map((trim): VehicleVariant => ({ year: 2024, brand: "Peugeot", model: "208", generation: "II facelift", engine: "1.2 PureTech 130 HP", powerHp: 130, fuelType: "Benzin", transmission: "EAT8", version: "1.2 PureTech 130 HP · EAT8", trim, factoryEquipment: [], sourceUrl: source2024, verified: true, lastUpdated: "2026-09-21" })),
  { year: 2024, brand: "Peugeot", model: "E-208", generation: "II facelift", engine: "Electric 100 kW", motorPowerKw: 100, fuelType: "Elektrik", transmission: "Otomatik", version: "Electric 100 kW · Otomatik", trim: "GT", factoryEquipment: [], sourceUrl: source2024, verified: true, lastUpdated: "2026-09-21" },
  ...(["2008", "408"] as const).flatMap((model) => (["Allure", "GT"] as const).map((trim): VehicleVariant => ({ year: 2026, brand: "Peugeot", model, generation: model === "2008" ? "II facelift" : "I", engine: "1.2 Hybrid 145 HP", powerHp: 145, fuelType: "Hibrit", transmission: "eDCS6", version: "1.2 Hybrid 145 HP · eDCS6", trim, factoryEquipment: [], sourceUrl: source2026, verified: true, lastUpdated: "2026-09-21" }))),
];

export const peugeotVariants: VehicleVariant[] = offers.map((offer) => ({
  ...offer,
  yearFrom: offer.year,
  yearTo: offer.year,
  bodyType: offer.model === "2008" ? "SUV" : offer.model === "408" ? "Fastback" : "Hatchback",
  sourceUrls: [offer.sourceUrl],
}));
