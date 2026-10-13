export const blogArticles = [
  { slug: "ikinci-el-arac-degerini-neler-belirler", title: "İkinci el araç değerini neler belirler?", description: "Kilometre, bakım, donanım ve hasar geçmişinin teklif üzerindeki etkisini öğrenin.", sections: [
    ["Kilometre tek başına yeterli değildir", "Kilometre önemli bir göstergedir; ancak kullanım biçimi, düzenli bakım ve mekanik durumla birlikte değerlendirilir. Düşük kilometreli fakat bakımsız bir araç, daha yüksek kilometreli ve kayıtlı bakımları bulunan bir araçtan daha avantajlı olmayabilir."],
    ["Hasar ve ekspertiz geçmişi", "Boya ve değişen parçalar, onarımın niteliği ve şasi gibi güvenlik bileşenlerine müdahale olup olmadığı birlikte incelenir. Bilgileri baştan doğru paylaşmak teklif sürecini hızlandırır."],
    ["Donanım ve piyasa talebi", "Motor, vites, paket, renk ve opsiyonlar benzer araçlara olan talebi değiştirir. İnternet ilan fiyatı gerçekleşmiş satış fiyatı değildir; güncel piyasa koşulları ayrıca değerlendirilir."],
  ] },
  { slug: "arac-satisinda-noter-islemleri", title: "Araç satışında noter işlemleri", description: "Satış öncesinde hazırlanacak belgeler ile ödeme ve devir sırasını inceleyin.", sections: [
    ["Satış öncesi hazırlık", "Ruhsat, kimlik ve satışa engel olabilecek borç veya kısıtların durumu önceden kontrol edilmelidir. Temsil yoluyla işlem yapılacaksa geçerli vekâletname gerekir."],
    ["Ödeme ve devir sırası", "Ödeme yöntemi ile noter randevusu satıştan önce yazılı biçimde netleştirilmelidir. Taraflar, ödemenin doğrulanması ve devir işleminin tamamlanması adımlarında aynı planı takip etmelidir."],
    ["Teslim kaydı", "Anahtarlar, yedek anahtar, bakım belgeleri ve araçla birlikte verilen ekipmanlar teslim sırasında kayıt altına alınmalıdır."],
  ] },
  { slug: "rehinli-kredili-arac-satisi", title: "Rehinli veya kredili araç nasıl satılır?", description: "Kredi kapama, rehin kaldırma ve noter öncesi doğrulama adımlarını öğrenin.", sections: [
    ["Güncel borç ve rehin durumu", "Araç üzerindeki kredi, rehin veya haciz bilgisi ilgili kurumdan güncel olarak doğrulanmalıdır. Başvuruda bu durumu açıkça belirtmek sürecin doğru planlanmasını sağlar."],
    ["Kapatma planı", "Kredi kapama tutarı ve ödeme yöntemi finans kuruluşunun kurallarına göre değişebilir. Yazılı kapama bilgisi alınmadan kesin ödeme veya devir planı oluşturulmamalıdır."],
    ["Noter öncesi son kontrol", "Satışa engel kaydın kaldırıldığı doğrulandıktan sonra noter devri planlanır. İşlem süresi kuruma ve kaydın sistemlere yansımasına göre değişebilir."],
  ] },
] as const;

export function getBlogArticle(slug: string) { return blogArticles.find((article) => article.slug === slug); }
