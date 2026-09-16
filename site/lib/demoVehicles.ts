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
  image?: string;
  imageAlt?: string;
};

// Presentation-only records. Replace this source with published panel listings later.
export const demoVehicles: DemoVehicle[] = [
  {
    slug: "audi-q8-demo", title: "Audi Q8", year: 2022, mileageKm: 42000,
    priceTry: 4850000, body: "SUV", fuel: "Dizel", transmission: "Otomatik",
    color: "Siyah", engine: "3.0 L", drive: "4x4", condition: "Örnek bilgi",
    damage: "Ekspertiz bilgisi panelden eklenecek",
    description: "Geniş iç mekân ve güçlü tasarımıyla öne çıkan SUV için örnek ilan görünümü.",
    image: "/images/q8-showroom.png", imageAlt: "Audi Q8 tanıtım görseli",
  },
  {
    slug: "bmw-320i-demo", title: "BMW 320i", year: 2021, mileageKm: 58000,
    priceTry: 2590000, body: "Sedan", fuel: "Benzin", transmission: "Otomatik",
    color: "Gri", engine: "1.6 L", drive: "Arkadan itiş", condition: "Örnek bilgi",
    damage: "Ekspertiz bilgisi panelden eklenecek",
    description: "Sedan araçların listede nasıl sunulacağını gösteren örnek ilan.",
  },
  {
    slug: "toyota-corolla-demo", title: "Toyota Corolla", year: 2023, mileageKm: 27500,
    priceTry: 1690000, body: "Sedan", fuel: "Hibrit", transmission: "Otomatik",
    color: "Beyaz", engine: "1.8 L", drive: "Önden çekiş", condition: "Örnek bilgi",
    damage: "Ekspertiz bilgisi panelden eklenecek",
    description: "Hibrit bir aracın teknik bilgilerinin nasıl görüneceğini gösteren örnek ilan.",
  },
];

export const formatKm = (value: number) => `${new Intl.NumberFormat("tr-TR").format(value)} km`;
export const formatPrice = (value: number) => `${new Intl.NumberFormat("tr-TR").format(value)} ₺`;
