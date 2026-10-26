import { notificationDeliveries, notificationEvents } from "@/db/schema";

type EventInput = { type: string; referenceType: string; referenceId: string | number; dedupeKey: string; payload: Record<string, unknown>; channels: Array<{ channel: "email" | "sms" | "whatsapp" | "in_app"; destination?: string }> };

export async function enqueueNotification(input: EventInput) {
  const { getDb } = await import("@/db");
  const db = getDb();
  let event: { id: number } | undefined;
  try {
    [event] = await db.insert(notificationEvents).values({ type: input.type, referenceType: input.referenceType, referenceId: String(input.referenceId), payload: input.payload, dedupeKey: input.dedupeKey }).returning({ id: notificationEvents.id });
  } catch (error) {
    if (String(error).toLowerCase().includes("unique")) return { duplicate: true };
    throw error;
  }
  if (event) {
    const deliveries = await db.insert(notificationDeliveries).values(input.channels.map(({ channel, destination }) => ({ eventId: event!.id, channel, destination, status: channel === "in_app" ? "delivered" : "pending" }))).returning({ id: notificationDeliveries.id, channel: notificationDeliveries.channel });
    await Promise.allSettled(deliveries.filter((delivery) => delivery.channel !== "in_app").map((delivery) => dispatchDelivery(delivery.id)));
  }
  return { duplicate: false, eventId: event?.id };
}

export async function dispatchDelivery(deliveryId: number) {
  const { getDb } = await import("@/db");
  const db = getDb();
  const [delivery] = await db.select().from(notificationDeliveries).where((await import("drizzle-orm")).eq(notificationDeliveries.id, deliveryId)).limit(1);
  if (!delivery || delivery.status === "delivered") return;
  const [event] = await db.select().from(notificationEvents).where((await import("drizzle-orm")).eq(notificationEvents.id, delivery.eventId)).limit(1);
  const endpoint = delivery.channel === "email" ? process.env.EMAIL_PROVIDER_URL : delivery.channel === "sms" ? process.env.SMS_PROVIDER_URL : delivery.channel === "whatsapp" ? process.env.WHATSAPP_PROVIDER_URL : undefined;
  const token = delivery.channel === "email" ? process.env.EMAIL_PROVIDER_TOKEN : delivery.channel === "sms" ? process.env.SMS_PROVIDER_TOKEN : delivery.channel === "whatsapp" ? process.env.WHATSAPP_PROVIDER_TOKEN : undefined;
  if (!endpoint || !token) {
    await db.update(notificationDeliveries).set({ status: "not_configured", lastError: "Provider is not configured", updatedAt: new Date().toISOString() }).where((await import("drizzle-orm")).eq(notificationDeliveries.id, deliveryId));
    return;
  }
  try {
    const response = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ deliveryId, destination: delivery.destination, type: event?.type, ...event?.payload }) });
    if (!response.ok) throw new Error(`Provider HTTP ${response.status}`);
    await db.update(notificationDeliveries).set({ status: "delivered", attemptCount: delivery.attemptCount + 1, updatedAt: new Date().toISOString() }).where((await import("drizzle-orm")).eq(notificationDeliveries.id, deliveryId));
  } catch (error) {
    const attempts = delivery.attemptCount + 1;
    await db.update(notificationDeliveries).set({ status: attempts >= 5 ? "failed" : "retry", attemptCount: attempts, nextAttemptAt: attempts >= 5 ? null : new Date(Date.now() + Math.min(3600, 30 * 2 ** attempts) * 1000).toISOString(), lastError: error instanceof Error ? error.message.slice(0, 240) : "Provider error", updatedAt: new Date().toISOString() }).where((await import("drizzle-orm")).eq(notificationDeliveries.id, deliveryId));
  }
}

export const notificationText = {
  received: (id: number) => `D CARS başvurunuz alınmıştır. Başvuru numaranız: ${id}. Sürecinizi dcars.tr/basvuru-takip adresinden takip edebilirsiniz.`,
  reviewing: (id: number) => `D CARS #${id} numaralı başvurunuz incelenmeye alınmıştır.`,
  offered: (id: number) => `D CARS #${id} numaralı başvurunuz için teklif hazırlandı. Güvenli takip sayfasından görüntüleyebilirsiniz.`,
  appointment: (id: number, slot: string) => `D CARS #${id} başvurunuz için ${slot} randevu talebiniz alınmıştır.`,
  confirmed: (id: number, slot: string) => `D CARS #${id} başvurunuzun ${slot} randevusu onaylanmıştır.`,
};
