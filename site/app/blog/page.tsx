import type { Metadata } from "next";
import Link from "@/components/layout/NativeLink";
import { ArrowUpRight, Clock3, Newspaper } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { getAutomotiveNews } from "@/services/automotiveNewsService";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Araç Piyasası ve Otomotiv Haberleri | D CARS",
  description: "İkinci el araç piyasası ve otomotiv sektöründen güncel haber başlıkları ile araç satışı rehberi.",
};

const guides = [
  { title: "İkinci el araç değerini neler belirler?", text: "Yıl, kilometre, donanım, bakım ve hasar geçmişi birlikte değerlendirilir. Benzer ilanların fiyatı tek başına satış fiyatı değildir." },
  { title: "Ekspertiz raporunda nelere bakılır?", text: "Kaporta ölçümleri, motor, şanzıman, fren, süspansiyon ve elektronik kontrollerin raporda açıkça yer almasına dikkat edin." },
  { title: "Satışa başlamadan ne hazırlamalı?", text: "Ruhsat, bakım kayıtları, yedek anahtar ve varsa hasar fotoğraflarını hazırlamak başvurunun incelenmesini kolaylaştırır." },
];

export default async function BlogPage() {
  const articles = await getAutomotiveNews();
  const latestDate = articles.length ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeZone: "Europe/Istanbul" }).format(new Date(articles[0].publishedAt)) : null;
  return <><Navbar /><main className="content-page news-page">
    <header className="news-header"><div><span className="vehicle-eyebrow">D CARS BLOG</span><h1>Araç piyasasından haberler</h1><p>İkinci el pazarı ve otomotiv sektöründeki gelişmeleri kaynaklarından takip edin. Araç satışı için pratik notlar da aşağıda.</p></div><div className="news-header__meta"><Newspaper size={23} /><strong>Güncel haber akışı</strong><span>Başlıklar dış haber kaynaklarından otomatik alınır; içerikler ilgili yayıncıya aittir.</span></div></header>
    <section className="news-section" aria-labelledby="news-title"><div className="news-section__heading"><div><span className="vehicle-eyebrow">PİYASA & SEKTÖR</span><h2 id="news-title">Son haberler</h2></div>{latestDate && <span className="news-updated"><Clock3 size={15} /> En yeni haber: {latestDate}</span>}</div>
      {articles.length ? <div className="news-grid">{articles.map((article) => <article className="news-card" key={article.url}><div className="news-card__top"><span>{article.category}</span><time dateTime={article.publishedAt}>{new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(new Date(article.publishedAt))}</time></div><h3>{article.title}</h3><div className="news-card__bottom"><span>{article.source}</span><a href={article.url} target="_blank" rel="noopener noreferrer" aria-label={`${article.title} haberini kaynağında aç`}>Kaynağında oku <ArrowUpRight size={16} /></a></div></article>)}</div> : <div className="news-empty"><Newspaper size={28} /><h3>Haber akışı şu anda alınamıyor.</h3><p>Kaynak yeniden erişilebilir olduğunda başlıklar burada otomatik görünecek. Bu sırada aşağıdaki satış rehberine göz atabilirsiniz.</p></div>}
      <p className="news-source-note">Haber başlıkları Google Haberler RSS üzerinden alınır. Tarih ve yayıncı bilgisi kaynak akışından gelir; D CARS haberlerin yayıncısı değildir. Piyasa haberleri aracınıza özel fiyat teklifi yerine geçmez.</p>
    </section>
    <section className="news-guides" aria-labelledby="guide-title"><div className="news-section__heading"><div><span className="vehicle-eyebrow">SATICI REHBERİ</span><h2 id="guide-title">Satışa hazırlanırken</h2></div><Link href="/arac-degerleme">Aracımı değerle <ArrowUpRight size={16} /></Link></div><div className="news-guides__grid">{guides.map((guide, index) => <article key={guide.title}><span>0{index + 1}</span><h3>{guide.title}</h3><p>{guide.text}</p></article>)}</div></section>
  </main></>;
}
