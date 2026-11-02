import { verifiedVariants } from "../data/vehicle-catalog/variants";

const brands = [...new Set(verifiedVariants.map((row) => row.brand))].sort((a, b) => a.localeCompare(b, "tr-TR"));
const report = brands.map((brand) => {
  const rows = verifiedVariants.filter((row) => row.brand === brand);
  const models = new Set(rows.map((row) => row.model));
  const engines = new Set(rows.map((row) => `${row.model}|${row.engine}|${row.fuelType}|${row.transmission}`));
  const versions = new Set(rows.map((row) => `${row.model}|${row.engine}|${row.transmission}|${row.trim}`));
  const sources = new Set(rows.flatMap((row) => row.sourceUrls ?? [row.sourceUrl]));
  return {
    brand,
    models: models.size,
    years: `${Math.min(...rows.map((row) => row.year))}–${Math.max(...rows.map((row) => row.year))}`,
    engines: engines.size,
    versions: versions.size,
    variants: rows.length,
    sources: sources.size,
  };
});

console.table(report);
console.log(JSON.stringify({
  brands: brands.length,
  models: new Set(verifiedVariants.map((row) => `${row.brand}|${row.model}`)).size,
  engines: new Set(verifiedVariants.map((row) => `${row.brand}|${row.model}|${row.engine}|${row.fuelType}|${row.transmission}`)).size,
  variants: verifiedVariants.length,
}, null, 2));
