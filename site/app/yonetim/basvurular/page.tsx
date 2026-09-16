"use client";

import { useState } from "react";

type RecordItem = { id: number; year?: number; brand: string; model: string; firstName: string; lastName: string; phone: string; status: string; details: { offer?: { low: number; high: number }; appointment?: { slot: string } }; createdAt: string };

export default function ValuationManagementPage() {
  const [token, setToken] = useState("");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [prices, setPrices] = useState<Record<number, { low: string; high: string }>>({});
  const load = async () => {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/valuation/manage", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const data = await response.json() as { records?: RecordItem[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Başvurular yüklenemedi.");
      setRecords(data.records ?? []);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Bağlantı kurulamadı."); }
    finally { setBusy(false); }
  };
  const update = async (id: number, status: string) => {
    setBusy(true); setError("");
    try {
      const offer = prices[id];
      const response = await fetch("/api/valuation/manage", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ id, status, ...(status === "offered" ? { offerLow: Number(offer?.low), offerHigh: Number(offer?.high) } : {}) }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Güncelleme kaydedilemedi.");
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Bağlantı kurulamadı."); }
    finally { setBusy(false); }
  };
  return <main className="management-page"><h1>Başvuru yönetimi</h1><p>Yalnızca yetkili ekip kullanımı. Yönetim anahtarı tarayıcıda saklanmaz.</p><form onSubmit={(event) => { event.preventDefault(); void load(); }}><label>Yönetim anahtarı<input type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" required /></label><button type="submit" disabled={busy || !token}>Başvuruları yükle</button></form>{error && <p role="alert" className="status-error">{error}</p>}<div className="management-list">{records.map((record) => <article key={record.id}><span>#{record.id} · {record.status} · {record.createdAt}</span><h2>{record.year} {record.brand} {record.model}</h2><p>{record.firstName} {record.lastName} · {record.phone}</p>{record.details.offer && <p>Teklif: {record.details.offer.low.toLocaleString("tr-TR")} – {record.details.offer.high.toLocaleString("tr-TR")} TL</p>}{record.details.appointment && <p>Randevu isteği: {new Date(record.details.appointment.slot).toLocaleString("tr-TR")}</p>}<div className="management-actions"><button type="button" disabled={busy} onClick={() => update(record.id, "reviewing")}>İnceleniyor</button><input aria-label={`#${record.id} alt fiyat`} inputMode="numeric" type="number" min="1" placeholder="Alt fiyat" value={prices[record.id]?.low ?? ""} onChange={(event) => setPrices((current) => ({ ...current, [record.id]: { low: event.target.value, high: current[record.id]?.high ?? "" } }))} /><input aria-label={`#${record.id} üst fiyat`} inputMode="numeric" type="number" min="1" placeholder="Üst fiyat" value={prices[record.id]?.high ?? ""} onChange={(event) => setPrices((current) => ({ ...current, [record.id]: { low: current[record.id]?.low ?? "", high: event.target.value } }))} /><button type="button" disabled={busy || !prices[record.id]?.low || !prices[record.id]?.high} onClick={() => update(record.id, "offered")}>Teklif aralığını yayınla</button>{record.status === "appointment_requested" && <button type="button" disabled={busy} onClick={() => update(record.id, "appointment_confirmed")}>Randevuyu onayla</button>}</div></article>)}</div></main>;
}
