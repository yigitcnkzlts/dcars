import type { VehicleVariant } from "./variants";

// Hyundai Motor Türkiye'nin resmi kredi/fiyat sayfası model yılını ve satışa
// sunulan varyant adını birlikte yayımlar. Elektrikli satırlarda şanzıman açıkça
// belirtilmediği için onlar bu aktif partiye dahil değildir.
const sourceUrl = "https://kredi.hyundai.com.tr/";

type Offer = Pick<VehicleVariant, "model" | "bodyType" | "engine" | "fuelType" | "transmission" | "trim" | "driveType">;
const offer = (model: string, bodyType: string, engine: string, fuelType: string, transmission: string, trim: string, driveType = "4x2"): Offer => ({ model, bodyType, engine, fuelType, transmission, trim, driveType });

const offers: Offer[] = [
  offer("i20", "Hatchback", "1.0 T-GDI", "Benzin", "MT", "Jump"),
  offer("i20", "Hatchback", "1.0 T-GDI", "Benzin", "DCT", "Jump"),
  offer("i20", "Hatchback", "1.0 T-GDI", "Benzin", "DCT", "Style"),
  offer("i20", "Hatchback", "1.0 T-GDI", "Benzin", "DCT", "Style GSR II-C"),
  offer("i20", "Hatchback", "1.0 T-GDI", "Benzin", "DCT", "Elite"),
  offer("i20", "Hatchback", "1.0 T-GDI", "Benzin", "DCT", "Elite GSR II-C"),
  offer("Bayon", "SUV", "1.0 T-GDI", "Benzin", "MT", "Jump"),
  offer("Bayon", "SUV", "1.0 T-GDI", "Benzin", "DCT", "Jump"),
  offer("Bayon", "SUV", "1.0 T-GDI", "Benzin", "DCT", "Style"),
  offer("Bayon", "SUV", "1.0 T-GDI", "Benzin", "DCT", "Style GSR II-C"),
  offer("Bayon", "SUV", "1.0 T-GDI", "Benzin", "DCT", "Elite"),
  offer("Bayon", "SUV", "1.0 T-GDI", "Benzin", "DCT", "Elite GSR II-C"),
  offer("i30", "Hatchback", "1.5 MHEV", "Hibrit", "7DCT", "Comfort"),
  offer("i30", "Hatchback", "1.5 MHEV", "Hibrit", "7DCT", "Prime"),
  offer("Kona", "SUV", "1.6 T-GDI", "Benzin", "DCT", "Prime"),
  offer("Tucson", "SUV", "1.6 T-GDI", "Benzin", "DCT", "Comfort", "4x2"),
  offer("Tucson", "SUV", "1.6 T-GDI", "Benzin", "DCT", "Prime", "4x2"),
  offer("Tucson", "SUV", "1.6 T-GDI", "Benzin", "DCT", "Elite", "4x2"),
  offer("Tucson", "SUV", "1.6 T-GDI", "Benzin", "DCT", "Elite Plus", "4x4"),
  offer("Santa Fe", "SUV", "1.6 T-GDI HEV", "Hibrit", "AT", "Progressive", "4x4"),
];

export const hyundaiVariants: VehicleVariant[] = offers.map((item) => ({
  year: 2026,
  yearFrom: 2026,
  yearTo: 2026,
  brand: "Hyundai",
  ...item,
  version: `${item.engine} · ${item.transmission}${item.driveType ? ` · ${item.driveType}` : ""}`,
  factoryEquipment: [],
  market: "TR",
  sourceUrl,
  sourceUrls: [sourceUrl],
  sourceDocument: "Hyundai Motor Türkiye 2026 kredi/fiyat listesi",
  verified: true,
  verifiedLevel: "official",
  verificationStatus: "verified",
  verifiedAt: "2026-10-08",
  lastUpdated: "2026-10-08",
}));
