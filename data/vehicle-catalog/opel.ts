import type { VehicleVariant } from "./variants";

// Opel Türkiye'nin Mayıs 2026 resmi fiyat listesi, aşağıdaki motor / şanzıman /
// donanım eşleşmelerini aynı tabloda 2026 model yılı için yayımlar.
// Elektrikli modeller fiyat listesinde şanzıman türü belirtilmediği için bu
// partide aktif kataloğa alınmamıştır.
const sourceUrl = "https://fiyatlisteleri.opel.com.tr/Assets/files/Opel_Tum_Modeller_Fiyat_Listesi2.5.2026.pdf";

type Offer = Pick<VehicleVariant, "model" | "bodyType" | "engine" | "powerHp" | "fuelType" | "transmission" | "trim">;

const offers: Offer[] = [
  { model: "Corsa", bodyType: "Hatchback", engine: "1.2 100 HP", powerHp: 100, fuelType: "Benzin", transmission: "MT6", trim: "Edition" },
  { model: "Corsa", bodyType: "Hatchback", engine: "Hybrid 1.2 110 HP", powerHp: 110, fuelType: "Hibrit", transmission: "e-DCT6", trim: "Edition" },
  { model: "Corsa", bodyType: "Hatchback", engine: "Hybrid 1.2 145 HP", powerHp: 145, fuelType: "Hibrit", transmission: "e-DCT6", trim: "GS" },
  { model: "Frontera", bodyType: "SUV", engine: "Hybrid 1.2 145 HP", powerHp: 145, fuelType: "Hibrit", transmission: "e-DCT6", trim: "Edition" },
  { model: "Frontera", bodyType: "SUV", engine: "Hybrid 1.2 145 HP", powerHp: 145, fuelType: "Hibrit", transmission: "e-DCT6", trim: "GS" },
  { model: "Mokka", bodyType: "SUV", engine: "1.2 136 HP", powerHp: 136, fuelType: "Benzin", transmission: "MT6", trim: "Edition" },
  { model: "Mokka", bodyType: "SUV", engine: "Hybrid 1.2 145 HP", powerHp: 145, fuelType: "Hibrit", transmission: "e-DCT6", trim: "GS" },
  { model: "Astra", bodyType: "Hatchback", engine: "1.5 130 HP", powerHp: 130, fuelType: "Dizel", transmission: "AT8", trim: "Edition" },
  { model: "Astra", bodyType: "Hatchback", engine: "1.5 130 HP", powerHp: 130, fuelType: "Dizel", transmission: "AT8", trim: "GS" },
  { model: "Grandland", bodyType: "SUV", engine: "Hybrid 1.2 145 HP", powerHp: 145, fuelType: "Hibrit", transmission: "e-DCT6", trim: "Edition" },
  { model: "Grandland", bodyType: "SUV", engine: "Hybrid 1.2 145 HP", powerHp: 145, fuelType: "Hibrit", transmission: "e-DCT6", trim: "GS" },
];

export const opelVariants: VehicleVariant[] = offers.map((offer) => ({
  year: 2026,
  yearFrom: 2026,
  yearTo: 2026,
  brand: "Opel",
  ...offer,
  version: `${offer.engine} · ${offer.transmission}`,
  factoryEquipment: [],
  market: "TR",
  sourceUrl,
  sourceUrls: [sourceUrl],
  sourceDocument: "Opel Mayıs 2026 Tüm Modeller Fiyat Listesi",
  verified: true,
  verifiedLevel: "official",
  verificationStatus: "verified",
  verifiedAt: "2026-10-08",
  lastUpdated: "2026-10-08",
}));
