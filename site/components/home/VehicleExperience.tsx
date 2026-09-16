"use client";

import { useState } from "react";
import type { VehicleContext } from "@/types/vehicle";
import { QuickValuationForm } from "@/components/valuation/QuickValuationForm";
import { VehicleAdvisor } from "@/components/ai/VehicleAdvisor";

export function VehicleExperience() {
  const [vehicle, setVehicle] = useState<VehicleContext>({});
  return <div className="vehicle-experience"><QuickValuationForm onVehicleChange={setVehicle} /><VehicleAdvisor vehicle={vehicle} /></div>;
}
