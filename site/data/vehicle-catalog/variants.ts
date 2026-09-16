export type VehicleVariant = {
  year: number;
  brand: string;
  model: string;
  engine: string;
  fuelType: string;
  transmission: string;
  version: string;
  trim: string;
  factoryEquipment: string[];
  sourceUrl: string;
};

// Verified against Toyota Türkiye's January 2024 Corolla specification brochure.
// This is a bounded sample of verified combinations, not a complete Turkish vehicle catalog.
const sourceUrl = "https://www.toyota.com.tr/content/dam/toyota/nmsc/turkey/cars/e-brosur/corolla/TOYOTA_YeniCorolla_Teknik_Ozellikler_2024.pdf";
const petrolTrims = ["Vision Plus", "Dream", "Dream X-Pack", "Flame X-Pack", "Passion X-Pack"];
const hybridTrims = ["Hybrid Dream", "Hybrid Dream X-Pack", "Hybrid Flame X-Pack", "Hybrid Passion X-Pack"];

export const verifiedVariants: VehicleVariant[] = [
  ...petrolTrims.map((trim) => ({ year: 2024, brand: "Toyota", model: "Corolla", engine: "1.5 L", fuelType: "Benzin", transmission: "Multidrive S", version: "1.5L Benzinli Multidrive S", trim, factoryEquipment: [], sourceUrl })),
  ...hybridTrims.map((trim) => ({ year: 2024, brand: "Toyota", model: "Corolla", engine: "1.8 L", fuelType: "Hibrit", transmission: "e-CVT", version: "1.8L Hybrid e-CVT", trim, factoryEquipment: [], sourceUrl })),
];
