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
  const [saleTiming, setSaleTiming] = useState("");
  const [accidentStatus, setAccidentStatus] = useState("");
  const [damageArea, setDamageArea] = useState("");
  const label = buildVehicleLabel(vehicle);
  const ask = async (message: string) => {
    if (loading) return;
    setMessages((current) => [...current, { role: "user", content: message }]);
    setLoading(true);
    try {
      const response = await fetch("/api/ai/vehicle-advisor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, vehicle, profile: { saleTiming, accidentStatus, damageArea } }) });
      const data = await response.json() as { answer?: string; error?: string };
      if (!response.ok) throw new Error(data.error);
      setMessages((current) => [...current, { role: "assistant", content: data.answer ?? "Bu soruyu şu an yanıtlayamıyorum." }]);
    } catch { setMessages((current) => [...current, { role: "assistant", content: "Danışman şu an bağlantı kuramıyor. Lütfen kısa süre sonra tekrar deneyin." }]); }
    finally { setLoading(false); }
  };
  return <section className="advisor-section" aria-labelledby="advisor-title"><div className="advisor-intro"><span className="section-index">03 — SATIŞ REHBERİ</span><h2 id="advisor-title">Satış sorularını<br /><em>hemen sor.</em></h2><p>Hasarlı araç, fotoğraf, teklif ve devir hakkında kısa rehber yanıtları al. Yanıtlar başvurunun veya uzman incelemesinin yerini almaz.</p><div className="advisor-trust"><CircleCheck size={16} /> Bu danışman canlı fiyat hesaplamaz; teklif için başvuru gerekir.</div></div><div className="advisor-panel"><div className="advisor-panel__top"><div className="advisor-badge"><Sparkles size={15} /> DİJİTAL SATIŞ DANIŞMANI</div><span>Hazır</span></div><div className="advisor-context"><Bot size={18} /><div><strong>{label} hakkında ne öğrenmek istersiniz?</strong><small>Durumunuza uygun bir yanıt için seçenekleri işaretleyin.</small></div></div><div className="advisor-profile"><label>Satış zamanı<select value={saleTiming} onChange={(event) => setSaleTiming(event.target.value)}><option value="">Seçin</option><option value="Hemen">Hemen</option><option value="1 ay içinde">1 ay içinde</option><option value="Karar vermedim">Karar vermedim</option></select></label><label>Kaza veya hasar<select value={accidentStatus} onChange={(event) => setAccidentStatus(event.target.value)}><option value="">Seçin</option><option value="Var">Var</option><option value="Yok">Yok</option><option value="Bilmiyorum">Bilmiyorum</option></select></label><label>Hasarlı bölge<select value={damageArea} onChange={(event) => setDamageArea(event.target.value)}><option value="">Seçin</option><option value="Ön">Ön</option><option value="Arka">Arka</option><option value="Sol yan">Sol yan</option><option value="Sağ yan">Sağ yan</option><option value="Diğer">Diğer</option></select></label><button type="button" onClick={() => ask("Aracımı satmak için nasıl hazırlanmalıyım?")} disabled={loading}>Bana yol göster</button></div><div className="advisor-thread" aria-live="polite">{messages.length === 0 ? <div className="advisor-empty"><span>Q</span><p>Bir soru seçin veya kendi sorunuzu yazın.</p></div> : messages.map((message, index) => <VehicleAdvisorMessage key={`${message.role}-${index}`} {...message} />)}{loading && <div className="advisor-loading"><span /><span /><span /> Yanıt hazırlanıyor</div>}</div><VehicleAdvisorInput onSubmit={ask} disabled={loading} /><VehicleQuickQuestions onSelect={ask} disabled={loading} /></div></section>;
}
