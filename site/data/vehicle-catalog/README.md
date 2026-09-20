# Araç varyant kataloğu

`variants.ts` yalnızca kaynağı doğrulanmış örnek kayıtları içerir: 2019 ve 2026 Nissan Qashqai, 2020 Renault Clio, 2024 ve 2026 Toyota Corolla. Her kayıtta üretici kaynağı bulunur. Genel marka/model listesi `services/vehicleDataService.ts` içindedir ve tam Türkiye pazarı kataloğu değildir. Araç danışmanı altındaki karşılaştırma tablosu bu varyantları kullanır; bagaj, tüketim ve donanım için ayrıca doğrulanmamış alanları boş veri uyarısıyla gösterir.

`peugeot.ts`, Peugeot Türkiye duyurularından teyit edilen 2024 208 ve 2026 2008/408 motor, şanzıman ve paket eşleşmelerini içerir. Genel marka/model listesinde teknik varyantı henüz doğrulanmamış araçlar da vardır; bu liste motor veya paket doğrulaması anlamına gelmez. Kaynakta bulunmayan tork, çekiş, menzil ve batarya alanları boş bırakılır.

`renault.ts`, [OYAK Renault 2020 fiyat listesi](https://www.oyak-renault.com/wp-content/uploads/2020/06/OYAK-Grup-Sirketleri-Otomobil-Kampanyasi-Fiyat-Listesi-2020.pdf), [2021 model yılı listesi](https://www.oyak-renault.com/wp-content/uploads/2022/01/OR-Mais-Satis-Kampanyasi-100122.pdf) ve [2023 Austral duyurusunda](https://www.renault.com.tr/renault-haberler/renault-haberler-urun-lansman/renault-haberler-urun-lansman-yeni-austral-e-tech-full-hybrid.html) açıkça görünen kombinasyonları içerir. `volkswagen.ts` üç adet üretici belgeli 2020 Golf/T-Roc teklifini içerir. `yearFrom` ve `yearTo` kaynak tarafından teyit edilmiş **model yılı aralığıdır**; neslin tüm üretim yılları olduğu iddia edilmez. Bir modelin burada kaydı yoksa o model için yıl/motor/paket eşleşmesi henüz doğrulanmamıştır.

Yeni bir veri kaynağı eklendiğinde her satırda `year`, `brand`, `model`, `engine`, `fuelType`, `transmission`, `version`, `trim`, `factoryEquipment` ve `sourceUrl` bulunmalıdır. Yıl, motor veya paket ilişkisi doğrulanmamış kayıtları hazır seçenek olarak göstermeyin. Katalogda kayıt yoksa teknik alanlarda “Bilmiyorum” seçilebilir. Fabrika donanımı yalnızca doğrulanmış veri varsa doldurulur; kullanıcının işaretlediği ek donanımlar ayrı saklanır.

## Geniş katalog içe aktarımı

`db/schema.ts` ve `drizzle/0002_aberrant_spacker_dave.sql` nesil, motor ve paketi ayrı kaydeder. `vehicle_variants` bunları belirli bir model yılı için birleştirir. Veritabanı tetikleyicileri, nesil/motor/paket yıl aralıkları uyuşmayan varyantları reddeder.

Kaynak veri `import-example.json` biçiminde hazırlanabilir. `node scripts/validate-vehicle-catalog.mjs <dosya.json>` komutu alanları, kaynak adreslerini, yıl aralıklarını ve tekrarları kontrol eder. Örnek dosya yalnızca biçimi gösterir; tüm Türkiye kataloğu değildir. Kaynağın kullanım ve yeniden dağıtım hakkı ayrıca doğrulanmalıdır.

Kullanım hakkı doğrulanmış gerçek dosya geldiğinde `node scripts/import-vehicle-catalog.mjs <dosya.json>` komutu yalnızca `isActive: true` kayıtları doğrulayarak `variants.imported.json` dosyasına yazar. Site bu dosyayı mevcut üretici kaynaklı örneklerle birlikte filtrelerde kullanır. Veriyi aktarmadan önce kapsam ve kaynak URL'leri ayrıca incelenmelidir. Örnek kayıt pasiftir ve çalıştırıldığında canlı seçenek eklemez.
