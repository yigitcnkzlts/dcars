import { desc, eq, inArray } from "drizzle-orm";
import { appointmentBookings, appointmentHistory, valuationPhotos, valuationRequests } from "@/db/schema";
import { audit, requireAdmin, sameOrigin } from "@/lib/security";
import { enqueueNotification, notificationText } from "@/services/notificationService";

export async function GET(request: Request) {
  const identity = await requireAdmin(request); if (!identity) return Response.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
  try {
    const { getDb } = await import("@/db");
    const db = getDb();
    const records = await db.select({ id: valuationRequests.id, year: valuationRequests.year, brand: valuationRequests.brand, model: valuationRequests.model, firstName: valuationRequests.firstName, lastName: valuationRequests.lastName, phone: valuationRequests.phone, email: valuationRequests.email, status: valuationRequests.status, details: valuationRequests.details, createdAt: valuationRequests.createdAt }).from(valuationRequests).orderBy(desc(valuationRequests.id)).limit(50);
    const ids = records.map((record) => record.id);
    const photos = ids.length ? await db.select({ id: valuationPhotos.id, requestId: valuationPhotos.requestId, area: valuationPhotos.area, fileName: valuationPhotos.fileName }).from(valuationPhotos).where(inArray(valuationPhotos.requestId, ids)) : [];
    return Response.json({ records: records.map((record) => ({ ...record, photos: photos.filter((photo) => photo.requestId === record.id) })) }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Başvurular yüklenemedi." }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  const identity = await requireAdmin(request); if (!identity) return Response.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
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
    let appointmentSlot: string | undefined;
    if (input.status === "appointment_confirmed") {
      const [booking] = await db.select().from(appointmentBookings).where(eq(appointmentBookings.requestId, id)).orderBy(desc(appointmentBookings.id)).limit(1);
      if (record.status !== "appointment_requested" || !booking) return Response.json({ error: "Önce randevu talebi alınmalı." }, { status: 409 });
      appointmentSlot = booking.startAt;
      await db.update(appointmentBookings).set({ status: "confirmed", updatedAt: new Date().toISOString() }).where(eq(appointmentBookings.id, booking.id));
      await db.insert(appointmentHistory).values({ bookingId: booking.id, fromStatus: booking.status, toStatus: "confirmed", actorType: "admin" });
    }
    await db.update(valuationRequests).set({ status: input.status, details }).where(eq(valuationRequests.id, id));
    await audit(identity, `valuation.${input.status}`, "valuation", String(id), { previousStatus: record.status });
    const message = input.status === "reviewing" ? notificationText.reviewing(id) : input.status === "offered" ? notificationText.offered(id) : notificationText.confirmed(id, new Date(appointmentSlot!).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }));
    try { await enqueueNotification({ type: `valuation_${input.status}`, referenceType: "valuation", referenceId: id, dedupeKey: `valuation:${id}:${input.status}`, payload: { message }, channels: [{ channel: "in_app" }, ...(record.email ? [{ channel: "email" as const, destination: record.email }] : []), { channel: "sms", destination: record.phone }] }); } catch { /* The state change remains valid and can be retried by operations. */ }
    return Response.json({ id, status: input.status });
  } catch {
    return Response.json({ error: "Başvuru güncellenemedi." }, { status: 503 });
  }
}
