import { otpChallenges } from "@/db/schema";
import { rateLimit, rateLimited, sameOrigin, sha256 } from "@/lib/security";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  const limited = await rateLimit(request, "otp-send", 3, 900);
  if (!limited.allowed) return rateLimited(limited.retryAfter);
  const input = await request.json().catch(() => ({})) as { phone?: string; purpose?: string };
  const phone = String(input.phone ?? "").replace(/\s/g, "");
  const purpose = String(input.purpose ?? "");
  if (!/^0?5\d{9}$/.test(phone) || !["application_lookup", "appointment_change"].includes(purpose)) return Response.json({ error: "Doğrulama bilgileri geçersiz." }, { status: 400 });
  if (!process.env.SMS_PROVIDER_URL || !process.env.SMS_PROVIDER_TOKEN || !process.env.OTP_HASH_SECRET) return Response.json({ error: "SMS doğrulama servisi henüz yapılandırılmadı." }, { status: 503 });
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
  const id = crypto.randomUUID();
  const codeHash = await sha256(`${id}:${code}:${process.env.OTP_HASH_SECRET}`);
  await (await import("@/db")).getDb().insert(otpChallenges).values({ id, phoneHash: await sha256(`${phone}:${process.env.OTP_HASH_SECRET}`), codeHash, purpose, expiresAt: new Date(Date.now() + 5 * 60_000).toISOString() });
  const response = await fetch(process.env.SMS_PROVIDER_URL, { method: "POST", headers: { Authorization: `Bearer ${process.env.SMS_PROVIDER_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ to: phone, message: `D CARS doğrulama kodunuz: ${code}. Kod 5 dakika geçerlidir.` }) });
  if (!response.ok) return Response.json({ error: "Doğrulama kodu gönderilemedi." }, { status: 502 });
  return Response.json({ challengeId: id, expiresIn: 300 }, { status: 201 });
}
