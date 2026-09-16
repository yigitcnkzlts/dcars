import type { VehicleContext } from "./vehicle";

export type ValuationRequest = VehicleContext & {
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  engine?: string;
  trim?: string;
  replacedParts?: string;
  paintedParts?: string;
  damageAmount?: string;
  severeDamage?: string;
  condition?: string;
  accidentStatus?: string;
  damageNotes?: string;
  expectedPrice?: string;
  saleTiming?: string;
  preferredContactTime?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};
