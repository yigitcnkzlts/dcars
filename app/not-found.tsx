import Link from "next/link";

export default function NotFound() {
  return (
    <main className="content-page">
      <section className="content-hero">
        <span>404</span>
        <h1>Aradığınız sayfa bulunamadı.</h1>
        <p>Bağlantı değişmiş veya içerik kaldırılmış olabilir.</p>
        <Link className="button button--primary" href="/">Ana sayfaya dön</Link>
      </section>
    </main>
  );
}
