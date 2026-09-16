import { desc, eq } from "drizzle-orm";
import { valuationRequests } from "@/db/schema";

function authorized(request: Request) { const secret = process.env.VALUATION_ADMIN_TOKEN; return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`); }

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Yetkisiz işlem." }, { status: 401 });
  try {
    const { getDb } = await import("@/db");
    const records = await getDb().select({ id: valuationRequests.id, year: valuationRequests.year, brand: valuationRequests.brand, model: valuationRequests.model, firstName: valuationRequests.firstName, lastName: valuationRequests.lastName, phone: valuationRequests.phone, status: valuationRequests.status, details: valuationRequests.details, createdAt: valuationRequests.createdAt }).from(valuationRequests).orderBy(desc(valuationRequests.id)).limit(50);
    return Response.json({ records }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Başvurular yüklenemedi." }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Yetkisiz işlem." }, { status: 401 });
  try {
    if (Number(request.headers.get("content-length") || 0) > 2048) return Response.json({ error: "İstek çok uzun." }, { status: 413 });
    const input = await request.json() as { id?: number; status?: string; offerLow?: number; offerHigh?: number };
    const id = Number(input.id);
    if (!Number.isSafeInteger(id) || id < 1 || !["reviewing", "offered", "appointment_confirmed"].includes(input.status ?? "")) return Response.json({ error: "Geçersiz başvuru veya durum." }, { status: 400 });
    const { getDb } = await import("@/db");
    const db = getDb();
    const [record] = await db.select().from(valuationRequests).where(eq(valuationRequests.id, id)).limit(1);
    if (!record) return Response.json({ error: "Başvuru bulunamadı." }, { status: 404 });
    const details = record.details as Record<string, unknown>;
    if (input.status === "offered") {
      const low = Number(input.offerLow), high = Number(input.offerHigh);
      if (!Number.isSafeInteger(low) || !Number.isSafeInteger(high) || low < 1 || high < low) return Response.json({ error: "Geçerli teklif aralığı girin." }, { status: 400 });
      details.offer = { low, high, updatedAt: new Date().toISOString() };
    }
    if (input.status === "appointment_confirmed" && (record.status !== "appointment_requested" || !details.appointment)) return Response.json({ error: "Önce randevu talebi alınmalı." }, { status: 409 });
    if (input.status === "appointment_confirmed") details.appointment = { ...(details.appointment as object), confirmedAt: new Date().toISOString() };
    await db.update(valuationRequests).set({ status: input.status, details }).where(eq(valuationRequests.id, id));
    return Response.json({ id, status: input.status });
  } catch {
    return Response.json({ error: "Başvuru güncellenemedi." }, { status: 503 });
  }
}
