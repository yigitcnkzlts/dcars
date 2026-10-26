import { eq } from "drizzle-orm";
import { adminSessions, adminUsers } from "@/db/schema";
import { rateLimit, rateLimited, sameOrigin, verifyPassword } from "@/lib/security";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  const limited = await rateLimit(request, "admin-login", 8, 900);
  if (!limited.allowed) return rateLimited(limited.retryAfter);
  let input: { email?: string; password?: string };
  try { input = await request.json() as typeof input; } catch { return Response.json({ error: "Geçersiz giriş." }, { status: 400 }); }
  const email = input.email?.trim().toLowerCase() ?? "";
  const password = input.password ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 10 || password.length > 200) return Response.json({ error: "E-posta veya parola hatalı." }, { status: 401 });
  const { getDb } = await import("@/db");
  const db = getDb();
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  const userId: number | null = user?.id ?? null;
  let role = user?.role === "admin" ? "admin" : "staff";
  let valid = Boolean(user?.active && await verifyPassword(password, user.passwordHash));
  // One-time bootstrap path; remove these variables after the first database user is provisioned.
  if (!user && process.env.ADMIN_BOOTSTRAP_EMAIL && process.env.ADMIN_BOOTSTRAP_PASSWORD) {
    valid = email === process.env.ADMIN_BOOTSTRAP_EMAIL.toLowerCase() && password === process.env.ADMIN_BOOTSTRAP_PASSWORD;
    role = "admin";
  }
  if (!valid) return Response.json({ error: "E-posta veya parola hatalı." }, { status: 401 });
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 8 * 3600_000).toISOString();
  await db.insert(adminSessions).values({ id, adminUserId: userId, role, expiresAt });
  if (userId) await db.update(adminUsers).set({ lastLoginAt: new Date().toISOString() }).where(eq(adminUsers.id, userId));
  return Response.json({ role }, { headers: { "Set-Cookie": `dcars_admin_session=${encodeURIComponent(id)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`, "Cache-Control": "no-store" } });
}
