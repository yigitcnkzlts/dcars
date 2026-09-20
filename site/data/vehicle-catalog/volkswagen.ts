import type { VehicleVariant } from "./variants";

// Each source names the complete 2020 Turkish market offer, rather than only
// separate lists of engines and equipment levels.
const offers = [
  { model: "Golf", generation: "Golf VII.5", engine: "1.0 TSI 115 PS", powerHp: 115, transmission: "DSG", trim: "Midline Plus", sourceUrl: "https://binekarac.vw.com.tr/idhub/content/dam/onehub_pkw/importers/tr/kampanyalar/pdf/2020_Model_Yili_Volkswagen_Binek_Arac_Modelleri.pdf" },
  { model: "Golf", generation: "Golf VII.5", engine: "1.5 TSI ACT 150 PS", powerHp: 150, transmission: "DSG", trim: "Comfortline", sourceUrl: "https://binekarac.vw.com.tr/idhub/content/dam/onehub_pkw/importers/tr/kampanyalar/pdf/2020_Model_Yili_Volkswagen_Arac_Modelleri_AutoCredit_Odeme_Plani.pdf" },
  { model: "T-Roc", generation: "T-Roc I", engine: "1.5 TSI ACT 150 PS", powerHp: 150, transmission: "DSG", trim: "Highline", sourceUrl: "https://binekarac.vw.com.tr/idhub/content/dam/onehub_pkw/importers/tr/kampanyalar/pdf/2020_Model_Yili_Volkswagen_Binek_Arac_Modelleri_AutoCredit.pdf" },
] as const;

export const volkswagenVariants: VehicleVariant[] = offers.map((item) => ({
  year: 2020,
  yearFrom: 2020,
  yearTo: 2020,
  brand: "Volkswagen",
  model: item.model,
  generation: item.generation,
  bodyType: item.model === "Golf" ? "Hatchback" : "SUV",
  engine: item.engine,
  powerHp: item.powerHp,
  fuelType: "Benzin",
  transmission: item.transmission,
  version: `${item.engine} · ${item.transmission}`,
  trim: item.trim,
  factoryEquipment: [],
  sourceUrl: item.sourceUrl,
  sourceUrls: [item.sourceUrl],
  verified: true,
  verifiedLevel: "official",
  lastUpdated: "2026-09-21",
}));

