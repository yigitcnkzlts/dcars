import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "@/components/layout/NativeLink";
import { Navbar } from "./Navbar";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  items: { title: string; text: string }[];
  cta?: { label: string; href: string };
};

export function ContentPage({ eyebrow, title, intro, items, cta = { label: "Randevu oluştur", href: "/iletisim" } }: ContentPageProps) {
  return <><Navbar /><main className="content-page"><section className="content-hero"><span>{eyebrow}</span><h1>{title}</h1><p>{intro}</p><Link className="button button--primary" href={cta.href}>{cta.label}<ArrowUpRight size={17} /></Link></section><section className="content-grid" aria-label={`${title} detayları`}>{items.map((item, index) => <article className="content-card" key={item.title}><div><small>0{index + 1}</small><CheckCircle2 size={19} /></div><h2>{item.title}</h2><p>{item.text}</p></article>)}</section><section className="content-contact"><div><span>D CARS CONCIERGE</span><h2>Otomobil deneyiminizi<br />birlikte tasarlayalım.</h2></div><Link className="button button--ghost" href="/iletisim">Bize ulaşın <ArrowUpRight size={17} /></Link></section></main></>;
}
