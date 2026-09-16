import { and, eq } from "drizzle-orm";
import { valuationRequests } from "@/db/schema";

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") || 0) > 2048) return Response.json({ error: "İstek çok uzun." }, { status: 413 });
    const input = await request.json() as { id?: number; phone?: string; slot?: string };
    const id = Number(input.id);
    const phone = String(input.phone ?? "").replace(/\s/g, "");
    const slot = String(input.slot ?? "");
    const date = new Date(slot);
    if (!Number.isSafeInteger(id) || id < 1 || !/^0?5\d{9}$/.test(phone) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(slot) || Number.isNaN(date.getTime()) || date.getTime() < Date.now() + 60 * 60 * 1000 || date.getTime() > Date.now() + 30 * 86400_000) return Response.json({ error: "Geçerli bir gün ve saat seçin." }, { status: 400 });
    const { getDb } = await import("@/db");
    const db = getDb();
    const [record] = await db.select().from(valuationRequests).where(and(eq(valuationRequests.id, id), eq(valuationRequests.phone, phone))).limit(1);
    if (!record) return Response.json({ error: "Başvuru bulunamadı." }, { status: 404 });
    if (!(["offered", "appointment_requested"].includes(record.status))) return Response.json({ error: "Randevu talebi teklif hazır olduğunda açılır." }, { status: 409 });
    const details = record.details as Record<string, unknown>;
    await db.update(valuationRequests).set({ status: "appointment_requested", details: { ...details, appointment: { slot, requestedAt: new Date().toISOString() } } }).where(eq(valuationRequests.id, id));
    return Response.json({ status: "appointment_requested", slot });
  } catch {
    return Response.json({ error: "Randevu talebi kaydedilemedi." }, { status: 503 });
  }
}
