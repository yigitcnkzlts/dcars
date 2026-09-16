"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

type Result = { id: number; vehicle: string; status: string; photoCount: number; createdAt: string };

export default function ApplicationStatusPage() {
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
  return <><Navbar /><main className="content-page"><section className="content-hero"><span>BAŞVURU KONTROLÜ</span><h1>Başvurunu doğrula.</h1><p>Başvuru numaran ve formda kullandığın telefonla kaydını kontrol et. Teklif hazır olduğunda ekibimiz seninle doğrudan iletişime geçer.</p></section><section className="status-panel"><form onSubmit={lookup}><label>Başvuru numarası<input inputMode="numeric" type="number" min="1" value={id} onChange={(event) => setId(event.target.value)} placeholder="Örn. 123" required /></label><label>Başvurudaki telefon<input inputMode="tel" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="05XX XXX XX XX" required /></label><button className="button button--primary" disabled={loading} type="submit"><Search size={16} />{loading ? "Sorgulanıyor..." : "Başvuruyu bul"}</button></form>{error && <p className="status-error" role="alert">{error}</p>}{result && <div className="status-result" role="status"><span>#{result.id} · {result.status}</span><h2>{result.vehicle}</h2><p>Başvuruna {result.photoCount} fotoğraf eklenmiş. Bu ekran kaydın alındığını doğrular; teklif tutarı veya randevu tarihi göstermez.</p><a href={emailHref}>Eksik bilgi ilet <ArrowUpRight size={16} /></a></div>}<p>Numaranı kaybettiysen <Link href="/iletisim">bize ulaş</Link>.</p></section></main></>;
}
