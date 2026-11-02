import { and, eq, gt, isNull } from "drizzle-orm";
import { otpChallenges } from "@/db/schema";
import { rateLimit, rateLimited, sameOrigin, sha256 } from "@/lib/security";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  const limited = await rateLimit(request, "otp-verify", 8, 900);
  if (!limited.allowed) return rateLimited(limited.retryAfter);
  const input = await request.json().catch(() => ({})) as { challengeId?: string; code?: string };
  if (!input.challengeId || !/^\d{6}$/.test(input.code ?? "") || !process.env.OTP_HASH_SECRET) return Response.json({ error: "Kod geçersiz." }, { status: 400 });
  const { getDb } = await import("@/db"); const db = getDb();
  const [challenge] = await db.select().from(otpChallenges).where(and(eq(otpChallenges.id, input.challengeId), gt(otpChallenges.expiresAt, new Date().toISOString()), isNull(otpChallenges.consumedAt))).limit(1);
  if (!challenge || challenge.attemptCount >= 5) return Response.json({ error: "Kod geçersiz veya süresi dolmuş." }, { status: 400 });
  const valid = await sha256(`${challenge.id}:${input.code}:${process.env.OTP_HASH_SECRET}`) === challenge.codeHash;
  if (!valid) { await db.update(otpChallenges).set({ attemptCount: challenge.attemptCount + 1 }).where(eq(otpChallenges.id, challenge.id)); return Response.json({ error: "Kod geçersiz." }, { status: 400 }); }
  await db.update(otpChallenges).set({ consumedAt: new Date().toISOString() }).where(eq(otpChallenges.id, challenge.id));
  return Response.json({ verified: true, purpose: challenge.purpose });
}
