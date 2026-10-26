import { and, desc, eq } from "drizzle-orm";
import { notificationDeliveries, notificationEvents } from "@/db/schema";
import { audit, requireAdmin, sameOrigin } from "@/lib/security";

export async function GET(request: Request) {
  const identity = await requireAdmin(request); if (!identity) return Response.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
  const { getDb } = await import("@/db"); const rows = await getDb().select({ id: notificationDeliveries.id, type: notificationEvents.type, referenceId: notificationEvents.referenceId, payload: notificationEvents.payload, readAt: notificationDeliveries.readAt, createdAt: notificationDeliveries.createdAt }).from(notificationDeliveries).innerJoin(notificationEvents, eq(notificationEvents.id, notificationDeliveries.eventId)).where(eq(notificationDeliveries.channel, "in_app")).orderBy(desc(notificationDeliveries.id)).limit(50);
  const failures = await getDb().select({ id: notificationDeliveries.id, channel: notificationDeliveries.channel, status: notificationDeliveries.status, error: notificationDeliveries.lastError, attempts: notificationDeliveries.attemptCount }).from(notificationDeliveries).where(eq(notificationDeliveries.status, "failed")).orderBy(desc(notificationDeliveries.id)).limit(20);
  return Response.json({ notifications: rows, failures, providers: { email: Boolean(process.env.EMAIL_PROVIDER_URL && process.env.EMAIL_PROVIDER_TOKEN), sms: Boolean(process.env.SMS_PROVIDER_URL && process.env.SMS_PROVIDER_TOKEN), whatsapp: Boolean(process.env.WHATSAPP_PROVIDER_URL && process.env.WHATSAPP_PROVIDER_TOKEN) } }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 }); const identity = await requireAdmin(request); if (!identity) return Response.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
  const input = await request.json().catch(() => ({})) as { id?: number; read?: boolean }; const id = Number(input.id); if (!Number.isSafeInteger(id) || id < 1) return Response.json({ error: "Geçersiz bildirim." }, { status: 400 });
  const { getDb } = await import("@/db"); await getDb().update(notificationDeliveries).set({ readAt: input.read === false ? null : new Date().toISOString(), updatedAt: new Date().toISOString() }).where(and(eq(notificationDeliveries.id, id), eq(notificationDeliveries.channel, "in_app"))); await audit(identity, "notification.read", "notification_delivery", String(id), { read: input.read !== false }); return Response.json({ id, read: input.read !== false });
}
