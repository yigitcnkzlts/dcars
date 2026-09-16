export type VehicleContext = {
  year?: number;
  mileage?: number;
  brand?: string;
  model?: string;
  fuelType?: string;
  transmission?: string;
  engine?: string;
  trim?: string;
};

export type VehicleBrand = {
  name: string;
  slug: string;
  models: string[];
};
