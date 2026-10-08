/**
 * Test araç seçim akışını — doğrulanmış varyantlar doğru çalışıyor mu?
 * Run: npx tsx scripts/test-selection-flow.ts
 */
import { variantsFor, optionsFor } from "../services/vehicleCatalogService";

const tests = [
  { year: 2020, brand: "Renault", model: "Clio" },
  { year: 2020, brand: "Volkswagen", model: "Golf" },
  { year: 2024, brand: "Toyota", model: "Corolla" },
  { year: 2026, brand: "Toyota", model: "Corolla" },
  { year: 2026, brand: "Nissan", model: "Qashqai" },
  { year: 2020, brand: "Fiat", model: "Egea" },
  // Doğrulanmış varyant olmayan markalar — fallback devreye girmeli
  { year: 2024, brand: "Ford", model: "Focus" },
  { year: 2024, brand: "Mercedes-Benz", model: "C-Serisi" },
];

let pass = 0;
let fail = 0;

for (const t of tests) {
  const variants = variantsFor(t.year, t.brand, t.model);
  const trans = optionsFor(t, "transmission");
  const fuels = optionsFor(t, "fuelType");
  const engines = optionsFor(t, "engine");
  const allVerified = variants.every(
    (v) => v.verifiedLevel === "official" || v.verifiedLevel === "trusted",
  );

  // Doğrulanmış varyant varsa hiçbiri unverified olmamalı
  if (variants.length > 0 && !allVerified) {
    console.error(`❌ FAIL [${t.year} ${t.brand} ${t.model}]: Doğrulanmamış varyant verifiedVariants içinde!`);
    fail++;
    continue;
  }

  console.log(
    `✅ ${t.year} ${t.brand} ${t.model} → verified:${variants.length}` +
    (trans.length ? ` | trans:[${trans.slice(0, 2).join(",")}]` : " | trans:[]") +
    (fuels.length ? ` | fuels:[${fuels.slice(0, 2).join(",")}]` : " | fuels:[]") +
    (engines.length ? ` | engines:[${engines.slice(0, 1).join(",")}...]` : " | engines:[]"),
  );
  pass++;
}

console.log(`\nSonuç: ${pass} PASS, ${fail} FAIL`);
if (fail > 0) process.exit(1);
