# D CARS araç kataloğu kapsamı

Son güncelleme: 2026-10-13

Bu belge, seçim ekranındaki model adları ile kaynakla doğrulanmış yıl–motor–yakıt–şanzıman–donanım kayıtlarını birbirinden ayırır. Modelin listede görünmesi, o modelin bütün yıllarının ve paketlerinin doğrulandığı anlamına gelmez.

## Genel durum

| Ölçüm | Mevcut durum |
| --- | ---: |
| Seçim listesinde marka | 92 |
| Ana model adı | 448 |
| Kaynaklı varyantı bulunan marka | 11 |
| Kaynaklı marka-model çifti | 50 |
| Kaynaklı motor/şanzıman kombinasyonu | 140 |
| Kaynaklı varyant/donanım satırı | 304 |

Kaynaklı markalar: BMW, Citroen, Cupra, Fiat, Hyundai, Nissan, Opel, Peugeot, Renault, Toyota ve Volkswagen. Diğer markalar ile bu markaların tabloda yer almayan yılları yalnızca model seçimine ve manuel girişe açıktır; tam motor/donanım kapsamına sahip değildir.

## Hyundai 2021 — ilk tamamlanan dönemsel paket

Hyundai'nin 2 Haziran 2021 tarihli, açıkça `2021 MY` yazan fiyat listesi şu modeller için birincil kaynaktır:

- i10: 1.0 MPI ve 1.2 MPI; Jump, Style, Elite ve belgede ayrı satır olan çift renk seçenekleri.
- i20: 1.4 MPI ve 1.0 T-GDI/48V; Jump, Style, Style Design, Style Plus, Elite ve Elite Plus.
- Kona: 1.0 T-GDI, 1.6 T-GDI ve 1.6 CRDI 48V MHEV; Style, Smart, N Line ve Elite.
- Elantra: 1.6 MPI; Style, Style Comfort, Smart, Elite ve Elite Plus.
- Tucson: 1.6 T-GDI ve 1.6 CRDI; Comfort, Prime, Elite ve Elite Plus; 4x2/4x4 ayrımı korunur.

Birincil belge: <https://www.akbak.com.tr/public/upload/fiyatListe/2_1_2021-haziran-fl.pdf>

Bayon ve Santa Fe Haziran belgesinde bulunmadığı için resmi doğrulama seviyesine yükseltilmedi. Eylül 2021 dönemini aynı kombinasyonlarla aktaran iki bağımsız arşiv kaynağına dayanarak `trusted` seviyesinde tutulur:

- Bayon: 1.4 MPI manuel/otomatik ve 1.0 T-GDI DCT; Jump, Style, Style Design ve Elite.
- Santa Fe: 1.6 T-GDI HEV, 4x4, otomatik, Progressive.

Çapraz kaynaklar: <https://otomobil.haber7.com/otomobil/haber/3136769-hyunda-2021-eylul-ayi-fiyat-listesi-belli-oldu-yeni-bayon-i10-i20-elentra-tucson-guncel-fiyati> ve <https://otomobilir.com/hyundai-eylul-2021-fiyat-listesi/>.

## Kapsam ve kaynak güveni

- `official`: Üretici/ithalatçı belgesi veya aynı kurumsal içeriği taşıyan tarihli bayi belgesi.
- `trusted`: Aynı dönem ve kombinasyonu doğrulayan en az iki bağımsız kaynak.
- Teknik lisanslı katalog: Motor/şanzıman alternatifi gösterebilir; Türkiye donanım paketi kanıtı sayılmaz.
- OtoAPI: İsteğe bağlı teknik zenginleştirmedir; motor varyantı donanım adı olarak kullanılmaz.
- Manuel giriş: Kaynaklı seçenek bulunmadığında son yedektir.

## Bilinen açıklar ve sonraki sıra

Katalog Türkiye pazarı için henüz eksiksiz değildir. 92 markanın tamamında bütün yılları kapsayan, ticari kullanım izni açık bir yıl–motor–donanım veri kaynağı bulunmamaktadır. Sonraki işler:

1. Ford Focus 2021 için teknik motorlar mevcut; Trend, Titanium ve ST-Line yıl+motor eşleşmeleri doğrulanmadığından yalnızca öneri, doğrulanmış paket değildir.
2. Volkswagen Golf 2018 için lisanslı teknik seçenekler mevcut; Türkiye paket eşleşmelerinin ayrıca belgelenmesi gerekir.
3. Renault Clio 2020 resmi kampanya belgesiyle doğrulanmıştır; farklı yıllar ayrı kaynak gerektirir.
4. Hyundai'nin 2021 dışındaki eski yılları ile 2022–2024 dönemleri model yılı bazında tamamlanmalıdır.
5. Kaynaklı 11 marka dışındaki 81 markanın motor/donanım kapsamı yoktur.

Katalog büyütülürken her satırda kaynak URL'si, belge adı, pazar, doğrulama seviyesi ve tarih tutulmalı; yıl aralıkları tahmin edilmemeli ve aynı isimli motorlar güç/şanzıman farkları varsa birleştirilmemelidir.
