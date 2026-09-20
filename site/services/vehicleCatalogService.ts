import { verifiedVariants, type VehicleVariant } from "@/data/vehicle-catalog/variants";

export type VehicleSelection = Pick<VehicleVariant, "year" | "brand" | "model" | "engine" | "fuelType" | "transmission" | "version" | "trim"> & { generation?: string };
export type SelectionField = "generation" | "engine" | "fuelType" | "transmission" | "version" | "trim";

export function variantsFor(year: number, brand: string, model: string): VehicleVariant[] {
  return verifiedVariants.filter((item) => item.year === year && item.brand === brand && item.model === model);
}

export function optionsFor(selection: Partial<VehicleSelection>, field: SelectionField): string[] {
  const order: SelectionField[] = ["generation", "engine", "fuelType", "transmission", "version", "trim"];
  const preceding = order.slice(0, order.indexOf(field));
  return [...new Set(variantsFor(selection.year ?? 0, selection.brand ?? "", selection.model ?? "")
    .filter((item) => preceding.every((key) => !selection[key] || (key === "generation" ? item.generation ?? "Nesil belirtilmedi" : item[key]) === selection[key]))
    .map((item) => field === "generation" ? item.generation ?? "Nesil belirtilmedi" : item[field] ?? "").filter(Boolean))];
}

export function selectedVariant(selection: Partial<VehicleSelection>): VehicleVariant | undefined {
  return verifiedVariants.find((item) => item.year === selection.year && item.brand === selection.brand && item.model === selection.model && (!selection.generation || (item.generation ?? "Nesil belirtilmedi") === selection.generation) && item.engine === selection.engine && item.fuelType === selection.fuelType && item.transmission === selection.transmission && item.version === selection.version && item.trim === selection.trim);
}

export function trimOptionsFor(selection: Partial<VehicleSelection>): string[] {
  return [...new Set(variantsFor(selection.year ?? 0, selection.brand ?? "", selection.model ?? "")
    .filter((item) => (!selection.generation || item.generation === selection.generation) &&
      (!selection.engine || item.engine === selection.engine) &&
      (!selection.fuelType || item.fuelType === selection.fuelType) &&
      (!selection.transmission || item.transmission === selection.transmission))
    .map((item) => item.trim))];
}

const normalizeSearch = (value: string) => value.toLocaleLowerCase("tr-TR")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ").trim();

const generationAliases: Record<string, string> = { "Clio IV": "clio 4", "Clio V": "clio 5", "Golf VII.5": "golf 7 7.5", "Qashqai J11": "j11", "Qashqai J12": "j12" };

/** Searches only source-backed year, engine, gearbox and trim combinations. */
export function searchVerifiedVariants(query: string, limit = 25): VehicleVariant[] {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return verifiedVariants.filter((item) => {
    const searchable = normalizeSearch([item.year, item.brand, item.model, item.generation, generationAliases[item.generation ?? ""], item.engine, item.fuelType, item.transmission, item.trim].filter(Boolean).join(" "));
    return terms.every((term) => searchable.includes(term));
  }).slice(0, Math.max(0, limit));
}
