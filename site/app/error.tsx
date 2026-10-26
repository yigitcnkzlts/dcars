"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("D CARS page error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <main className="content-page">
      <section className="content-hero">
        <span>GEÇİCİ BİR SORUN OLUŞTU</span>
        <h1>Bu sayfa şu anda yüklenemedi.</h1>
        <p>Bağlantınızı kontrol edip yeniden deneyebilir veya ana sayfaya dönebilirsiniz.</p>
        <div className="management-actions">
          <button className="button button--primary" type="button" onClick={reset}>Yeniden dene</button>
          <Link className="button" href="/">Ana sayfaya dön</Link>
        </div>
      </section>
    </main>
  );
}
