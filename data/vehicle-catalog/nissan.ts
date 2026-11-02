/**
 * nissan.ts
 *
 * Nissan Türkiye resmi fiyat listesinden alınan doğrulanmış varyantlar.
 *
 * Kaynak: https://www.nissan.com.tr/fiyat-listesi/sifir-arac-fiyatlari-2026.html
 * Tarih:  Ekim 2026
 *
 * Bu dosya yalnızca resmi kaynakta açıkça belirtilen
 * motor · şanzıman · donanım kombinasyonlarını içerir.
 */

import type { VehicleVariant } from "./variants";

const source2026 = "https://www.nissan.com.tr/fiyat-listesi/sifir-arac-fiyatlari-2026.html";
// 2019 fiyat listesi variants.ts'de inline olduğu için bu dosyada tekrarlanmıyor.

type Combo = {
  model: string;
  generation: string;
  bodyType: string;
  engine: string;
  powerHp: number;
  fuelType: string;
  transmission: string;
  trims: readonly string[];
  driveType?: string;
  sourceUrl: string;
};

// ── Ekim 2026 resmî fiyat listesi ────────────────────────────────────────────

const combos2026: Combo[] = [
  // Qashqai — 1.3 DIG-T Mild Hybrid 158 PS Otomatik (4x2)
  {
    model: "Qashqai", generation: "Qashqai J13", bodyType: "SUV",
    engine: "1.3 DIG-T Mild Hybrid 158 PS", powerHp: 158,
    fuelType: "Mild Hibrit", transmission: "Otomatik",
    trims: ["Designpack", "Skypack", "N-Design", "Platinum", "Platinum Premium"],
    driveType: "4x2", sourceUrl: source2026,
  },
  // Qashqai — 1.3 DIG-T Mild Hybrid 158 PS Otomatik (4x4)
  {
    model: "Qashqai", generation: "Qashqai J13", bodyType: "SUV",
    engine: "1.3 DIG-T Mild Hybrid 158 PS", powerHp: 158,
    fuelType: "Mild Hibrit", transmission: "Otomatik",
    trims: ["Skypack 4x4", "Platinum 4x4", "Platinum Premium 4x4"],
    driveType: "4x4", sourceUrl: source2026,
  },
  // Qashqai — e-POWER (elektrikli tahrik)
  {
    model: "Qashqai", generation: "Qashqai J13", bodyType: "SUV",
    engine: "e-POWER 190 PS", powerHp: 190,
    fuelType: "Hibrit", transmission: "e-POWER (Elektrikli Tahrik)",
    trims: ["Designpack", "Skypack", "N-Design", "Platinum", "Platinum Premium"],
    driveType: "4x2", sourceUrl: source2026,
  },
  // Juke — 1.0 DIG-T 115 PS DCT
  {
    model: "Juke", generation: "Juke II (F16)", bodyType: "SUV",
    engine: "1.0 DIG-T 115 PS", powerHp: 115,
    fuelType: "Benzin", transmission: "DCT",
    trims: ["Tekna Plus", "Platinum", "Platinum Premium"],
    driveType: "4x2", sourceUrl: source2026,
  },
  // X-Trail — 1.5 VC-T Mild Hybrid 163 PS Otomatik
  {
    model: "X-Trail", generation: "X-Trail IV (T33)", bodyType: "SUV",
    engine: "1.5 VC-T Mild Hybrid 163 PS", powerHp: 163,
    fuelType: "Mild Hibrit", transmission: "Otomatik",
    trims: ["Platinum", "Platinum Premium"],
    driveType: "4x2", sourceUrl: source2026,
  },
  // Townstar Van — 1.3 DIG-T 130 PS Manuel (L1)
  {
    model: "Townstar", generation: "Townstar (2022–)", bodyType: "Van",
    engine: "1.3 DIG-T 130 PS", powerHp: 130,
    fuelType: "Benzin", transmission: "6 ileri Manuel",
    trims: ["L1 Visia"],
    sourceUrl: source2026,
  },
  // Townstar Van — 1.3 DIG-T 130 PS Manuel (L2)
  {
    model: "Townstar", generation: "Townstar (2022–)", bodyType: "Van",
    engine: "1.3 DIG-T 130 PS", powerHp: 130,
    fuelType: "Benzin", transmission: "6 ileri Manuel",
    trims: ["L2 Visia"],
    sourceUrl: source2026,
  },
  // Townstar Van — 1.3 DIG-T 130 PS DCT (L2)
  {
    model: "Townstar", generation: "Townstar (2022–)", bodyType: "Van",
    engine: "1.3 DIG-T 130 PS", powerHp: 130,
    fuelType: "Benzin", transmission: "7 ileri DCT",
    trims: ["L2 Visia", "L2 Tekna"],
    sourceUrl: source2026,
  },
  // Townstar Van — Elektrik Otomatik (L1)
  {
    model: "Townstar", generation: "Townstar (2022–)", bodyType: "Van",
    engine: "Elektrik 122 PS", powerHp: 122,
    fuelType: "Elektrik", transmission: "Tek hız Otomatik",
    trims: ["L1 Tekna+"],
    sourceUrl: source2026,
  },
  // Townstar Van — Elektrik Otomatik (L2)
  {
    model: "Townstar", generation: "Townstar (2022–)", bodyType: "Van",
    engine: "Elektrik 122 PS", powerHp: 122,
    fuelType: "Elektrik", transmission: "Tek hız Otomatik",
    trims: ["L2 Tekna"],
    sourceUrl: source2026,
  },
  // Townstar Combi — Elektrik Otomatik
  {
    model: "Townstar", generation: "Townstar (2022–)", bodyType: "MPV",
    engine: "Elektrik 122 PS", powerHp: 122,
    fuelType: "Elektrik", transmission: "Tek hız Otomatik",
    trims: ["Designpack", "Platinum"],
    sourceUrl: source2026,
  },
];

export const nissanVariants: VehicleVariant[] = combos2026.flatMap((c) =>
  c.trims.map((trim) => ({
    year: 2026,
    yearFrom: 2026,
    yearTo: 2026,
    brand: "Nissan",
    model: c.model,
    generation: c.generation,
    bodyType: c.bodyType,
    engine: c.engine,
    powerHp: c.powerHp,
    fuelType: c.fuelType,
    transmission: c.transmission,
    driveType: c.driveType,
    version: `${c.engine} · ${c.transmission}${c.driveType ? ` · ${c.driveType}` : ""}`,
    trim,
    factoryEquipment: [],
    market: "TR" as const,
    sourceUrl: c.sourceUrl,
    sourceUrls: [c.sourceUrl],
    sourceDocument: "Nissan Türkiye Ekim 2026 Tavsiye Edilen Fiyat Listesi",
    verified: true,
    verifiedLevel: "official" as const,
    verificationStatus: "verified" as const,
    verifiedAt: "2026-10-08",
    lastUpdated: "2026-10-08",
  }))
);
