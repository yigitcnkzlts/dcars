import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const file = process.argv[2];
if (!file) {
  console.error("Kullanım: node scripts/import-vehicle-catalog.mjs <lisanslı-katalog.json>");
  process.exit(2);
}

// Runs the full range, source, and duplicate validation before changing the site catalog.
await import("./validate-vehicle-catalog.mjs");
const rows = JSON.parse(await readFile(file, "utf8"));
const variants = rows.filter((row) => row.isActive === true).map((row) => ({
  year: row.year,
  brand: row.brand.trim(),
  model: row.model.trim(),
  engine: row.engineName.trim(),
  fuelType: row.fuelType.trim(),
  transmission: row.transmission.trim(),
  version: `${row.engineName.trim()} · ${row.transmission.trim()}`,
  trim: row.trim.trim(),
  factoryEquipment: row.factoryEquipment ?? [],
  sourceUrl: row.sourceUrl.trim(),
  generation: row.generation.trim(),
  yearFrom: row.year,
  yearTo: row.year,
  bodyType: row.bodyType?.trim() || undefined,
  displacementCc: row.engineCc ?? undefined,
  powerHp: row.powerHp ?? undefined,
  motorPowerKw: row.powerKw ?? undefined,
  driveType: row.driveType.trim(),
  verified: true,
  sourceUrls: [row.sourceUrl.trim()],
  lastUpdated: new Date().toISOString().slice(0, 10),
}));

const target = fileURLToPath(new URL("../data/vehicle-catalog/variants.imported.json", import.meta.url));
await writeFile(target, `${JSON.stringify(variants, null, 2)}\n`, "utf8");
console.log(`${variants.length} aktif varyant filtre kataloğuna aktarıldı; ${rows.length - variants.length} pasif kayıt atlandı.`);
