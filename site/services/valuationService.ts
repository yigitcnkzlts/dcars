import type { ValuationRequest } from "@/types/valuation";
import { valuationRequests } from "@/db/schema";
import { selectedVariant } from "@/services/vehicleCatalogService";

export async function createValuationRequest(payload: ValuationRequest) {
  const { getDb } = await import("@/db");
  const db = getDb();
  const [request] = await db.insert(valuationRequests).values({
    year: payload.year,
    brand: payload.brand ?? "",
    model: payload.model ?? "",
    details: {
      mileage: payload.mileage,
      fuelType: payload.fuelType,
      transmission: payload.transmission,
      engine: payload.engine,
      trim: payload.trim,
      version: payload.version,
      inspection: payload.inspection,
      factoryEquipment: selectedVariant(payload)?.factoryEquipment ?? [],
      catalogSource: selectedVariant(payload)?.sourceUrl ?? null,
      optionalEquipment: payload.optionalEquipment,
      preferredContactMethod: payload.preferredContactMethod,
      replacedParts: payload.replacedParts,
      paintedParts: payload.paintedParts,
      damageAmount: payload.damageAmount,
      severeDamage: payload.severeDamage,
      condition: payload.condition,
      accidentStatus: payload.accidentStatus,
      damageNotes: payload.damageNotes,
      expectedPrice: payload.expectedPrice,
      saleTiming: payload.saleTiming,
      preferredContactTime: payload.preferredContactTime,
    },
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone.replace(/\s/g, ""),
    email: payload.email,
  }).returning();
  return request;
}
