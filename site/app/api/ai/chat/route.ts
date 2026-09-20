import OpenAI from "openai";
import type { AdvisorRequest } from "@/types/ai";

const MODEL = "gpt-5.4-mini";
const SYSTEM_PROMPT = `Sen D CARS'ın Türkçe araç danışmanısın. Marka, model, motor, paket, donanım, yakıt tüketimi, performans, konfor, bagaj, şehir içi kullanım, uzun yol ve aile kullanımı hakkında kısa ve somut cevaplar ver. İki veya daha fazla araç sorulursa ihtiyaçlara göre karşılaştır. Model yılı ve motor seçeneği sonucu değiştirecekse bunu belirt ve gerektiğinde kullanıcıya sor. Güncel fiyat, paket, teknik değer, güvenlik puanı veya kronik arıza bilgisi doğrulanmamışsa rakam ya da kesin hüküm uydurma; güncel fiyat ve paket bilgisinin doğrulanması gerektiğini söyle. Kesin arıza teşhisi veya satış teklifi verme.`;

function safeLog(error: unknown, key: string) {
  const scrub = (value: string) => value.replaceAll(key, "[REDACTED]").replace(/sk-[A-Za-z0-9_-]+/g, "[REDACTED]");
  if (error instanceof OpenAI.APIError) {
    console.error("D CARS AI request failed", { status: error.status, code: error.code, type: error.type, requestId: error.requestID, message: scrub(error.message) });
  } else {
    console.error("D CARS AI request failed", { name: error instanceof Error ? error.name : "UnknownError", message: scrub(error instanceof Error ? error.message : String(error)) });
  }
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 16_384) return Response.json({ error: "İstek çok uzun." }, { status: 413 });

  let payload: Partial<AdvisorRequest>;
  try { payload = await request.json() as Partial<AdvisorRequest>; }
  catch { return Response.json({ error: "Geçerli bir soru girin." }, { status: 400 }); }

  const message = typeof payload?.message === "string" ? payload.message.trim() : "";
  if (!message || message.length > 600) return Response.json({ error: "Geçerli bir soru girin." }, { status: 400 });

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("OPENAI_API_KEY is not configured");
    return Response.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }

  const history = (Array.isArray(payload.history) ? payload.history : [])
    .filter((item): item is { role: "user" | "assistant"; content: string } => Boolean(item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string" && item.content.length <= 1000))
    .slice(-8);
  const vehicle = payload.vehicle;
  const context = [vehicle?.year, vehicle?.brand, vehicle?.model, vehicle?.engine].filter((part) => typeof part === "string" || typeof part === "number").map(String).join(" ").slice(0, 240);

  try {
    const openai = new OpenAI({ apiKey: key, timeout: 20_000, maxRetries: 0 });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\nFormda seçilen araç (kullanıcı beyanı): ${context || "Seçilmedi"}.` },
        ...history,
        { role: "user", content: message },
      ],
      max_completion_tokens: 750,
    });
    const answer = completion.choices[0]?.message.content?.trim();
    if (!answer) {
      console.error("D CARS AI request returned no text", { model: MODEL, requestId: completion.id });
      return Response.json({ error: "Danışmandan yanıt alınamadı. Lütfen tekrar deneyin." }, { status: 502 });
    }
    return Response.json({ answer });
  } catch (error) {
    safeLog(error, key);
    return Response.json({ error: "Yapay zekâ servisine şu an ulaşılamıyor. Lütfen tekrar deneyin." }, { status: 502 });
  }
}
