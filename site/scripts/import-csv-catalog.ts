/**
 * import-csv-catalog.ts
 *
 * Reads D:\dcars-katalog\data\makes-models.csv and engines.csv,
 * normalizes the data, deduplicates records, and writes
 * site/data/vehicle-catalog/csv-catalog.json.
 *
 * Data source: https://github.com/gor3a/vehicle-makes-models
 * Data license: ODbL 1.0 — Open Database License.
 * Attribution required. Share-alike applies to derived databases.
 * See https://opendatacommons.org/licenses/odbl/1-0/ for details.
 *
 * IMPORTANT: Records in this catalog are NOT marked as verified.
 * They are NOT sourced from Turkish market official documents.
 * Do NOT merge with verifiedVariants or set verifiedLevel on these records.
 *
 * Run: npx tsx scripts/import-csv-catalog.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ── Paths ─────────────────────────────────────────────────────────────────────
const CATALOG_ROOT = "D:\\dcars-katalog\\data";
const OUT_PATH = path.join(import.meta.dirname, "..", "data", "vehicle-catalog", "csv-catalog.json");

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CsvModelRow {
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
}

export interface CsvEngineRow {
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

export interface CsvCatalog {
  generatedAt: string;
  sourceRepo: string;
  dataLicense: string;
  stats: { makes: number; models: number; engines: number };
  models: CsvModelRow[];
  engines: CsvEngineRow[];
}

// ── Normalisation helpers ─────────────────────────────────────────────────────

/** Normalise make names to match vehicleDataService entries where possible. */
function normaliseMake(raw: string): string {
  const map: Record<string, string> = {
    "Alfa Romeo": "Alfa Romeo",
    "Aston Martin": "Aston Martin",
    "Land Rover": "Land Rover",
    "Mercedes-Benz": "Mercedes-Benz",
    "Mercedes Benz": "Mercedes-Benz",
    "Rolls-Royce": "Rolls-Royce",
    "DS Automobiles": "DS Automobiles",
  };
  return map[raw] ?? raw.trim();
}

/** Strip make-name prefix that some CSV entries embed in the model field.
 *  e.g. "MERCEDES BENZ C-Class" → "C-Class"
 *       "Volkswagen Golf GTI"   → "Golf GTI"   (if make is Volkswagen)
 */
function normaliseModel(rawModel: string, make: string): string {
  const stripped = rawModel.trim();
  // Build a prefix pattern from the make name (case-insensitive, ignore hyphens/spaces variants)
  const makeVariants = [
    make,
    make.replace(/-/g, " "),
    make.toUpperCase(),
    make.replace(/-/g, " ").toUpperCase(),
  ];
  for (const variant of makeVariants) {
    if (stripped.toUpperCase().startsWith(variant.toUpperCase() + " ")) {
      return stripped.slice(variant.length).trim();
    }
  }
  return stripped;
}

/** Map CSV fuel_type strings → Turkish UI labels */
function normaliseFuelType(raw: string): string {
  const r = raw.trim().toLowerCase();
  if (r === "gasoline" || r === "petrol") return "Benzin";
  if (r === "diesel") return "Dizel";
  if (r === "electric") return "Elektrik";
  if (r === "hybrid gasoline" || r === "hybrid") return "Hibrit";
  if (r === "hybrid diesel") return "Hibrit Dizel";
  if (r === "mild hybrid" || r === "mild hybrid gasoline") return "Mild Hibrit";
  if (r === "mild hybrid diesel") return "Mild Hibrit Dizel";
  if (r === "plug-in hybrid") return "Plug-in Hibrit";
  if (r.includes("lpg") || r.includes("liquefied petroleum")) return "LPG";
  if (r.includes("natural gas") || r.includes("cng")) return "CNG";
  if (r === "hydrogen fuel cell") return "Hidrojen";
  if (r === "ethanol") return "Etanol";
  return raw.trim(); // keep unknown values as-is
}

