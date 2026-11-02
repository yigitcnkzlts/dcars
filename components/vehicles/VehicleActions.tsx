"use client";

import { useEffect, useState } from "react";
import { Heart, Share2 } from "lucide-react";

export function VehicleActions({ vehicleId, title }: { vehicleId: string; title: string }) {
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => setSaved(localStorage.getItem(`dcars-saved-${vehicleId}`) === "true"), 0); return () => window.clearTimeout(timer); }, [vehicleId]);
  const toggleSaved = () => {
    const next = !saved;
    setSaved(next);
    localStorage.setItem(`dcars-saved-${vehicleId}`, String(next));
  };
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: `${title} | D CARS`, url });
      else { await navigator.clipboard.writeText(url); setNotice("Sayfa bağlantısı kopyalandı."); }
    } catch { setNotice("Bağlantı paylaşılamadı. Tarayıcınızın adres çubuğundan kopyalayabilirsiniz."); }
  };
  return <div className="vehicle-actions"><button type="button" onClick={toggleSaved} aria-pressed={saved}><Heart size={17} fill={saved ? "currentColor" : "none"} />{saved ? "Kaydedildi" : "Kaydet"}</button><button type="button" onClick={share}><Share2 size={17} />Paylaş</button>{notice && <small role="status">{notice}</small>}</div>;
}
