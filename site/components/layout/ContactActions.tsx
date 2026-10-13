import { MessageCircle, Phone } from "lucide-react";

const phoneDisplay = process.env.NEXT_PUBLIC_PHONE_DISPLAY;
const phoneE164 = process.env.NEXT_PUBLIC_PHONE_E164?.replace(/[^+\d]/g, "");
const whatsappE164 = process.env.NEXT_PUBLIC_WHATSAPP_E164?.replace(/\D/g, "");
const whatsappMessage = encodeURIComponent("Merhaba D CARS, aracım için teklif almak istiyorum.");

export function ContactActions({ compact = false }: { compact?: boolean }) {
  if (!phoneE164 && !whatsappE164) return null;
  return <div className={compact ? "contact-actions contact-actions--compact" : "contact-actions"} aria-label="Hızlı iletişim">
    {phoneE164 ? <a href={`tel:${phoneE164}`}><Phone size={compact ? 14 : 18} /><span>{compact ? phoneDisplay || "Hemen ara" : `Ara: ${phoneDisplay || phoneE164}`}</span></a> : null}
    {whatsappE164 ? <a href={`https://wa.me/${whatsappE164}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={compact ? 14 : 18} /><span>WhatsApp</span></a> : null}
  </div>;
}
