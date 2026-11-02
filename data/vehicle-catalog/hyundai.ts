/**
 * hyundai.ts
 *
 * Hyundai Motor Türkiye'nin resmi kredi/fiyat sayfasından alınan
 * doğrulanmış varyantlar.
 *
 * Kaynak: https://kredi.hyundai.com.tr/
 * Tarih:  Ekim 2026
 */

import type { VehicleVariant } from "./variants";

const sourceUrl = "https://kredi.hyundai.com.tr/";
const sourceDoc = "Hyundai Motor Türkiye 2026 kredi/fiyat listesi";
const verifiedAt = "2026-10-08";

type Offer = {
  year: number;
  model: string;
  generation: string;
  bodyType: string;
  engine: string;
  powerHp: number;
  fuelType: string;
  transmission: string;
  driveType: string;
  trims: readonly string[];
};

// ── 2026 model yılı ───────────────────────────────────────────────────────────
// Kaynak: kredi.hyundai.com.tr — Ekim 2026 fiyat listesi
const offers2026: Offer[] = [
  // i20 — 1.0 T-GDI
  {
    year: 2026, model: "i20", generation: "i20 BC3", bodyType: "Hatchback",
    engine: "1.0 T-GDI 100 PS", powerHp: 100, fuelType: "Benzin", transmission: "MT", driveType: "4x2",
    trims: ["Jump"],
  },
  {
    year: 2026, model: "i20", generation: "i20 BC3", bodyType: "Hatchback",
    engine: "1.0 T-GDI 100 PS", powerHp: 100, fuelType: "Benzin", transmission: "DCT", driveType: "4x2",
    trims: ["Jump", "Style", "Elite"],
  },
  // Bayon — 1.0 T-GDI
  {
    year: 2026, model: "Bayon", generation: "Bayon (BC3)", bodyType: "SUV",
    engine: "1.0 T-GDI 100 PS", powerHp: 100, fuelType: "Benzin", transmission: "MT", driveType: "4x2",
    trims: ["Jump"],
  },
  {
    year: 2026, model: "Bayon", generation: "Bayon (BC3)", bodyType: "SUV",
    engine: "1.0 T-GDI 100 PS", powerHp: 100, fuelType: "Benzin", transmission: "DCT", driveType: "4x2",
    trims: ["Jump", "Style", "Elite"],
  },
  // INSTER — Elektrik
  {
    year: 2026, model: "Inster", generation: "Inster (2024–)", bodyType: "Hatchback",
    engine: "Elektrik 71.1 kW", powerHp: 97, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x2",
    trims: ["Dynamic"],
  },
  {
    year: 2026, model: "Inster", generation: "Inster (2024–)", bodyType: "Hatchback",
    engine: "Elektrik 84.5 kW", powerHp: 115, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x2",
    trims: ["Advance", "Cross Advance"],
  },
  // i30 — 1.5 MHEV
  {
    year: 2026, model: "i30", generation: "i30 PD FL", bodyType: "Hatchback",
    engine: "1.5 MHEV 160 PS", powerHp: 160, fuelType: "Mild Hibrit", transmission: "7DCT", driveType: "4x2",
    trims: ["Comfort", "Prime"],
  },
  // Kona — 1.6 T-GDI
  {
    year: 2026, model: "Kona", generation: "Kona SX2", bodyType: "SUV",
    engine: "1.6 T-GDI 198 PS", powerHp: 198, fuelType: "Benzin", transmission: "DCT", driveType: "4x2",
    trims: ["Prime"],
  },
  // Kona EV — Elektrik
  {
    year: 2026, model: "Kona", generation: "Kona SX2 EV", bodyType: "SUV",
    engine: "Elektrik 99 kW", powerHp: 136, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x2",
    trims: ["Advance"],
  },
  // Tucson — 1.6 T-GDI Benzin
  {
    year: 2026, model: "Tucson", generation: "Tucson NX4 FL", bodyType: "SUV",
    engine: "1.6 T-GDI 150 PS", powerHp: 150, fuelType: "Benzin", transmission: "DCT", driveType: "4x2",
    trims: ["Comfort", "Prime", "Elite"],
  },
  // Tucson — 1.6 T-GDI Elite Plus 4x4
  {
    year: 2026, model: "Tucson", generation: "Tucson NX4 FL", bodyType: "SUV",
    engine: "1.6 T-GDI 150 PS", powerHp: 150, fuelType: "Benzin", transmission: "DCT", driveType: "4x4",
    trims: ["Elite Plus"],
  },
  // Tucson — 1.6 CRDI Dizel (Sunroof 4x4)
  {
    year: 2026, model: "Tucson", generation: "Tucson NX4 FL", bodyType: "SUV",
    engine: "1.6 CRDI 136 PS", powerHp: 136, fuelType: "Dizel", transmission: "DCT", driveType: "4x4",
    trims: ["Comfort Sunroof"],
  },
  // Santa Fe — HEV
  {
    year: 2026, model: "Santa Fe", generation: "Santa Fe MX5", bodyType: "SUV",
    engine: "1.6 T-GDI HEV 215 PS", powerHp: 215, fuelType: "Hibrit", transmission: "AT", driveType: "4x4",
    trims: ["Progressive"],
  },
  // IONIQ 5 — Elektrik
  {
    year: 2026, model: "Ioniq 5", generation: "Ioniq 5 NE", bodyType: "SUV",
    engine: "Elektrik 125 kW", powerHp: 170, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x2",
    trims: ["Dynamic Vision Roof"],
  },
  {
    year: 2026, model: "Ioniq 5", generation: "Ioniq 5 NE", bodyType: "SUV",
    engine: "Elektrik 160 kW", powerHp: 217, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x2",
    trims: ["Progressive"],
  },
  // IONIQ 6 — Elektrik
  {
    year: 2026, model: "Ioniq 6", generation: "Ioniq 6 CE", bodyType: "Sedan",
    engine: "Elektrik 125 kW", powerHp: 170, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x2",
    trims: ["Advance"],
  },
  {
    year: 2026, model: "Ioniq 6", generation: "Ioniq 6 CE", bodyType: "Sedan",
    engine: "Elektrik 160 kW", powerHp: 217, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x2",
    trims: ["Progressive"],
  },
  // IONIQ 9 — Elektrik
  {
    year: 2026, model: "Ioniq 9", generation: "Ioniq 9 (2025–)", bodyType: "SUV",
    engine: "Elektrik 160 kW", powerHp: 217, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x2",
    trims: ["Progressive"],
  },
  {
    year: 2026, model: "Ioniq 9", generation: "Ioniq 9 (2025–)", bodyType: "SUV",
    engine: "Elektrik 226.1 kW AWD", powerHp: 307, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x4",
    trims: ["Calligraphy"],
  },
];

