import { readFile } from "node:fs/promises";

const [file] = process.argv.slice(2);
if (!file) {
  console.error("Kullanım: node scripts/validate-vehicle-catalog.mjs <variants.json>");
  process.exit(2);
}

const rows = JSON.parse(await readFile(file, "utf8"));
if (!Array.isArray(rows)) throw new Error("Kök değer bir varyant dizisi olmalı.");

const errors = [];
const ids = new Set();
const combinations = new Set();
const requiredText = ["brand", "model", "generation", "engineName", "fuelType", "transmission", "driveType", "trim", "sourceUrl"];

for (const [index, row] of rows.entries()) {
  const label = `Satır ${index + 1}`;
  if (!row || typeof row !== "object" || Array.isArray(row)) { errors.push(`${label}: nesne olmalı`); continue; }
  for (const key of requiredText) if (typeof row[key] !== "string" || !row[key].trim()) errors.push(`${label}: ${key} eksik`);
  if (!Number.isInteger(row.year) || row.year < 1886 || row.year > new Date().getFullYear() + 1) errors.push(`${label}: geçersiz model yılı`);
  if (!Number.isInteger(row.startYear) || (row.endYear != null && (!Number.isInteger(row.endYear) || row.endYear < row.startYear)) || row.year < row.startYear || (row.endYear != null && row.year > row.endYear)) errors.push(`${label}: model yılı nesil aralığına uymuyor`);
  for (const [kind, start, end] of [["motor", row.engineStartYear, row.engineEndYear], ["paket", row.trimStartYear, row.trimEndYear]]) {
    if ((start != null && (!Number.isInteger(start) || row.year < start)) || (end != null && (!Number.isInteger(end) || row.year > end)) || (start != null && end != null && end < start)) errors.push(`${label}: ${kind} yılı uyuşmuyor`);
  }
  if (row.engineCc != null && (!Number.isInteger(row.engineCc) || row.engineCc <= 0)) errors.push(`${label}: geçersiz motor hacmi`);
  if (row.fuelType === "Elektrik" && row.engineCc != null) errors.push(`${label}: elektrikli araçta motor hacmi olamaz`);
  if (row.powerHp != null && (!Number.isInteger(row.powerHp) || row.powerHp <= 0)) errors.push(`${label}: geçersiz beygir değeri`);
  if (row.powerKw != null && (!Number.isInteger(row.powerKw) || row.powerKw <= 0)) errors.push(`${label}: geçersiz elektrik motoru gücü`);
  if (row.market !== "TR") errors.push(`${label}: market TR olmalı`);
  if (typeof row.isActive !== "boolean") errors.push(`${label}: isActive boolean olmalı`);
  if (row.factoryEquipment != null && (!Array.isArray(row.factoryEquipment) || row.factoryEquipment.length > 100 || !row.factoryEquipment.every((item) => typeof item === "string" && item.length <= 120))) errors.push(`${label}: factoryEquipment geçersiz`);
  try { if (!["http:", "https:"].includes(new URL(row.sourceUrl).protocol)) throw new Error(); } catch { errors.push(`${label}: kaynak URL geçersiz`); }
  if (row.id != null) { if (ids.has(row.id)) errors.push(`${label}: tekrarlı id`); ids.add(row.id); }
  const key = [row.brand, row.model, row.generation, row.year, row.engineName, row.transmission, row.driveType, row.trim].join("|").toLocaleLowerCase("tr-TR");
  if (combinations.has(key)) errors.push(`${label}: tekrarlı varyant`);
  combinations.add(key);
}

if (errors.length) {
  console.error(errors.slice(0, 100).join("\n"));
  console.error(`${errors.length} hata bulundu.`);
  process.exit(1);
}

console.log(`${rows.length} kaynaklı varyant doğrulandı.`);
