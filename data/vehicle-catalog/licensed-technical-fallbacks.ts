import type { CsvEngineEntry } from "@/services/csvCatalogService";

/**
 * Small runtime-safe subset of the generated technical catalog.
 * Source: https://github.com/gor3a/vehicle-makes-models
 * License: ODbL 1.0 — https://opendatacommons.org/licenses/odbl/1-0/
 *
 * These are international technical variants, not verified Turkish-market
 * trim/package records. Keep commercial trim names in the verified catalog.
 */
export const licensedTechnicalFallbacks: CsvEngineEntry[] = [
  {
    make: "Ford", model: "Focus", generation: "Focus Wagon (2018)", genYearStart: 2018, genYearEnd: 2021,
    engineLabel: "1.0L EcoBoost 8AT FWD (125 HP)", fuelType: "Benzin", cylinders: 3, displacementCc: 998,
    powerHp: 125, torqueNm: 169, transmission: "8 ileri Otomatik", drivetrain: "Front Wheel Drive",
  },
  {
    make: "Ford", model: "Focus", generation: "Focus Wagon (2018)", genYearStart: 2018, genYearEnd: 2021,
    engineLabel: "1.5L EcoBoost 8AT Star Stop FWD (150 HP)", fuelType: "Benzin", cylinders: 4, displacementCc: 1499,
    powerHp: 150, torqueNm: 240, transmission: "8 ileri Otomatik", drivetrain: "Front Wheel Drive",
  },
  {
    make: "Ford", model: "Focus", generation: "Focus ST 5 doors (2021)", genYearStart: 2021, genYearEnd: null,
    engineLabel: "2.3L EcoBoost 7AT FWD (280 HP)", fuelType: "Benzin", cylinders: 4, displacementCc: 2261,
    powerHp: 280, torqueNm: 420, transmission: "7 ileri Otomatik", drivetrain: "Front Wheel Drive",
  },
];
