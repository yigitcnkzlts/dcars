/**
 * csvCatalogService.ts
 *
 * Runtime query layer over the generated csv-catalog.json.
 * This catalog is NOT verified for the Turkish market and must NOT be merged
 * with verifiedVariants or given a verifiedLevel value.
 *
 * Data source : https://github.com/gor3a/vehicle-makes-models
 * Data license: ODbL 1.0 — https://opendatacommons.org/licenses/odbl/1-0/
 *
 * The JSON is loaded once (module singleton) so subsequent calls are O(n)
 * array filters without I/O overhead.
 */

// Next.js edge/Node can import JSON natively.
// The file is gitignored; run `scripts/import-csv-catalog.ts` to regenerate.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – generated file may not exist in CI; handled by the null-guard below
import rawCatalog from "@/data/vehicle-catalog/csv-catalog.json" assert { type: "json" };

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CsvEngineEntry {
  make: string;
  model: string;
  generation: string;
  genYearStart: number | null;
  genYearEnd: number | null;
  bodyType: string;
  engineLabel: string;
  fuelType: string;
  cylinders: number | null;
  displacementCc: number | null;
  powerHp: number | null;
  torqueNm: number | null;
  transmission: string;
  drivetrain: string;
  zeroTo100s: number | null;
  topSpeedKmh: number | null;
}

export interface CsvModelEntry {
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
}

interface CatalogShape {
  stats: { makes: number; models: number; engines: number };
  models: CsvModelEntry[];
  engines: CsvEngineEntry[];
}

// ── Module-level data ─────────────────────────────────────────────────────────

const catalog: CatalogShape | null = (rawCatalog as unknown as CatalogShape) ?? null;

// ── Public helpers ────────────────────────────────────────────────────────────

/** Is the CSV catalog available? Returns false when the JSON hasn't been generated yet. */
export function isCsvCatalogAvailable(): boolean {
  return catalog !== null && (catalog.engines?.length ?? 0) > 0;
}

/** All unique make names in the CSV catalog, sorted alphabetically. */
export function getCsvMakes(): string[] {
  if (!catalog) return [];
  return [...new Set(catalog.models.map((r) => r.make))].sort((a, b) =>
    a.localeCompare(b, "tr-TR"),
  );
}

/**
 * All unique model names for a given make.
 * Optionally filtered by year — returns models whose year range overlaps.
 */
export function getCsvModelsForMake(make: string, year?: number): string[] {
  if (!catalog) return [];
  return [
    ...new Set(
      catalog.models
        .filter((r) => {
          if (r.make !== make) return false;
          if (!year) return true;
          const from = r.yearStart ?? 0;
          const to = r.yearEnd ?? new Date().getFullYear() + 2;
          return year >= from && year <= to;
        })
        .map((r) => r.model),
    ),
  ].sort((a, b) => a.localeCompare(b, "tr-TR"));
}

/**
 * Engine entries for a given make/model, optionally filtered by year.
 * Returns entries where genYearStart ≤ year ≤ genYearEnd (open-ended if null).
 */
export function getCsvEnginesFor(make: string, model: string, year?: number): CsvEngineEntry[] {
  if (!catalog) return [];
  return catalog.engines.filter((e) => {
    if (e.make !== make || e.model !== model) return false;
    if (!year) return true;
    const from = e.genYearStart ?? 0;
    const to = e.genYearEnd ?? new Date().getFullYear() + 2;
    return year >= from && year <= to;
  });
}

/** Distinct fuel types available for make/model/(year). */
export function getCsvFuelTypes(make: string, model: string, year?: number): string[] {
  return [...new Set(getCsvEnginesFor(make, model, year).map((e) => e.fuelType).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "tr-TR"),
  );
}

/** Distinct transmissions, cascade-filtered by fuelType when provided. */
export function getCsvTransmissions(
  make: string,
  model: string,
  year?: number,
  fuelType?: string,
): string[] {
  return [
    ...new Set(
      getCsvEnginesFor(make, model, year)
        .filter((e) => !fuelType || e.fuelType === fuelType)
        .map((e) => e.transmission)
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b, "tr-TR"));
}

/** Distinct engine labels, cascade-filtered by fuelType and/or transmission. */
export function getCsvEngineLabels(
  make: string,
  model: string,
  year?: number,
  fuelType?: string,
  transmission?: string,
): string[] {
  return [
    ...new Set(
      getCsvEnginesFor(make, model, year)
        .filter(
          (e) =>
            (!fuelType || e.fuelType === fuelType) &&
            (!transmission || e.transmission === transmission),
        )
        .map((e) => e.engineLabel)
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b, "tr-TR"));
}

/**
 * Human-readable year range for a make/model.
 * Returns e.g. "1990 – günümüz" or "2010 – 2022".
 */
export function getCsvModelYearRange(make: string, model: string): string | null {
  if (!catalog) return null;
  const rows = catalog.models.filter((r) => r.make === make && r.model === model);
  if (!rows.length) return null;
  const starts = rows.map((r) => r.yearStart).filter((y): y is number => y !== null);
  const ends = rows.map((r) => r.yearEnd).filter((y): y is number => y !== null);
  if (!starts.length) return null;
  const from = Math.min(...starts);
  const to = ends.length ? Math.max(...ends) : null;
  return `${from} – ${to ?? "günümüz"}`;
}

/** Stats from the generated catalog file. */
export function getCsvCatalogStats() {
  return catalog?.stats ?? { makes: 0, models: 0, engines: 0 };
}