// Doğuş Otomotiv's 11 April 2017 Turkish price list lists each saleable
// engine, gearbox and equipment combination on the same row (pages 1-4).
const source2017 = "https://www.uzayoto.com.tr/assets/Download/Binek-Fiyat-Liste.pdf";
type Offer2017 = [model: string, generation: string, engine: string, powerHp: number, fuelType: string, transmission: string, trims: string[]];
const offers2017: Offer2017[] = [
  ["Polo", "Polo V", "1.0 75 PS", 75, "Benzin", "Manuel", ["Trendline"]],
  ["Polo", "Polo V", "1.2 TSI BMT 90 PS", 90, "Benzin", "Manuel", ["Comfortline", "Allstar"]],
  ["Polo", "Polo V", "1.2 TSI BMT 90 PS", 90, "Benzin", "DSG", ["Comfortline", "Allstar"]],
  ["Polo", "Polo V", "1.4 TDI 75 PS", 75, "Dizel", "Manuel", ["Trendline"]],
  ["Polo", "Polo V", "1.4 TDI BMT 90 PS", 90, "Dizel", "Manuel", ["Comfortline"]],
  ["Polo", "Polo V", "1.4 TDI BMT 90 PS", 90, "Dizel", "DSG", ["Comfortline"]],
  ["Polo", "Polo V", "1.4 TSI ACT BMT 150 PS", 150, "Benzin", "DSG", ["BlueGT"]],
  ["Golf", "Golf VII.5", "1.0 TSI BMT 110 PS", 110, "Benzin", "Manuel", ["Midline Plus", "Comfortline"]],
  ["Golf", "Golf VII.5", "1.0 TSI BMT 110 PS", 110, "Benzin", "DSG", ["Midline Plus", "Comfortline"]],
  ["Golf", "Golf VII.5", "1.4 TSI BMT 125 PS", 125, "Benzin", "Manuel", ["Comfortline", "Highline"]],
  ["Golf", "Golf VII.5", "1.4 TSI BMT 125 PS", 125, "Benzin", "DSG", ["Comfortline", "Highline"]],
  ["Golf", "Golf VII.5", "1.4 TSI BMT 150 PS", 150, "Benzin", "DSG", ["Comfortline", "Highline"]],
  ["Golf", "Golf VII.5", "1.6 TDI BMT 90 PS", 90, "Dizel", "Manuel", ["Midline Plus"]],
  ["Golf", "Golf VII.5", "1.6 TDI BMT 115 PS", 115, "Dizel", "Manuel", ["Comfortline", "Highline"]],
  ["Golf", "Golf VII.5", "1.6 TDI BMT 115 PS", 115, "Dizel", "DSG", ["Comfortline", "Highline"]],
  ["Jetta", "Jetta VI", "1.2 TSI BMT 105 PS", 105, "Benzin", "Manuel", ["Trendline", "Comfortline", "Highline"]],
  ["Jetta", "Jetta VI", "1.2 TSI BMT 105 PS", 105, "Benzin", "DSG", ["Trendline", "Comfortline"]],
  ["Jetta", "Jetta VI", "1.4 TSI BMT 125 PS", 125, "Benzin", "Manuel", ["Trendline", "Comfortline", "Highline"]],
  ["Jetta", "Jetta VI", "1.4 TSI BMT 125 PS", 125, "Benzin", "DSG", ["Trendline", "Comfortline", "Highline"]],
  ["Jetta", "Jetta VI", "1.4 TSI BMT 150 PS", 150, "Benzin", "DSG", ["Comfortline", "Highline"]],
  ["Passat", "Passat B8", "1.4 TSI BMT 125 PS", 125, "Benzin", "Manuel", ["Trendline", "Comfortline", "Highline"]],
  ["Passat", "Passat B8", "1.4 TSI BMT 125 PS", 125, "Benzin", "DSG", ["Trendline", "Comfortline", "Highline"]],
  ["Passat", "Passat B8", "1.4 TSI ACT BMT 150 PS", 150, "Benzin", "Manuel", ["Trendline", "Comfortline", "Highline"]],
  ["Passat", "Passat B8", "1.4 TSI ACT BMT 150 PS", 150, "Benzin", "DSG", ["Comfortline", "Highline"]],
  ["Passat", "Passat B8", "1.6 TDI BMT 120 PS", 120, "Dizel", "Manuel", ["Trendline", "Comfortline", "Highline"]],
  ["Passat", "Passat B8", "1.6 TDI BMT 120 PS", 120, "Dizel", "DSG", ["Trendline", "Comfortline", "Highline"]],
  ["Passat", "Passat B8", "2.0 TDI BMT 150 PS", 150, "Dizel", "DSG", ["Comfortline", "Highline"]],
  ["Passat", "Passat B8", "2.0 TDI SCR BMT 190 PS", 190, "Dizel", "DSG", ["Highline"]],
  ["Passat", "Passat B8", "2.0 TDI SCR BMT 240 PS 4Motion", 240, "Dizel", "DSG", ["Highline"]],
];

volkswagenVariants.push(...offers2017.flatMap(([model, generation, engine, powerHp, fuelType, transmission, trims]) => trims.map((trim) => ({
  year: 2017, yearFrom: 2017, yearTo: 2017,
  brand: "Volkswagen", model, generation, bodyType: model === "Polo" || model === "Golf" ? "Hatchback" : "Sedan",
  engine, powerHp, fuelType, transmission, version: `${engine} · ${transmission}`, trim,
  factoryEquipment: [], sourceUrl: source2017, sourceUrls: [source2017], verified: true, verifiedLevel: "official" as const, lastUpdated: "2026-09-21",
}))));
