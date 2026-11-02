import { eq } from "drizzle-orm";
import { legalDocuments } from "@/db/schema";
import { audit, requireAdmin, sameOrigin } from "@/lib/security";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const slug = (await context.params).slug; const { getDb } = await import("@/db"); const [document] = await getDb().select().from(legalDocuments).where(eq(legalDocuments.slug, slug)).limit(1);
  if (!document || !document.published) return Response.json({ error: "Metin bulunamadı." }, { status: 404 }); return Response.json(document, { headers: { "Cache-Control": "no-store" } });
}
export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 }); const identity = await requireAdmin(request, ["admin"]); if (!identity) return Response.json({ error: "Yönetici yetkisi gerekli." }, { status: 403 });
  const slug = (await context.params).slug; if (!/^[a-z0-9-]{3,80}$/.test(slug)) return Response.json({ error: "Geçersiz belge." }, { status: 400 }); const input = await request.json().catch(() => ({})) as { title?: string; version?: string; content?: string; published?: boolean; validFrom?: string };
  if (!input.title?.trim() || !input.version?.trim() || !input.content?.trim() || input.content.length > 50_000) return Response.json({ error: "Başlık, sürüm ve içerik gerekli." }, { status: 400 });
  const { getDb } = await import("@/db"); const db = getDb(); const [current] = await db.select().from(legalDocuments).where(eq(legalDocuments.slug, slug)).limit(1); const values = { title: input.title.trim(), version: input.version.trim(), content: input.content.trim(), published: input.published === true, validFrom: input.validFrom, updatedAt: new Date().toISOString() };
  if (current) await db.update(legalDocuments).set(values).where(eq(legalDocuments.id, current.id)); else await db.insert(legalDocuments).values({ slug, ...values }); await audit(identity, "legal.update", "legal_document", slug, { version: values.version, published: values.published }); return Response.json({ slug, ...values });
}
