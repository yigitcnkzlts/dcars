import { getCsvTransmissions, getCsvFuelTypes, getCsvEngineLabels, isCsvCatalogAvailable } from "../services/csvCatalogService";

console.log("CSV catalog available:", isCsvCatalogAvailable());

const tests: [string, string, number][] = [
  ["Ford", "Focus", 2020],
  ["Mercedes-Benz", "C-Serisi", 2022],   // UI adı
  ["Mercedes-Benz", "C-Class", 2022],    // CSV adı (doğrudan)
  ["Audi", "A4", 2023],
  ["BMW", "3 Serisi", 2022],             // UI adı
  ["BMW", "3 Series", 2022],             // CSV adı
  ["Toyota", "Yaris", 2022],
  ["Renault", "Clio", 2022],
  ["Volkswagen", "Golf", 2022],
];

for (const [make, model, year] of tests) {
  const t = getCsvTransmissions(make, model, year);
  const f = getCsvFuelTypes(make, model, year);
  const e = getCsvEngineLabels(make, model, year);
  console.log(`${make} ${model} ${year} → trans:${t.length} fuels:${f.length} engines:${e.length}`, e.slice(0, 2));
}
