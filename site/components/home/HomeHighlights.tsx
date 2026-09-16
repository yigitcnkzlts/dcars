import { ArrowUpRight, BadgeCheck, ScanSearch, ShieldCheck } from "lucide-react";
import Link from "@/components/layout/NativeLink";

const highlights = [
  [ScanSearch, "Kısa başvuru", "Araç bilgilerini birkaç adımda paylaşın. Bildiğiniz hasarları ve beklediğiniz fiyatı da ekleyebilirsiniz."],
  [BadgeCheck, "Fotoğraflarla açık bilgi", "Kazalı veya boyalı bölgeleri fotoğraflarla gösterebilirsiniz. Böylece ilk görüşme daha somut bilgilerle başlar."],
  [ShieldCheck, "Karar sizde", "İncelemeden sonra iletilen teklifi değerlendirirsiniz. Uygun bulursanız ödeme ve devir adımlarına geçilir."],
] as const;

export function HomeHighlights() {
  return <section className="home-highlights" aria-labelledby="highlights-title"><div className="home-highlights__heading"><span>04 — SATIŞ DENEYİMİ</span><h2 id="highlights-title">Aracını anlat.<br /><em>Kararını rahat ver.</em></h2><Link href="/aracimi-sat">Satış adımlarını incele <ArrowUpRight size={17} /></Link></div><div className="home-highlights__grid">{highlights.map(([Icon, title, text], index) => <article key={title}><div><small>0{index + 1}</small><Icon size={24} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}
