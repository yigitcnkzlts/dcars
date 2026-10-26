import { and, eq, gte, lte } from "drizzle-orm";
import { vehicleMarketComparables, vehiclePriceAnalyses } from "@/db/schema";

export type PriceInput = { brand: string; model: string; year: number; mileage: number; fuelType?: string; transmission?: string; trim?: string; damageAmount?: number; severeDamage?: boolean; mechanicalIssue?: boolean; requestId?: number };
export const insufficientMessage = "Bu araç için güvenilir otomatik fiyat analizi oluşturulamadı. D CARS ekibi aracınızı inceleyerek size özel teklif hazırlayacaktır.";

export async function analyzeVehiclePrice(input: PriceInput) {
  const { getDb } = await import("@/db"); const db = getDb();
  const rows = await db.select().from(vehicleMarketComparables).where(and(eq(vehicleMarketComparables.brand, input.brand), eq(vehicleMarketComparables.model, input.model), gte(vehicleMarketComparables.year, input.year - 1), lte(vehicleMarketComparables.year, input.year + 1), eq(vehicleMarketComparables.licensed, true), eq(vehicleMarketComparables.active, true))).limit(30);
  if (rows.length < 3) return { available: false as const, message: insufficientMessage, analysisDate: new Date().toISOString(), confidence: "insufficient" };
  const adjusted = rows.map((row) => { const yearFactor = 1 + (input.year - row.year) * 0.04; const mileageFactor = Math.max(0.75, Math.min(1.25, 1 + (row.mileage - input.mileage) * 0.0000015)); return row.price * yearFactor * mileageFactor; }).sort((a, b) => a - b);
  const median = adjusted[Math.floor(adjusted.length / 2)]; let conditionFactor = 1; const factors: string[] = [];
  if (input.severeDamage) { conditionFactor -= 0.15; factors.push("Ağır hasar beyanı karşılaştırma medyanını %15 düşürdü."); }
  if (input.mechanicalIssue) { conditionFactor -= 0.07; factors.push("Mekanik sorun beyanı karşılaştırma medyanını %7 düşürdü."); }
  if (input.damageAmount && input.damageAmount > 0) { const impact = Math.min(0.08, input.damageAmount / Math.max(median, 1) * 0.5); conditionFactor -= impact; factors.push("Tramer tutarı, araç değerine oranlı ve üst sınırı olan bir düzeltmeyle hesaba katıldı."); }
  factors.unshift(`Kilometre farkı emsal başına aylık olmayan sabit bir katsayıyla normalize edildi (${input.mileage.toLocaleString("tr-TR")} km).`);
  const center = median * conditionFactor, low = Math.round(center * 0.94 / 1000) * 1000, high = Math.round(center * 1.06 / 1000) * 1000;
  const result = { available: true as const, low, high, factors, comparableCount: rows.length, analysisDate: new Date().toISOString(), dataSource: [...new Set(rows.map((row) => row.sourceName))].join(", "), confidence: rows.length >= 8 ? "high" : rows.length >= 5 ? "medium" : "low" };
  await db.insert(vehiclePriceAnalyses).values({ requestId: input.requestId, input, result, dataSource: result.dataSource, confidence: result.confidence });
  return result;
}
