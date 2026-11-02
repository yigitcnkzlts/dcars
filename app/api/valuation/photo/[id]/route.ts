import { eq } from "drizzle-orm";
import { valuationPhotos } from "@/db/schema";
import { audit, requireAdmin } from "@/lib/security";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await requireAdmin(request); if (!identity) return Response.json({ error: "Yetkisiz işlem." }, { status: 401 });
  const id = Number((await context.params).id); if (!Number.isSafeInteger(id) || id < 1) return Response.json({ error: "Fotoğraf bulunamadı." }, { status: 404 });
  const { getDb } = await import("@/db"); const [photo] = await getDb().select().from(valuationPhotos).where(eq(valuationPhotos.id, id)).limit(1); if (!photo) return Response.json({ error: "Fotoğraf bulunamadı." }, { status: 404 });
  const { env } = await import("cloudflare:workers"); const object = await env.BUCKET?.get(photo.objectKey); if (!object) return Response.json({ error: "Fotoğraf bulunamadı." }, { status: 404 });
  await audit(identity, "valuation.photo.view", "valuation_photo", String(id), { requestId: photo.requestId });
  return new Response(object.body, { headers: { "Content-Type": photo.contentType, "Content-Disposition": "inline", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
