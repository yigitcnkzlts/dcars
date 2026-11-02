import { variantsFor, type VehicleSelection } from "./vehicleCatalogService";

export type LicensedTrimOption = {
  trim: string;
  engine: string;
  transmission: string;
  fuelType: string;
  sourceUrl: string;
  source: string;
  verifiedForTurkey: boolean;
};

export type LicensedTrimCatalogAdapter = {
  id: string;
  usageRights: "commercial";
  findTrims(selection: Required<Pick<VehicleSelection, "year" | "brand" | "model" | "engine" | "fuelType" | "transmission">>): Promise<LicensedTrimOption[]>;
};

const externalAdapters: LicensedTrimCatalogAdapter[] = [];

/**
 * Extension point for a future commercial-data provider. Only adapters with
 * explicit commercial usage rights may be registered here. Provider responses
 * are queried on demand; this service does not bulk-download or persist them.
 */
export async function getLicensedTrimOptions(
  selection: Required<Pick<VehicleSelection, "year" | "brand" | "model" | "engine" | "fuelType" | "transmission">>,
): Promise<LicensedTrimOption[]> {
  const local = variantsFor(selection.year, selection.brand, selection.model)
    .filter((item) => item.engine === selection.engine && item.fuelType === selection.fuelType && item.transmission === selection.transmission)
    .map((item) => ({
      trim: item.trim,
      engine: item.engine,
      transmission: item.transmission,
      fuelType: item.fuelType,
      sourceUrl: item.sourceUrl,
      source: "D CARS doğrulanmış Türkiye kataloğu",
      verifiedForTurkey: true,
    }));
  if (local.length) return local;

  for (const adapter of externalAdapters) {
    const options = await adapter.findTrims(selection);
    if (options.length) return options;
  }
  return [];
}
