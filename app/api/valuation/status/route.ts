import { and, count, desc, eq } from "drizzle-orm";
import { appointmentBookings, valuationPhotos, valuationRequests } from "@/db/schema";
import { rateLimit, rateLimited, sameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
    const limited = await rateLimit(request, "valuation-status", 10, 900); if (!limited.allowed) return rateLimited(limited.retryAfter);
    if (Number(request.headers.get("content-length") || 0) > 2048) return Response.json({ error: "Sorgu çok uzun." }, { status: 413 });
    const input = await request.json() as { id?: number | string; phone?: string };
    const id = Number(input.id);
    const phone = String(input.phone ?? "").replace(/\s/g, "");
    if (!Number.isSafeInteger(id) || id < 1 || !/^0?5\d{9}$/.test(phone)) return Response.json({ error: "Başvuru numarası ve telefonunuzu kontrol edin." }, { status: 400 });
    const { getDb } = await import("@/db");
    const db = getDb();
    const [record] = await db.select({ id: valuationRequests.id, brand: valuationRequests.brand, model: valuationRequests.model, year: valuationRequests.year, status: valuationRequests.status, details: valuationRequests.details, createdAt: valuationRequests.createdAt }).from(valuationRequests).where(and(eq(valuationRequests.id, id), eq(valuationRequests.phone, phone))).limit(1);
    if (!record) return Response.json({ error: "Bu bilgilerle başvuru bulunamadı." }, { status: 404 });
    const [photoResult] = await db.select({ total: count() }).from(valuationPhotos).where(eq(valuationPhotos.requestId, id));
    const status = ["received", "reviewing", "offered", "appointment_requested", "appointment_confirmed"].includes(record.status) ? record.status : "received";
    const details = record.details as Record<string, unknown>;
    const offer = details.offer as { low?: number; high?: number; updatedAt?: string } | undefined;
    const [booking] = await db.select().from(appointmentBookings).where(eq(appointmentBookings.requestId, id)).orderBy(desc(appointmentBookings.id)).limit(1);
    const legacyAppointment = details.appointment as { requestedAt?: string; slot?: string; confirmedAt?: string } | undefined;
    const appointment = booking ? { id: booking.id, slot: booking.startAt, requestedAt: booking.createdAt, confirmedAt: booking.status === "confirmed" ? booking.updatedAt : undefined, status: booking.status, canModify: ["requested", "confirmed"].includes(booking.status) && new Date(booking.startAt).getTime() >= Date.now() + 24 * 3600_000 } : legacyAppointment;
    return Response.json({ id: record.id, vehicle: [record.year, record.brand, record.model].filter(Boolean).join(" "), status, photoCount: photoResult?.total ?? 0, createdAt: record.createdAt, offer: status !== "received" && status !== "reviewing" && offer ? offer : null, appointment: appointment ?? null });
  } catch {
    return Response.json({ error: "Başvuru şu an sorgulanamıyor. Lütfen daha sonra tekrar deneyin." }, { status: 503 });
  }
}
