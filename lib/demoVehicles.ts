export type VehicleImage = { url?: string; alt: string; label: string };
export type VehicleDetail = { label: string; value: string };

export type DemoVehicle = {
  slug: string;
  title: string;
  year: number;
  mileageKm: number;
  priceTry: number;
  body: string;
  fuel: string;
  transmission: string;
  color: string;
  engine: string;
  drive: string;
  condition: string;
  damage: string;
  description: string;
  longDescription: string[];
  highlights: string[];
  equipment: string[];
  technicalDetails: VehicleDetail[];
  sellerNotes: string;
  images: VehicleImage[];
};

const galleryLabels = ["Ön görünüm", "Arka görünüm", "Sol yan", "Sağ yan", "İç mekân", "Ön konsol", "Arka koltuklar", "Bagaj", "Motor", "Detay"];
const gallery = (title: string, photos: Partial<Record<number, string>> = {}): VehicleImage[] => galleryLabels.map((label, index) => ({ url: photos[index], label, alt: `${title} ${label.toLocaleLowerCase("tr-TR")} görseli` }));

// Panel eklendiğinde API/DB yanıtı bu yapıyı doğrudan besleyebilir.
export const demoVehicles: DemoVehicle[] = [
  {
    slug: "audi-q8-demo", title: "Audi Q8", year: 2022, mileageKm: 42000,
    priceTry: 4850000, body: "SUV", fuel: "Dizel", transmission: "Otomatik",
    color: "Siyah", engine: "3.0 L", drive: "4x4", condition: "Örnek bilgi",
    damage: "Ekspertiz bilgisi panelden eklenecek",
    description: "Geniş iç mekânı, quattro çekiş sistemi ve güçlü tasarımıyla öne çıkan premium SUV.",
    longDescription: [
      "Audi Q8; yüksek sürüş pozisyonunu, geniş yaşam alanını ve coupe çizgilerini aynı gövdede bir araya getirir. Uzun yol konforuna önem veren ve şehir içinde güçlü bir duruş arayan kullanıcılar için dikkat çekici bir seçenektir.",
      "Bu alan gelecekte panel üzerinden ilan editörü tarafından düzenlenebilir. Aracın bakım geçmişi, kullanım durumu, yapılan işlemler ve satışa özel açıklamalar burada ayrıntılı biçimde paylaşılacaktır.",
    ],
    highlights: ["quattro dört tekerlekten çekiş", "Geniş dijital kokpit", "Elektrikli bagaj", "LED aydınlatma"],
    equipment: ["Deri döşeme", "Çift bölgeli klima", "Geri görüş kamerası", "Ön ve arka park sensörü", "Hız sabitleyici", "Elektrikli ön koltuklar"],
    technicalDetails: [{ label: "Silindir hacmi", value: "2.967 cc" }, { label: "Güç", value: "Panelden eklenecek" }, { label: "Kapı / koltuk", value: "5 / 5" }, { label: "Bagaj", value: "Panelden eklenecek" }],
    sellerNotes: "Bakım, lastik, yedek anahtar ve ekspertiz notları panelden bu alana eklenecek.",
    images: gallery("Audi Q8", { 0: "/images/q8-showroom.png", 2: "/images/q8-cutout.png" }),
  },
  {
    slug: "bmw-320i-demo", title: "BMW 320i", year: 2021, mileageKm: 58000,
    priceTry: 2590000, body: "Sedan", fuel: "Benzin", transmission: "Otomatik",
    color: "Gri", engine: "1.6 L", drive: "Arkadan itiş", condition: "Örnek bilgi",
    damage: "Ekspertiz bilgisi panelden eklenecek",
    description: "Sürüş odaklı karakteri, dengeli şasisi ve günlük kullanıma uygun premium sedan yapısı.",
    longDescription: ["BMW 3 Serisi, sürücü odaklı kokpiti ve dengeli yol tutuşuyla premium sedan sınıfının bilinen modellerindendir.", "Gerçek ilan yayınlandığında aracın bakım kayıtları, değişen veya boyalı parçaları, lastik durumu ve teslim bilgileri bu bölümde açıklanacaktır."],
    highlights: ["Arkadan itiş", "Sürücü odaklı kokpit", "Otomatik şanzıman", "Sedan bagaj yapısı"],
    equipment: ["Dijital gösterge", "Otomatik klima", "Park sensörü", "Bluetooth", "Hız sabitleyici", "Yağmur sensörü"],
    technicalDetails: [{ label: "Silindir hacmi", value: "1.598 cc" }, { label: "Güç", value: "Panelden eklenecek" }, { label: "Kapı / koltuk", value: "4 / 5" }, { label: "Bagaj", value: "Panelden eklenecek" }],
    sellerNotes: "Araca özel açıklamalar ve ekspertiz özeti panelden eklenecek.",
    images: gallery("BMW 320i"),
  },
  {
    slug: "toyota-corolla-demo", title: "Toyota Corolla", year: 2023, mileageKm: 27500,
    priceTry: 1690000, body: "Sedan", fuel: "Hibrit", transmission: "Otomatik",
    color: "Beyaz", engine: "1.8 L", drive: "Önden çekiş", condition: "Örnek bilgi",
    damage: "Ekspertiz bilgisi panelden eklenecek",
    description: "Hibrit sürüş sistemi, günlük kullanım kolaylığı ve geniş servis ağıyla öne çıkan sedan.",
    longDescription: ["Corolla Hybrid, şehir içi kullanımda elektrik destekli sürüş yapısı ve otomatik şanzıman rahatlığı sunar.", "Gerçek araç kaydında donanım paketi, garanti durumu, bakım geçmişi ve batarya kontrol bilgisi panel üzerinden ayrıntılı olarak yayınlanacaktır."],
    highlights: ["Hibrit motor", "Otomatik şanzıman", "Düşük kilometre", "Geniş arka yaşam alanı"],
    equipment: ["Geri görüş kamerası", "Şerit takip desteği", "Adaptif hız sabitleyici", "Çift bölgeli klima", "Anahtarsız çalıştırma", "Dokunmatik multimedya"],
    technicalDetails: [{ label: "Motor", value: "1.8 Hybrid" }, { label: "Sistem gücü", value: "Panelden eklenecek" }, { label: "Kapı / koltuk", value: "4 / 5" }, { label: "Batarya", value: "Panelden eklenecek" }],
    sellerNotes: "Bakım geçmişi, hibrit sistem kontrolü ve ekspertiz notları panelden eklenecek.",
    images: gallery("Toyota Corolla"),
  },
];

export const formatKm = (value: number) => `${new Intl.NumberFormat("tr-TR").format(value)} km`;
export const formatPrice = (value: number) => `${new Intl.NumberFormat("tr-TR").format(value)} ₺`;
