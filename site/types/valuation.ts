import type { VehicleContext } from "./vehicle";

export type InspectionStatus = "Orijinal" | "Lokal Boyalı" | "Boyalı" | "Değişen";
export type InspectionPart = "Sol Ön Çamurluk" | "Sol Ön Kapı" | "Sol Arka Kapı" | "Sol Arka Çamurluk" | "Sağ Ön Çamurluk" | "Sağ Ön Kapı" | "Sağ Arka Kapı" | "Sağ Arka Çamurluk" | "Kaput" | "Tavan" | "Bagaj" | "Ön Tampon" | "Arka Tampon";
export type VehicleInspection = Record<InspectionPart, InspectionStatus>;
export type ContactMethod = "Telefon" | "WhatsApp" | "E-posta";

export type ValuationRequest = VehicleContext & {
  generation?: string;
  catalogMatched?: boolean;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  engine?: string;
  trim?: string;
  color?: string;
  version?: string;
  inspection?: VehicleInspection;
  factoryEquipment?: string[];
  optionalEquipment?: string[];
  preferredContactMethod?: ContactMethod;
  replacedParts?: string;
  paintedParts?: string;
  damageAmount?: string;
  severeDamage?: string;
  condition?: string;
  accidentStatus?: string;
  damageNotes?: string;
  expectedPrice?: string;
  saleTiming?: string;
  city?: string;
  plate?: string;
  callRequested?: boolean;
  preferredContactTime?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};