/** Normalise transmission strings — collapse trivial case/spacing variants. */
function normaliseTransmission(raw: string): string {
  if (!raw?.trim()) return "";
  const r = raw.trim().replace(/\s+/g, " ").replace(/\s*-\s*/g, "-");
  const lower = r.toLowerCase();

  // CVT / continuously variable
  if (lower.includes("cvt") || lower.includes("continuously variable") || lower.includes("x-tronic") || lower.includes("xtronic") || lower.includes("lineartronic") || lower.includes("multitronic")) return "CVT";

  // Single-speed electric / e-motor only
  if (lower.match(/^1[- ]?speed/) || lower.includes("single speed") || lower.includes("single-speed") || lower.includes("ingle speed") || lower.includes("e-motor") || lower.includes("direct drive")) return "Tek hız (Elektrik)";

  // Dedicated Hybrid Transmission
  if (lower.includes("dedicated hybrid") || lower.includes("dht") || lower.includes("e-cvt") || lower.includes("ecvt") || lower.includes("hybrid synergy") || lower.includes("hybrid transaxle") || lower.includes("multimode e-tech") || lower.includes("e-tech") || lower.includes("planetary gear") || lower.includes("reductor") || lower.includes("intelligent variable") || lower.includes("ivt") || lower.includes("i-vt")) return "Hibrit Sürücü (e-CVT)";

  // Thermal + electric combo (e.g. "4-Speed thermal, 2-speed electric")
  if (lower.includes("thermal") && lower.includes("electric")) return "Hibrit Sürücü (e-CVT)";

  // "Hybridised" gearbox
  if (lower.includes("hybridis")) return "Hibrit Sürücü (e-CVT)";

  // DCT / dual-clutch / DSG / PDK / S tronic / Powershift
  if (lower.includes("dual-clutch") || lower.includes("dual clutch") || lower.includes("dct")
    || lower.includes(" dsg") || lower.startsWith("dsg") || lower.includes("pdk")
    || lower.includes("s tronic") || lower.includes("s-tronic") || lower.includes("stronic")
    || lower.includes("powershift") || lower.includes("edct") || lower.includes("e-dcs")
    || lower.includes("e-dct") || lower.includes("speedshift dct") || lower.includes("speedshift mct")
    || lower.includes("speedshift tct") || lower.includes("efficient dual clutch")
    || lower.includes("7dct") || lower.includes("8dct") || lower.includes("double clutch")
    || lower.includes("alfa tct") || lower.includes("direct shift gearbox")
    || lower.includes("dualogic") || lower.includes("tronic plus")) {
    const speeds = r.match(/(\d+)[- ]?speed/i) ?? r.match(/^(\d+)/);
    return speeds ? `${speeds[1]} ileri DSG/DCT` : "DSG/DCT";
  }

  // Semi-automatic / sequential / automated manual / ISR
  if (lower.includes("semi-automatic") || lower.includes("semi automatic") || lower.includes("sequential")
    || lower.includes("automated manual") || lower.includes("isr") || lower.includes("paddleshift")
    || lower.includes("selespeed") || lower.includes("robotised") || lower.includes("amt")
    || lower.includes("imt") || lower.match(/\bimt\b/)) return "Yarı otomatik";

  // Manual (must come before Automatic to avoid matching "automatic" in "semi-automatic")
  if (lower.includes("manual") || lower.match(/\bmt\b/) || lower.match(/manua\b/)) {
    const speeds = r.match(/(\d+)[- ]?speed/i) ?? r.match(/^(\d+)/);
    return speeds ? `${speeds[1]} ileri Manuel` : "Manuel";
  }

  // Active Adaptive Shift / Direct Mode automatics
  if (lower.includes("active adaptive") || lower.includes("direct mode")) {
    const speeds = r.match(/(\d+)[- ]?speed/i) ?? r.match(/^(\d+)/);
    return speeds ? `${speeds[1]} ileri Otomatik` : "Otomatik";
  }

  // Automatic — covers Hydra-Matic, Tiptronic, Steptronic, ZF, Aisin, etc.
  if (lower.includes("automatic") || lower.includes("automat") || lower.includes("hydra-matic")
    || lower.includes("hydramatic") || lower.includes("torque converter") || lower.includes("steptronic")
    || lower.includes("tiptronic") || lower.includes("selectshift") || lower.includes("autoshift")
    || lower.match(/\bat\b/) || lower.match(/\d+at\b/) || lower.match(/\bat\d+/)
    || lower.match(/^(\d+)[- ]?speed\s+(auto|at)/)) {
    const speeds = r.match(/(\d+)[- ]?speed/i) ?? r.match(/^(\d+)/);
    return speeds ? `${speeds[1]} ileri Otomatik` : "Otomatik";
  }

  // Remaining edge cases
  if (lower.includes("single gear") || lower.includes("single sped") || lower.includes("e-shifter") || lower.includes("electronic shift-by-wire")) return "Tek hız (Elektrik)";
  if (lower.includes("dual dry clutch") || lower.includes("dual clutch tranmission") || lower.includes("gearbox with drivelogic")) {
    const numMap: Record<string, string> = { seven: "7", six: "6", five: "5", four: "4" };
    const match = r.match(/(\d+)[- ]?speed/i) ?? r.match(/\b(seven|six|five|four)\b/i);
    const n = match ? (numMap[match[1].toLowerCase()] ?? match[1]) : "";
    return n ? `${n} ileri DSG/DCT` : "DSG/DCT";
  }
  // Garbled / irrelevant data (e.g. tyre spec in wrong column) — discard
  if (lower.match(/^[pbr]\d{2,3}/) || lower.includes("all-terrain") || lower.includes("tyre") || lower.includes("tire")) return "";

  return r; // keep truly unclassified values as-is
}

function toInt(value: string): number | null {  const n = parseInt(value.trim(), 10);
  return isNaN(n) ? null : n;
}

function toFloat(value: string): number | null {
  const n = parseFloat(value.trim().replace(",", "."));
  return isNaN(n) ? null : n;
}

