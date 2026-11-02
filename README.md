# D CARS

D CARS, araç sahiplerinin araç bilgilerini paylaşarak ücretsiz değerleme ve teklif talebi oluşturabildiği modern bir otomotiv platformudur.

Kullanıcılar marka, model, kilometre, donanım ve ekspertiz bilgilerini adım adım girerek başvuru oluşturabilir; başvuru durumunu takip edebilir ve teklif sonrasında randevu talebinde bulunabilir. Platformda ayrıca satılık araçlar, araç karşılaştırma, fiyat analizi, otomotiv rehberi ve yapay zekâ destekli araç danışmanı yer alır.

## Öne çıkan özellikler

- Adım adım araç değerleme ve teklif başvurusu
- Fotoğraf ve ekspertiz bilgisi ekleme
- Başvuru durumu ve randevu takibi
- Satılık araç kataloğu ve araç karşılaştırma
- Yapay zekâ destekli araç danışmanı
- Mobil, tablet ve masaüstü uyumlu tasarım
- Yönetim paneli üzerinden başvuru ve randevu yönetimi

## Kullanılan teknolojiler

- Next.js, React ve TypeScript
- Vinext ve Vite
- Drizzle ORM
- Tailwind CSS
- Vercel ve Cloudflare uyumlu dağıtım yapısı

## Yerel çalıştırma

Node.js `22.13.0` veya daha yeni bir sürüm gereklidir.

```bash
npm install
npm run dev
```

Üretim derlemesini kontrol etmek için:

```bash
npm run build
```

## Ortam değişkenleri

Gerekli değişkenler için `.env.example` dosyasını kullanın. Gizli anahtarları kaynak koduna veya Git geçmişine eklemeyin.

- `OPENAI_API_KEY`: Yapay zekâ destekli araç danışmanı
- `VALUATION_ADMIN_TOKEN`: Yönetim ekranlarına erişim

## Proje yapısı

- `app/`: Sayfalar ve API uçları
- `components/`: Arayüz bileşenleri
- `public/images/`: Site görselleri ve logolar
- `services/`: İş kuralları ve servisler
- `data/`: Araç kataloğu verileri
- `db/` ve `drizzle/`: Veritabanı yapısı ve migration dosyaları

---

D CARS — Aracınız için teklif alın, kararınızı güvenle verin.
