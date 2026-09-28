import type { VehicleSelection } from "./vehicleCatalogService";

export const selectionFields = ["year", "brand", "model", "transmission", "fuelType", "version", "trim"] as const;

export function updateVehicleSelection(selection: Partial<VehicleSelection>, field: keyof VehicleSelection, value: string | number): Partial<VehicleSelection> {
  const next = { ...selection, [field]: value };
  const position = selectionFields.findIndex((item) => item === field);
  if (position >= 0) {
    for (const key of selectionFields.slice(position + 1)) delete next[key];
    delete next.engine;
    delete next.generation;
  }
  return next;
}