// ── Minimal RFC-4180 CSV parser ───────────────────────────────────────────────
function parseCSV(content: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let inQuote = false;
  let currentRow: string[] = [];

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];

    if (inQuote) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuote = false; }
      else { field += ch; }
    } else {
      if (ch === '"') { inQuote = true; }
      else if (ch === ',') { currentRow.push(field); field = ""; }
      else if (ch === '\n' || (ch === '\r' && next === '\n')) {
        if (ch === '\r') i++;
        currentRow.push(field);
        field = "";
        rows.push(currentRow);
        currentRow = [];
      } else { field += ch; }
    }
  }
  // last field/row
  if (field || currentRow.length) { currentRow.push(field); rows.push(currentRow); }

  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim().replace(/^\uFEFF/, ""));
  const result: Record<string, string>[] = [];
  for (let r = 1; r < rows.length; r++) {
    if (rows[r].length === 1 && rows[r][0] === "") continue; // skip blank
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => { obj[h] = (rows[r][idx] ?? "").trim(); });
    result.push(obj);
  }
  return result;
}
console.log("📖 Reading CSV files…");

const modelsRaw = parseCSV(fs.readFileSync(path.join(CATALOG_ROOT, "makes-models.csv"), "utf-8"));
const enginesRaw = parseCSV(fs.readFileSync(path.join(CATALOG_ROOT, "engines.csv"), "utf-8"));

console.log(`  Raw models: ${modelsRaw.length}, Raw engines: ${enginesRaw.length}`);

// ── Transform makes-models ────────────────────────────────────────────────────
const modelsNorm: CsvModelRow[] = [];
const modelDedupe = new Set<string>();

for (const row of modelsRaw) {
  const make = normaliseMake(row["make"]);
  const model = normaliseModel(row["model"] ?? "", make);
  if (!make || !model) continue;

  const key = `${make}|${model}`;
  if (modelDedupe.has(key)) continue;
  modelDedupe.add(key);

  modelsNorm.push({
    make,
    model,
    yearStart: toInt(row["year_start"]),
    yearEnd: toInt(row["year_end"]) ?? null,
  });
}

// ── Transform engines ─────────────────────────────────────────────────────────
const enginesNorm: CsvEngineRow[] = [];
const engineDedupe = new Set<string>();
let skippedEngines = 0;

for (const row of enginesRaw) {
  const make = normaliseMake(row["make"]);
  const model = normaliseModel(row["model"] ?? "", make);
  const generation = row["generation"]?.trim() ?? "";
  const engineLabel = row["engine_label"]?.trim() ?? "";
  const rawFuel = row["fuel_type"]?.trim() ?? "";
  const rawTrans = row["transmission"]?.trim() ?? "";

  if (!make || !model || !engineLabel) { skippedEngines++; continue; }

  const fuelType = normaliseFuelType(rawFuel);
  const transmission = normaliseTransmission(rawTrans);

  const key = `${make}|${model}|${generation}|${engineLabel}|${fuelType}|${transmission}`;
  if (engineDedupe.has(key)) continue;
  engineDedupe.add(key);

  enginesNorm.push({
    make,
    model,
    generation,
    genYearStart: toInt(row["gen_year_start"]),
    genYearEnd: toInt(row["gen_year_end"]) ?? null,
    bodyType: row["body_type"]?.trim() ?? "",
    engineLabel,
    fuelType,
    cylinders: toInt(row["cylinders"]),
    displacementCc: toInt(row["displacement_cc"]),
    powerHp: toInt(row["power_hp"]),
    torqueNm: toInt(row["torque_nm"]),
    transmission,
    drivetrain: row["drivetrain"]?.trim() ?? "",
    zeroTo100s: toFloat(row["zero_to_100_s"]),
    topSpeedKmh: toInt(row["top_speed_kmh"]),
  });
}

// ── Compute stats ─────────────────────────────────────────────────────────────
const uniqueMakes = new Set(modelsNorm.map((r) => r.make)).size;

const output: CsvCatalog = {
  generatedAt: new Date().toISOString(),
  sourceRepo: "https://github.com/gor3a/vehicle-makes-models",
  dataLicense: "ODbL 1.0 — https://opendatacommons.org/licenses/odbl/1-0/",
  stats: { makes: uniqueMakes, models: modelsNorm.length, engines: enginesNorm.length },
  models: modelsNorm,
  engines: enginesNorm,
};

// ── Write output ──────────────────────────────────────────────────────────────
fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 0), "utf-8");
const fileSizeKb = Math.round(fs.statSync(OUT_PATH).size / 1024);

console.log("\n✅ Import complete");
console.log(`   Makes:   ${uniqueMakes}`);
console.log(`   Models:  ${modelsNorm.length} (raw: ${modelsRaw.length}, deduped: ${modelsRaw.length - modelsNorm.length})`);
console.log(`   Engines: ${enginesNorm.length} (raw: ${enginesRaw.length}, skipped: ${skippedEngines}, deduped: ${enginesRaw.length - skippedEngines - enginesNorm.length})`);
console.log(`   Output:  ${OUT_PATH} (${fileSizeKb} KB)`);
console.log("\n⚠  Reminder: This data is NOT verified for the Turkish market.");
console.log("   Do NOT merge with verifiedVariants or set verifiedLevel on these records.");
