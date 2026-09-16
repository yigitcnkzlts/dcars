import type { VehicleContext } from "./vehicle";

export type AdvisorRequest = {
  message: string;
  vehicle?: VehicleContext;
  profile?: { saleTiming?: string; accidentStatus?: string; damageArea?: string };
};

export type AdvisorResponse = {
  answer: string;
  suggestions: string[];
};
