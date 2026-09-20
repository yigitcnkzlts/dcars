# Yayın için doğrulanacak bilgiler

## KVKK ve iletişim

- Veri sorumlusu işletmenin tam ticari unvanı, tebligat adresi ve varsa MERSİS/VKN bilgisi
- Gerçek showroom adresi, müşteri telefonu, kullanılacak e-posta ve KVKK başvuru adresi
- Barındırma, fotoğraf depolama ve AI sağlayıcısı sözleşmeleri; yurt dışı aktarım durumu ve veri saklama süreleri
- Her veri işleme amacı için hukuki dayanakların işletme ve hukuk danışmanı tarafından doğrulanması

Bu bilgiler tamamlanana kadar `/aydinlatma-metni` sayfası nihai metin olarak sunulmaz.

## Araç ve stok verisi

- Türkiye araç varyantları için kullanım hakkı bulunan JSON dosyası veya API belgeleri
- Aktif stok için işletmece doğrulanmış ilan bilgileri, gerçek fotoğraflar, fiyat ve ekspertiz özeti
- Fiyat aralığı otomasyonu isteniyorsa güncel ve kullanma hakkı bulunan piyasa verisi

## Sunucu yapılandırması

- AI sohbeti için sunucuda `OPENAI_API_KEY`
- Başvuru yönetimi için güçlü ve gizli `VALUATION_ADMIN_TOKEN`
- Başvuru ve fotoğraf kayıtları için çalışan `DB` ve `BUCKET` bağları

Anahtarlar bu belgeye veya depoya eklenmez. Her bağlantı gerçek üretim ortamında uçtan uca test edilir.
