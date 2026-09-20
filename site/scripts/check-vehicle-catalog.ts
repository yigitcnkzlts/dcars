import assert from "node:assert/strict";
import { verifiedVariants } from "../data/vehicle-catalog/variants";

const today = new Date().getFullYear();
const keys = new Set<string>();
for (const row of verifiedVariants) {
  const key = [row.year, row.brand, row.model, row.generation, row.engine, row.fuelType, row.transmission, row.trim].join("|");
  assert(!keys.has(key), `Tekrarlı varyant: ${key}`);
  keys.add(key);
  assert(row.brand && row.model && row.engine && row.trim, `Eksik araç bilgisi: ${key}`);
  assert(row.year >= 1886 && row.year <= today + 1, `Geçersiz yıl: ${key}`);
  assert((row.yearFrom ?? row.year) <= row.year && row.year <= (row.yearTo ?? row.year), `Yıl aralığı uyuşmuyor: ${key}`);
  assert(row.fuelType !== "Elektrik" || row.displacementCc == null, `Elektrikli araçta hacim: ${key}`);
  assert(row.verifiedLevel === "official" || row.verifiedLevel === "trusted", `Doğrulama düzeyi eksik: ${key}`);
  assert(row.sourceUrl && (row.sourceUrls?.length ?? 0) > 0, `Kaynak eksik: ${key}`);
  if (row.verifiedLevel === "trusted") assert(new Set(row.sourceUrls).size >= 2, `Trusted kayıt için iki kaynak gerekli: ${key}`);
}

const has = (year: number, brand: string, model: string, engine: string, transmission: string, trim: string) => verifiedVariants.some((row) => row.year === year && row.brand === brand && row.model === model && row.engine.includes(engine) && row.transmission === transmission && row.trim === trim);
assert(has(2019, "Nissan", "Qashqai", "1.3 DIG-T", "7 ileri DCT", "Sky Pack"));
assert(has(2020, "Renault", "Clio", "1.3 TCe", "EDC", "Icon"));
assert(has(2020, "Fiat", "Egea", "1.3 Multijet", "Manuel", "Urban Plus"));
assert(!has(2020, "Renault", "Clio", "1.3 TCe", "EDC", "Joy"));

const brands = new Set(verifiedVariants.map((row) => row.brand));
const models = new Set(verifiedVariants.map((row) => `${row.brand}|${row.model}`));
const generations = new Set(verifiedVariants.map((row) => `${row.brand}|${row.model}|${row.generation}`));
const engines = new Set(verifiedVariants.map((row) => `${row.brand}|${row.model}|${row.generation}|${row.engine}`));
console.log(JSON.stringify({ brands: brands.size, models: models.size, generations: generations.size, engines: engines.size, variants: verifiedVariants.length }));