// ── 2025 model yılı ───────────────────────────────────────────────────────────
const offers2025: Offer[] = [
  // Inster — Elektrik
  {
    year: 2025, model: "Inster", generation: "Inster (2024–)", bodyType: "Hatchback",
    engine: "Elektrik 84.5 kW", powerHp: 115, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x2",
    trims: ["Advance"],
  },
  // Kona — 1.6 T-GDI
  {
    year: 2025, model: "Kona", generation: "Kona SX2", bodyType: "SUV",
    engine: "1.6 T-GDI 198 PS", powerHp: 198, fuelType: "Benzin", transmission: "DCT", driveType: "4x2",
    trims: ["Prime"],
  },
  // Kona EV — Elektrik
  {
    year: 2025, model: "Kona", generation: "Kona SX2 EV", bodyType: "SUV",
    engine: "Elektrik 115 kW", powerHp: 156, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x2",
    trims: ["Advance"],
  },
  // IONIQ 5 N — Elektrik
  {
    year: 2025, model: "Ioniq 5", generation: "Ioniq 5 N", bodyType: "SUV",
    engine: "Elektrik 448 kW AWD", powerHp: 609, fuelType: "Elektrik", transmission: "Tek hız Otomatik", driveType: "4x4",
    trims: ["N"],
  },
  // Tucson — 1.6 CRDI Elite Plus 4x4
  {
    year: 2025, model: "Tucson", generation: "Tucson NX4 FL", bodyType: "SUV",
    engine: "1.6 CRDI 136 PS", powerHp: 136, fuelType: "Dizel", transmission: "DCT", driveType: "4x4",
    trims: ["Elite Plus"],
  },
  // Tucson — HEV
  {
    year: 2025, model: "Tucson", generation: "Tucson NX4 FL", bodyType: "SUV",
    engine: "1.6 T-GDI HEV 215 PS", powerHp: 215, fuelType: "Hibrit", transmission: "AT", driveType: "4x2",
    trims: ["Elite"],
  },
  // Staria HEV
  {
    year: 2025, model: "Staria", generation: "Staria (2021–)", bodyType: "MPV",
    engine: "1.6 T-GDI HEV 225 PS", powerHp: 225, fuelType: "Hibrit", transmission: "AT", driveType: "4x2",
    trims: ["Elite"],
  },
];

const allOffers = [...offers2026, ...offers2025];

export const hyundaiVariants: VehicleVariant[] = allOffers.flatMap((o) =>
  o.trims.map((trim) => ({
    year: o.year,
    yearFrom: o.year,
    yearTo: o.year,
    brand: "Hyundai",
    model: o.model,
    generation: o.generation,
    bodyType: o.bodyType,
    engine: o.engine,
    powerHp: o.powerHp,
    fuelType: o.fuelType,
    transmission: o.transmission,
    driveType: o.driveType,
    version: `${o.engine} · ${o.transmission} · ${o.driveType}`,
    trim,
    factoryEquipment: [],
    market: "TR" as const,
    sourceUrl,
    sourceUrls: [sourceUrl],
    sourceDocument: sourceDoc,
    verified: true,
    verifiedLevel: "official" as const,
    verificationStatus: "verified" as const,
    verifiedAt,
    lastUpdated: verifiedAt,
  }))
);
