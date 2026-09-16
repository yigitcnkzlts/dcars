import type { AdvisorRequest } from "@/types/ai";

const systemPrompt = `Sen D Cars sitesinin Türkçe otomobil danışmanısın. Kullanıcıyla doğal bir sohbet yürüt. Araç seçimi, aileye uygunluk, iç hacim, bagaj, motor seçenekleri, yakıt tüketimi, bakım ve ikinci el konularında yardımcı ol. Kullanıcının aile büyüklüğü, bütçesi, yıllık kilometresi ve baktığı model yılı/motoru gibi bilgileri gerektiğinde kısa sorularla netleştir. Sayısal tüketim, güç, kronik sorun, güvenlik puanı veya fiyat için doğrulanmış güncel veri erişimin yok; kesin rakam uydurma. Motor ve nesle göre değiştiğini belirt, gerçek kullanım tüketiminin değişebileceğini söyle. Kesin arıza teşhisi yapma. Satış teklifi veya canlı piyasa fiyatı uydurma. Yanıtları kısa, somut ve dostça tut; satış baskısı yapma.`;

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Partial<AdvisorRequest>;
    const message = payload.message?.trim();
    if (!message || message.length > 600) return Response.json({ error: "Geçerli bir soru girin." }, { status: 400 });
    const history = (payload.history ?? []).filter((item) => (item.role === "user" || item.role === "assistant") && typeof item.content === "string" && item.content.length <= 1000).slice(-8);
    const key = process.env.AI_GATEWAY_API_KEY;
    if (!key) return Response.json({ error: "Yapay zekâ danışmanı henüz yapılandırılmadı." }, { status: 503 });
    const context = [payload.vehicle?.year, payload.vehicle?.brand, payload.vehicle?.model, payload.vehicle?.engine].filter(Boolean).join(" ");
    const response = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.AI_GATEWAY_MODEL || "openai/gpt-5.4-mini", messages: [{ role: "system", content: `${systemPrompt}\nFormda seçilen araç: ${context || "Seçilmedi"}. Bu alanı kullanıcı beyanı olarak değerlendir.` }, ...history, { role: "user", content: message }], max_tokens: 550 }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return Response.json({ error: "Yapay zekâ servisine ulaşılamıyor. Lütfen tekrar deneyin." }, { status: 502 });
    const result = await response.json() as { choices?: { message?: { content?: string } }[] };
    const answer = result.choices?.[0]?.message?.content?.trim();
    if (!answer) return Response.json({ error: "Yanıt alınamadı. Lütfen tekrar deneyin." }, { status: 502 });
    return Response.json({ answer });
  } catch {
    return Response.json({ error: "Danışman şu an kullanılamıyor." }, { status: 500 });
  }
}
