"use client";

import { useState } from "react";
import Link from "@/components/layout/NativeLink";
import { ArrowUpRight, Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

type Result = { id: number; vehicle: string; status: string; photoCount: number; createdAt: string; offer?: { low: number; high: number; updatedAt: string } | null; appointment?: { slot: string; requestedAt?: string; confirmedAt?: string } | null };
const stages = [{ id: "received", label: "Başvuru alındı" }, { id: "reviewing", label: "İnceleniyor" }, { id: "offered", label: "Teklif hazır" }, { id: "appointment_requested", label: "Randevu talep edildi" }, { id: "appointment_confirmed", label: "Randevu onaylandı" }];

export default function ApplicationStatusPage() {
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slot, setSlot] = useState("");
  const [booking, setBooking] = useState(false);
  const lookup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/valuation/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, phone }) });
      const data = await response.json() as Result & { error?: string };
      if (!response.ok) throw new Error(data.error || "Başvuru sorgulanamadı.");
      setResult(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Bağlantı kurulamadı."); }
    finally { setLoading(false); }
  };
  const emailHref = result ? `mailto:info@dcars.tr?subject=${encodeURIComponent(`Başvuru #${result.id} için ek bilgi`)}&body=${encodeURIComponent(`Merhaba, #${result.id} numaralı başvuruma ek bilgi paylaşmak istiyorum.`)}` : "mailto:info@dcars.tr";
  const requestAppointment = async () => {
    if (!result || !slot) return;
    setBooking(true); setError("");
    try {
      const response = await fetch("/api/valuation/appointment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: result.id, phone, slot: new Date(slot).toISOString() }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Randevu talebi kaydedilemedi.");
      setResult({ ...result, status: "appointment_requested", appointment: { slot: new Date(slot).toISOString(), requestedAt: new Date().toISOString() } });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Bağlantı kurulamadı."); }
    finally { setBooking(false); }
  };
  return <><Navbar /><main className="content-page"><section className="content-hero"><span>BAŞVURU KONTROLÜ</span><h1>Başvurunu doğrula.</h1><p>Başvuru numaran ve formda kullandığın telefonla süreci takip et. Teklif ve randevu bilgileri hazır oldukça burada görünür.</p></section><section className="status-panel"><form onSubmit={lookup}><label>Başvuru numarası<input inputMode="numeric" type="number" min="1" value={id} onChange={(event) => setId(event.target.value)} placeholder="Örn. 123" required /></label><label>Başvurudaki telefon<input inputMode="tel" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="05XX XXX XX XX" required /></label><button className="button button--primary" disabled={loading} type="submit"><Search size={16} />{loading ? "Sorgulanıyor..." : "Başvuruyu bul"}</button></form>{error && <p className="status-error" role="alert">{error}</p>}{result && <div className="status-result" role="status"><span>#{result.id} · {stages.find((item) => item.id === result.status)?.label}</span><h2>{result.vehicle}</h2><ol className="status-timeline">{stages.map((stage, index) => <li key={stage.id} data-active={index <= stages.findIndex((item) => item.id === result.status)}><b>{index + 1}</b>{stage.label}</li>)}</ol><p>Başvuruna {result.photoCount} fotoğraf eklenmiş.</p>{result.offer && <div className="status-offer"><strong>İnceleme sonrası teklif aralığı</strong><p>{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(result.offer.low)} – {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(result.offer.high)}</p><small>Kesin tutar araç durumu doğrulanınca netleşir.</small></div>}{result.status === "offered" && <div className="status-booking"><strong>Görüşme zamanı iste</strong><p>Size uygun bir gün ve saat seçin. Ekibimiz onaylayınca randevu kesinleşir.</p><input aria-label="Tercih edilen randevu zamanı" type="datetime-local" value={slot} onChange={(event) => setSlot(event.target.value)} /><button type="button" className="button button--primary" onClick={requestAppointment} disabled={!slot || booking}>{booking ? "Gönderiliyor..." : "Randevu talebi gönder"}</button></div>}{result.appointment && <p>Seçilen zaman: <strong>{new Date(result.appointment.slot).toLocaleString("tr-TR")}</strong> · {result.appointment.confirmedAt ? "Onaylandı" : "Onay bekliyor"}</p>}<a href={emailHref}>Eksik bilgi ilet <ArrowUpRight size={16} /></a></div>}<p>Numaranı kaybettiysen <Link href="/iletisim">bize ulaş</Link>.</p></section></main></>;
}
