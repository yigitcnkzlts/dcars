"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="tr">
      <body>
        <main style={{ maxWidth: 720, margin: "10vh auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <p>D CARS</p>
          <h1>Sayfa şu anda yüklenemedi.</h1>
          <p>Geçici bağlantı sorunu giderildikten sonra yeniden deneyebilirsiniz.</p>
          <button type="button" onClick={reset}>Yeniden dene</button>
        </main>
      </body>
    </html>
  );
}
