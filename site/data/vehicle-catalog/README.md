# Araç varyant kataloğu

`variants.ts` yalnızca kaynağı doğrulanmış örnek kayıtları içerir: 2019 ve 2026 Nissan Qashqai, 2020 Renault Clio, 2024 Toyota Corolla. Her kayıtta üretici kaynağı bulunur. Genel marka/model listesi `services/vehicleDataService.ts` içindedir ve tam Türkiye pazarı kataloğu değildir.

Yeni bir veri kaynağı eklendiğinde her satırda `year`, `brand`, `model`, `engine`, `fuelType`, `transmission`, `version`, `trim`, `factoryEquipment` ve `sourceUrl` bulunmalıdır. Yıl, motor veya paket ilişkisi doğrulanmamış kayıtları hazır seçenek olarak göstermeyin. Katalogda kayıt yoksa teknik alanlarda “Bilmiyorum” seçilebilir. Fabrika donanımı yalnızca doğrulanmış veri varsa doldurulur; kullanıcının işaretlediği ek donanımlar ayrı saklanır.

## Geniş katalog içe aktarımı

`db/schema.ts` ve `drizzle/0002_aberrant_spacker_dave.sql` nesil, motor ve paketi ayrı kaydeder. `vehicle_variants` bunları belirli bir model yılı için birleştirir. Veritabanı tetikleyicileri, nesil/motor/paket yıl aralıkları uyuşmayan varyantları reddeder.

Kaynak veri `import-example.json` biçiminde hazırlanabilir. `node scripts/validate-vehicle-catalog.mjs <dosya.json>` komutu alanları, kaynak adreslerini, yıl aralıklarını ve tekrarları kontrol eder. Örnek dosya yalnızca biçimi gösterir; tüm Türkiye kataloğu değildir. Kaynağın kullanım ve yeniden dağıtım hakkı ayrıca doğrulanmalıdır.

Kullanım hakkı doğrulanmış gerçek dosya geldiğinde `node scripts/import-vehicle-catalog.mjs <dosya.json>` komutu yalnızca `isActive: true` kayıtları doğrulayarak `variants.imported.json` dosyasına yazar. Site bu dosyayı mevcut üretici kaynaklı örneklerle birlikte filtrelerde kullanır. Veriyi aktarmadan önce kapsam ve kaynak URL'leri ayrıca incelenmelidir. Örnek kayıt pasiftir ve çalıştırıldığında canlı seçenek eklemez.
