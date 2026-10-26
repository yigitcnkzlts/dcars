import { and, eq, gt } from "drizzle-orm";
import { adminSessions, auditLogs } from "@/db/schema";

const encoder = new TextEncoder();

export function clientKey(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0];
  return (forwarded?.trim() || "unknown").slice(0, 80);
}

export async function rateLimit(request: Request, scope: string, limit: number, windowSeconds: number) {
  try {
    const { env } = await import("cloudflare:workers");
    if (!env.DB) throw new Error("rate-limit-store-unavailable");
    const now = Math.floor(Date.now() / 1000);
    const start = now - (now % windowSeconds);
    const key = `${scope}:${clientKey(request)}:${start}`;
    await env.DB.prepare("INSERT INTO rate_limit_buckets (`key`, window_start, count) VALUES (?, ?, 1) ON CONFLICT(`key`) DO UPDATE SET count = count + 1").bind(key, start).run();
    const row = await env.DB.prepare("SELECT count FROM rate_limit_buckets WHERE `key` = ?").bind(key).first<{ count: number }>();
    const remaining = Math.max(0, limit - Number(row?.count ?? limit));
    return { allowed: Number(row?.count ?? limit) <= limit, remaining, retryAfter: start + windowSeconds - now };
  } catch {
    // Never make the whole service unavailable if the limiter store is briefly unavailable.
    return { allowed: true, remaining: 0, retryAfter: windowSeconds };
  }
}

export function rateLimited(retryAfter: number) {
  return Response.json({ error: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin." }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

export function readCookie(request: Request, name: string) {
  const match = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export type AdminIdentity = { id: string; role: "admin" | "staff" };

export async function requireAdmin(request: Request, roles: AdminIdentity["role"][] = ["admin", "staff"]): Promise<AdminIdentity | null> {
  const sessionId = readCookie(request, "dcars_admin_session");
  if (!sessionId) return null;
  const { getDb } = await import("@/db");
  const [session] = await getDb().select().from(adminSessions).where(and(eq(adminSessions.id, sessionId), gt(adminSessions.expiresAt, new Date().toISOString()))).limit(1);
  if (!session || !roles.includes(session.role as AdminIdentity["role"])) return null;
  return { id: String(session.adminUserId ?? "bootstrap"), role: session.role as AdminIdentity["role"] };
}

export async function audit(identity: AdminIdentity, action: string, targetType: string, targetId?: string, metadata: Record<string, unknown> = {}) {
  const { getDb } = await import("@/db");
  await getDb().insert(auditLogs).values({ actorId: identity.id, actorRole: identity.role, action, targetType, targetId, metadata });
}

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, iterationsRaw, saltHex, expected] = encoded.split("$");
  if (algorithm !== "pbkdf2-sha256" || !iterationsRaw || !saltHex || !expected) return false;
  const iterations = Number(iterationsRaw);
  if (!Number.isSafeInteger(iterations) || iterations < 100_000) return false;
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)?.map((part) => parseInt(part, 16)) ?? []);
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, material, 256);
  const actual = Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, "0")).join("");
  if (actual.length !== expected.length) return false;
  let diff = 0; for (let index = 0; index < actual.length; index++) diff |= actual.charCodeAt(index) ^ expected.charCodeAt(index);
  return diff === 0;
}

export async function hashPassword(password: string) {
  const iterations = 210_000, salt = crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, material, 256);
  const hex = (bytes: Uint8Array) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `pbkdf2-sha256$${iterations}$${hex(salt)}$${hex(new Uint8Array(bits))}`;
}
