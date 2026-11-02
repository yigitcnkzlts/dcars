import { and, eq, lt } from "drizzle-orm";
import { consentRecords, valuationPhotos, valuationRequests } from "@/db/schema";

export async function applyValuationRetention(beforeIso: string, execute = false) {
  const { getDb } = await import("@/db"); const db = getDb();
  const records = await db.select({ id: valuationRequests.id }).from(valuationRequests).where(lt(valuationRequests.createdAt, beforeIso)).limit(500);
  if (!execute) return { execute: false, matched: records.length, ids: records.map((item) => item.id) };
  const { env } = await import("cloudflare:workers");
  for (const record of records) {
    const photos = await db.select().from(valuationPhotos).where(eq(valuationPhotos.requestId, record.id));
    for (const photo of photos) await env.BUCKET?.delete(photo.objectKey);
    await db.delete(valuationPhotos).where(eq(valuationPhotos.requestId, record.id));
    await db.update(valuationRequests).set({ firstName: "Anonim", lastName: "Kayıt", phone: "ANONYMIZED", email: "", details: { retention: { anonymizedAt: new Date().toISOString() } } }).where(and(eq(valuationRequests.id, record.id), lt(valuationRequests.createdAt, beforeIso)));
    await db.update(consentRecords).set({ subjectRef: "ANONYMIZED" }).where(eq(consentRecords.requestId, record.id));
  }
  return { execute: true, anonymized: records.length };
}
