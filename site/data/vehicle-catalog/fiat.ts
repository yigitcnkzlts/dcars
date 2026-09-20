import type { VehicleVariant } from "./variants";

// Archived Fiat November 2020 Turkish price list, pages 1-3 and 7-9.
const sourceUrl = "https://egehabercom.teimg.com/egehaber-com/wp/uploads/2020/11/OtomobilFiyatListesi.pdf";
type Offer = [model: string, bodyType: string, engine: string, powerHp: number, fuelType: string, transmission: string, trims: string[]];
const offers: Offer[] = [
  ["Egea", "Sedan", "1.4 Fire 95 HP", 95, "Benzin", "Manuel", ["Easy", "Urban Plus", "Mirror"]],
  ["Egea", "Sedan", "1.3 Multijet 95 HP", 95, "Dizel", "Manuel", ["Easy", "Urban Plus", "Mirror"]],
  ["Egea", "Sedan", "1.6 Multijet 120 HP", 120, "Dizel", "Manuel", ["Urban Plus", "Mirror", "Lounge Plus"]],
  ["Egea", "Sedan", "1.6 Multijet 120 HP", 120, "Dizel", "DCT", ["Easy", "Urban Plus", "Mirror", "Lounge Plus"]],
  ["Egea Hatchback", "Hatchback", "1.4 Fire 95 HP", 95, "Benzin", "Manuel", ["Street", "Urban Plus", "Mirror"]],
  ["Egea Hatchback", "Hatchback", "1.3 Multijet 95 HP", 95, "Dizel", "Manuel", ["Street", "Urban Plus", "Mirror"]],
  ["Egea Hatchback", "Hatchback", "1.6 Multijet 120 HP", 120, "Dizel", "DCT", ["Street", "Urban Plus", "Mirror", "S-Design", "Sport"]],
  ["500", "Hatchback", "1.2 Fire 69 HP", 69, "Benzin", "MTA", ["Popstar", "Lounge", "Star", "Rockstar"]],
  ["500L", "MPV", "1.4 Fire 95 HP", 95, "Benzin", "Manuel", ["Mirror", "Cross Plus"]],
  ["500L", "MPV", "1.3 Multijet 95 HP", 95, "Dizel", "MTA", ["Mirror", "Cross Plus", "Wagon"]],
  ["500X", "SUV", "1.0 FireFly 120 HP", 120, "Benzin", "Manuel", ["Urban"]],
  ["500X", "SUV", "1.3 FireFly 150 HP", 150, "Benzin", "DCT", ["Cross", "Sport"]],
  ["500X", "SUV", "1.6 Multijet 120 HP", 120, "Dizel", "DCT", ["City Cross", "Cross", "Cross Plus"]],
];

export const fiatVariants: VehicleVariant[] = offers.flatMap(([model, bodyType, engine, powerHp, fuelType, transmission, trims]) => trims.map((trim) => ({
  year: 2020, yearFrom: 2020, yearTo: 2020,
  brand: "Fiat", model, generation: model === "Egea" || model === "Egea Hatchback" ? "Egea I" : `${model} 2020`, bodyType,
  engine, powerHp, fuelType, transmission, version: `${engine} · ${transmission}`, trim,
  factoryEquipment: [], sourceUrl, sourceUrls: [sourceUrl], verified: true, verifiedLevel: "official" as const, lastUpdated: "2026-09-21",
})));
