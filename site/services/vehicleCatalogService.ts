import { verifiedVariants, type VehicleVariant } from "@/data/vehicle-catalog/variants";

export type VehicleSelection = Pick<VehicleVariant, "year" | "brand" | "model" | "engine" | "fuelType" | "transmission" | "version" | "trim">;
export type SelectionField = "engine" | "fuelType" | "transmission" | "version" | "trim";

export function variantsFor(year: number, brand: string, model: string): VehicleVariant[] {
  return verifiedVariants.filter((item) => item.year === year && item.brand === brand && item.model === model);
}

export function optionsFor(selection: Partial<VehicleSelection>, field: SelectionField): string[] {
  const order: SelectionField[] = ["engine", "fuelType", "transmission", "version", "trim"];
  const preceding = order.slice(0, order.indexOf(field));
  return [...new Set(variantsFor(selection.year ?? 0, selection.brand ?? "", selection.model ?? "")
    .filter((item) => preceding.every((key) => !selection[key] || item[key] === selection[key]))
    .map((item) => item[field]))];
}

export function selectedVariant(selection: Partial<VehicleSelection>): VehicleVariant | undefined {
  return verifiedVariants.find((item) => item.year === selection.year && item.brand === selection.brand && item.model === selection.model && item.engine === selection.engine && item.fuelType === selection.fuelType && item.transmission === selection.transmission && item.version === selection.version && item.trim === selection.trim);
}

export function trimOptionsFor(selection: Partial<VehicleSelection>): string[] {
  return [...new Set(variantsFor(selection.year ?? 0, selection.brand ?? "", selection.model ?? "")
    .filter((item) => (!selection.engine || item.engine === selection.engine) &&
      (!selection.fuelType || item.fuelType === selection.fuelType) &&
      (!selection.transmission || item.transmission === selection.transmission))
    .map((item) => item.trim))];
}
