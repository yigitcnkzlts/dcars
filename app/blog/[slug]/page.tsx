import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/layout/NativeLink";
import { Navbar } from "@/components/layout/Navbar";
import { blogArticles, getBlogArticle } from "@/lib/blogArticles";

export function generateStaticParams() { return blogArticles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getBlogArticle((await params).slug);
  return article ? { title: article.title, description: article.description, alternates: { canonical: `/blog/${article.slug}` }, openGraph: { title: article.title, description: article.description, type: "article", images: [{ url: "/images/q8-showroom.png", width: 1200, height: 630, alt: article.title }] } } : {};
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getBlogArticle((await params).slug);
  if (!article) notFound();
  return <><Navbar /><main className="article-page"><nav aria-label="Sayfa yolu"><Link href="/blog">Blog</Link> / Satıcı rehberi</nav><header><span>D CARS SATICI REHBERİ</span><h1>{article.title}</h1><p>{article.description}</p></header>{article.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}<aside><h2>Aracınız için teklif alın</h2><p>Bilgilerinizi paylaşın; uzmanımız başvurunuzun ardından sizi arasın.</p><Link className="button button--primary" href="/arac-degerleme?new=1">Ücretsiz teklif iste</Link></aside></main></>;
}
