import type { VehicleVariant } from "./variants";

// Citroën Türkiye'nin Mart 2026 üretimli araçlar için yayımladığı dijital
// kataloglarda motor, şanzıman ve donanım sütunları birlikte yer alır.
const catalogByModel = {
  C4: "https://talep.citroen.com.tr/api/model-pdf?model=c4",
  "C4 X": "https://talep.citroen.com.tr/api/model-pdf?model=c4x",
} as const;

export const citroenVariants: VehicleVariant[] = Object.entries(catalogByModel).flatMap(([model, sourceUrl]) =>
  (["YOU", "MAX"] as const).map((trim): VehicleVariant => ({
    year: 2026,
    yearFrom: 2026,
    yearTo: 2026,
    brand: "Citroen",
    model,
    bodyType: model === "C4" ? "Hatchback" : "Fastback",
    engine: "1.2 Hybrid 145 HP",
    displacementCc: 1199,
    powerHp: 145,
    fuelType: "Hibrit",
    transmission: "ë-DCS6",
    version: "1.2 Hybrid 145 HP · ë-DCS6",
    trim,
    factoryEquipment: [],
    market: "TR",
    sourceUrl,
    sourceUrls: [sourceUrl],
    sourceDocument: `Citroën ${model} Hybrid 145 dijital kataloğu`,
    verified: true,
    verifiedLevel: "official",
    verificationStatus: "verified",
    verifiedAt: "2026-10-08",
    lastUpdated: "2026-10-08",
  })),
);
