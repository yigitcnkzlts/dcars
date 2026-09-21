import type { VehicleVariant } from "./variants";

// Contemporaneous 2021 Turkish price reports agree on this saleable variant.
// Model year is limited to 2021; later BMW pages do not prove its 2021 trim.
const sourceUrls = [
  "https://www.arabam.com/blog/genel/2021-nisan-bmw-fiyat-listesi-aciklandi/",
  "https://www.oopscars.com/2021-mart-bmw-4-serisi-coupe-fiyat-listesi-ne-oldu/",
];

export const bmwVariants: VehicleVariant[] = [{
  year: 2021, yearFrom: 2021, yearTo: 2021,
  brand: "BMW", model: "4 Serisi", generation: "4 Serisi G22", bodyType: "Coupé",
  engine: "420i", powerHp: 170, fuelType: "Benzin", transmission: "Otomatik",
  version: "420i Coupé Edition M Sport", trim: "Edition M Sport", factoryEquipment: [],
  sourceUrl: sourceUrls[0], sourceUrls, verified: true, verifiedLevel: "trusted", lastUpdated: "2026-09-21",
}];
