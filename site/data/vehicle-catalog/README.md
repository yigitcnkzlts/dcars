# Araç varyant kataloğu

`variants.ts` yalnızca kaynağı doğrulanmış örnek kayıtları içerir. Genel marka/model öneri listesi `services/vehicleDataService.ts` içindedir ve tam Türkiye pazarı kataloğu değildir.

Yeni bir veri kaynağı eklendiğinde her satırda `year`, `brand`, `model`, `engine`, `fuelType`, `transmission`, `version`, `trim`, `factoryEquipment` ve `sourceUrl` bulunmalıdır. Yıl, motor veya paket ilişkisi doğrulanmamış kayıtları hazır seçenek olarak göstermeyin. Katalogda kayıt yoksa form elle girişe izin verir. Fabrika donanımı yalnızca doğrulanmış veri varsa doldurulur; kullanıcının işaretlediği ek donanımlar ayrı saklanır.
