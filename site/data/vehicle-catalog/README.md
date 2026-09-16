# Araç varyant kataloğu

`variants.ts` yalnızca kaynağı doğrulanmış örnek kayıtları içerir: 2019 ve 2026 Nissan Qashqai, 2020 Renault Clio, 2024 Toyota Corolla. Her kayıtta üretici kaynağı bulunur. Genel marka/model listesi `services/vehicleDataService.ts` içindedir ve tam Türkiye pazarı kataloğu değildir.

Yeni bir veri kaynağı eklendiğinde her satırda `year`, `brand`, `model`, `engine`, `fuelType`, `transmission`, `version`, `trim`, `factoryEquipment` ve `sourceUrl` bulunmalıdır. Yıl, motor veya paket ilişkisi doğrulanmamış kayıtları hazır seçenek olarak göstermeyin. Katalogda kayıt yoksa teknik alanlarda “Bilmiyorum” seçilebilir. Fabrika donanımı yalnızca doğrulanmış veri varsa doldurulur; kullanıcının işaretlediği ek donanımlar ayrı saklanır.
