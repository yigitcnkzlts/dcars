import { rateLimit, rateLimited, sameOrigin } from "@/lib/security";
import { analyzeVehiclePrice } from "@/services/vehiclePriceAnalysisService";

async function analyze(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 }); const limited = await rateLimit(request, "price-analysis", 12, 3600); if (!limited.allowed) return rateLimited(limited.retryAfter);
  const input = await request.json().catch(() => ({})) as Record<string, unknown>; const year = Number(input.year), mileage = Number(input.mileage), brand = String(input.brand ?? "").trim(), model = String(input.model ?? "").trim();
  if (!brand || brand.length > 80 || !model || model.length > 80 || !Number.isInteger(year) || year < 1985 || year > new Date().getFullYear() + 1 || !Number.isFinite(mileage) || mileage < 0 || mileage > 2_000_000) return Response.json({ error: "Araç bilgilerini kontrol edin." }, { status: 400 });
  const result = await analyzeVehiclePrice({ brand, model, year, mileage, fuelType: typeof input.fuelType === "string" ? input.fuelType.slice(0, 40) : undefined, transmission: typeof input.transmission === "string" ? input.transmission.slice(0, 40) : undefined, trim: typeof input.trim === "string" ? input.trim.slice(0, 80) : undefined, damageAmount: Number(input.damageAmount) || undefined, severeDamage: input.severeDamage === true, mechanicalIssue: input.mechanicalIssue === true });
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  try { return await analyze(request); }
  catch (error) {
    console.error("Price analysis unavailable", { message: error instanceof Error ? error.message : "unknown" });
    return Response.json({ error: "Fiyat analizi veritabanı bu demo ortamında henüz yapılandırılmadı." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
