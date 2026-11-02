import { adminUsers } from "@/db/schema";
import { audit, hashPassword, requireAdmin, sameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 }); const identity = await requireAdmin(request, ["admin"]); if (!identity) return Response.json({ error: "Yönetici yetkisi gerekli." }, { status: 403 });
  const input = await request.json().catch(() => ({})) as { email?: string; password?: string; role?: string }; const email = input.email?.trim().toLowerCase() ?? "", password = input.password ?? "", role = input.role;
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 12 || password.length > 200 || !["admin", "staff"].includes(role ?? "")) return Response.json({ error: "Geçerli e-posta, en az 12 karakter parola ve rol gerekli." }, { status: 400 });
  try { const { getDb } = await import("@/db"); const [user] = await getDb().insert(adminUsers).values({ email, passwordHash: await hashPassword(password), role: role! }).returning({ id: adminUsers.id, email: adminUsers.email, role: adminUsers.role }); await audit(identity, "admin_user.create", "admin_user", String(user.id), { email, role }); return Response.json(user, { status: 201 }); } catch { return Response.json({ error: "Kullanıcı oluşturulamadı; e-posta zaten kullanılıyor olabilir." }, { status: 409 }); }
}
