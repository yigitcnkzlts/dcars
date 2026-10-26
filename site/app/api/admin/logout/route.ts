import { eq } from "drizzle-orm";
import { adminSessions } from "@/db/schema";
import { readCookie, sameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  const id = readCookie(request, "dcars_admin_session");
  if (id) { const { getDb } = await import("@/db"); await getDb().delete(adminSessions).where(eq(adminSessions.id, id)); }
  return Response.json({ ok: true }, { headers: { "Set-Cookie": "dcars_admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0" } });
}
