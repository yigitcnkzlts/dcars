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
  lastUpdated: "2026-09-21",
}));
