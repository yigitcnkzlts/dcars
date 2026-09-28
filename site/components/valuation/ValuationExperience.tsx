"use client";

import { lazy, Suspense, useState } from "react";
import type { VehicleContext } from "@/types/vehicle";
import { DetailedValuationFlow } from "./DetailedValuationFlow";
const VehicleAdvisor = lazy(() => import("@/components/ai/VehicleAdvisor").then((module) => ({ default: module.VehicleAdvisor })));

export function ValuationExperience() {
  const [vehicle, setVehicle] = useState<VehicleContext>();
  const [advisorOpen, setAdvisorOpen] = useState(false);
  return <><DetailedValuationFlow onVehicleChange={setVehicle} /><div id="danisman" className="valuation-help"><button type="button" aria-expanded={advisorOpen} aria-controls="valuation-advisor" onClick={() => setAdvisorOpen((open) => !open)}><span>Bir sorunuz mu var?</span><strong>{advisorOpen ? "Danışmanı kapat −" : "D CARS danışmanına sorun +"}</strong></button><div id="valuation-advisor">{advisorOpen && <Suspense fallback={<p>Danışman hazırlanıyor…</p>}><VehicleAdvisor vehicle={vehicle} /></Suspense>}</div></div></>;
}
