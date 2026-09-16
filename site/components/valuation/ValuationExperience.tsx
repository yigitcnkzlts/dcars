"use client";

import { useState } from "react";
import type { VehicleContext } from "@/types/vehicle";
import { VehicleAdvisor } from "@/components/ai/VehicleAdvisor";
import { QuickValuationForm } from "./QuickValuationForm";

export function ValuationExperience() {
  const [vehicle, setVehicle] = useState<VehicleContext>();
  return <><QuickValuationForm onVehicleChange={setVehicle} /><div id="danisman"><VehicleAdvisor vehicle={vehicle} /></div></>;
}
