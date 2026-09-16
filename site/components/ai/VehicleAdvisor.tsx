"use client";

import { Bot, CircleCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import type { VehicleContext } from "@/types/vehicle";
import { buildVehicleLabel } from "@/services/aiVehicleAdvisorService";
import { VehicleAdvisorInput } from "./VehicleAdvisorInput";
import { VehicleAdvisorMessage } from "./VehicleAdvisorMessage";
import { VehicleQuickQuestions } from "./VehicleQuickQuestions";

type Message = { role: "user" | "assistant"; content: string };

export function VehicleAdvisor({ vehicle }: { vehicle?: VehicleContext }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const label = buildVehicleLabel(vehicle);
  const ask = async (message: string) => {
    if (loading) return;
    setMessages((current) => [...current, { role: "user", content: message }]);
    setLoading(true);
    try {
      const response = await fetch("/api/ai/vehicle-advisor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, history: messages.slice(-8), vehicle }) });
      const data = await response.json() as { answer?: string; error?: string };
      if (!response.ok) throw new Error(data.error);
      setMessages((current) => [...current, { role: "assistant", content: data.answer ?? "Bu soruyu şu an yanıtlayamıyorum." }]);
    } catch (cause) { setMessages((current) => [...current, { role: "assistant", content: cause instanceof Error ? cause.message : "Danışman şu an bağlantı kuramıyor. Lütfen tekrar deneyin." }]); }
    finally { setLoading(false); }
  };
  return <section className="advisor-section" aria-labelledby="advisor-title"><div className="advisor-intro"><span className="section-index">03 — ARAÇ DANIŞMANI</span><h2 id="advisor-title">Araba hakkında<br /><em>aklındaki her şeyi sor.</em></h2><p>Aileye uygunluk, motor seçenekleri, tüketim, bakım ve ikinci el seçimi hakkında sohbet et.</p><div className="advisor-trust"><CircleCheck size={16} /> Kesin tüketim ve fiyat için model yılı ile motoru belirtin.</div></div><div className="advisor-panel"><div className="advisor-panel__top"><div className="advisor-badge"><Sparkles size={15} /> YAPAY ZEKÂ ARAÇ DANIŞMANI</div><span>Soru sor</span></div><div className="advisor-context"><Bot size={18} /><div><strong>{label} hakkında ne öğrenmek istersiniz?</strong><small>Örneğin aile kullanımı, tüketim veya motor seçeneklerini sorun.</small></div></div><div className="advisor-thread" aria-live="polite">{messages.length === 0 ? <div className="advisor-empty"><span>Q</span><p>Bir soru seçin veya kendi sorunuzu yazın.</p></div> : messages.map((message, index) => <VehicleAdvisorMessage key={`${message.role}-${index}`} {...message} />)}{loading && <div className="advisor-loading"><span /><span /><span /> Yanıt hazırlanıyor</div>}</div><VehicleAdvisorInput onSubmit={ask} disabled={loading} /><VehicleQuickQuestions onSelect={ask} disabled={loading} /></div></section>;
}
