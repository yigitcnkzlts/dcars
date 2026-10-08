import type { VehicleSelection } from "./vehicleCatalogService";

export const selectionFields = ["year", "brand", "model", "transmission", "fuelType", "engine", "trim"] as const;

export function updateVehicleSelection(selection: Partial<VehicleSelection>, field: keyof VehicleSelection, value: string | number): Partial<VehicleSelection> {
  const next = { ...selection, [field]: value };
  const position = selectionFields.findIndex((item) => item === field);
  if (position >= 0) {
    for (const key of selectionFields.slice(position + 1)) delete next[key];
    if (field !== "engine") delete next.engine;
    if (field !== "generation") delete next.generation;
    if (field !== "trim") delete next.version;
  }
  return next;
}
