import type { VehicleVariant } from "./variants";

// CUPRA Türkiye'nin 1 Eylül 2026 tarihli resmi fiyat listesi model, motor,
// şanzıman ve donanım eşleşmelerini birlikte yayımlar.
const sourceUrl = "https://www.cupraofficial.com.tr/cupra-sahipleri/fiyat-listesi/formentor";

type Offer = Pick<VehicleVariant, "model" | "bodyType" | "trim">;

const offers: Offer[] = [
  ...["Impulse", "Supreme", "VZ-Line"].map((trim) => ({ model: "Formentor", bodyType: "SUV", trim })),
  ...["Impulse", "Supreme", "VZ-Line"].map((trim) => ({ model: "Terramar", bodyType: "SUV", trim })),
  ...["Impulse", "VZ-Line"].map((trim) => ({ model: "Leon", bodyType: "Hatchback", trim })),
];

export const cupraVariants: VehicleVariant[] = offers.map((offer) => ({
  year: 2026,
  yearFrom: 2026,
  yearTo: 2026,
  brand: "Cupra",
  ...offer,
  engine: "1.5 eTSI ACT 150 PS",
  powerHp: 150,
  fuelType: "Hibrit",
  transmission: "DSG",
  version: "1.5 eTSI ACT 150 PS · DSG",
  factoryEquipment: [],
  market: "TR",
  sourceUrl,
  sourceUrls: [sourceUrl],
  sourceDocument: "CUPRA Türkiye 1 Eylül 2026 Fiyat Listesi",
  verified: true,
  verifiedLevel: "official",
  verificationStatus: "verified",
  verifiedAt: "2026-10-08",
  lastUpdated: "2026-10-08",
}));
