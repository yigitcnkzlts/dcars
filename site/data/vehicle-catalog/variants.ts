export type VehicleVariant = {
  year: number;
  brand: string;
  model: string;
  engine: string;
  fuelType: string;
  transmission: string;
  version: string;
  trim: string;
  factoryEquipment: string[];
  sourceUrl: string;
};

// Source-backed examples only. This is not a complete Turkish vehicle catalog.
const sourceUrl = "https://www.toyota.com.tr/content/dam/toyota/nmsc/turkey/cars/e-brosur/corolla/TOYOTA_YeniCorolla_Teknik_Ozellikler_2024.pdf";
const petrolTrims = ["Vision Plus", "Dream", "Dream X-Pack", "Flame X-Pack", "Passion X-Pack"];
const hybridTrims = ["Hybrid Dream", "Hybrid Dream X-Pack", "Hybrid Flame X-Pack", "Hybrid Passion X-Pack"];
const qashqai2019Source = "https://www.nissan.com.tr/content/dam/Nissan/turkey/brochures/Nissan-Qashqai-Brosuru-Haziran-2019.pdf";
const qashqai2026Source = "https://www.nissan.com.tr/fiyat-listesi/sifir-arac-fiyatlari-2026.html";
const qashqai2019 = [
  { engine: "1.3 DIG-T 160 PS", fuelType: "Benzin", transmission: "6 ileri Manuel", trims: ["Visia", "Tekna", "Sky Pack"] },
  { engine: "1.3 DIG-T 160 PS", fuelType: "Benzin", transmission: "7 ileri DCT", trims: ["Visia", "Tekna", "Sky Pack", "Platinum Premium"] },
  { engine: "1.5 dCi 115 PS", fuelType: "Dizel", transmission: "6 ileri Manuel", trims: ["Visia", "Tekna", "Sky Pack"] },
  { engine: "1.5 dCi 115 PS", fuelType: "Dizel", transmission: "7 ileri DCT", trims: ["Visia", "Tekna", "Sky Pack", "Platinum Premium Pack"] },
];
const qashqai2026Trims = ["Designpack", "Skypack", "Skypack 4x4", "N-Design", "Platinum", "Platinum 4x4", "Platinum Premium", "Platinum Premium 4x4"];
const clio2020Source = "https://www.oyak-renault.com/wp-content/uploads/2020/06/OYAK-Grup-Sirketleri-Otomobil-Kampanyasi-Fiyat-Listesi-2020.pdf";
const clio2020 = [
  { trim: "Joy", engine: "1.0 SCe 72 bg", fuelType: "Benzin", transmission: "5 ileri Manuel" },
  { trim: "Joy", engine: "1.0 TCe 100 bg", fuelType: "Benzin", transmission: "X-Tronic" },
  { trim: "Joy", engine: "1.5 Blue dCi 85 bg", fuelType: "Dizel", transmission: "Manuel" },
  { trim: "Touch", engine: "1.0 TCe 100 bg", fuelType: "Benzin", transmission: "5 ileri Manuel" },
  { trim: "Touch", engine: "1.0 TCe 100 bg", fuelType: "Benzin", transmission: "X-Tronic" },
  { trim: "Touch", engine: "1.3 TCe 130 bg", fuelType: "Benzin", transmission: "EDC" },
  { trim: "Touch", engine: "1.5 Blue dCi 115 bg", fuelType: "Dizel", transmission: "Manuel" },
  { trim: "Icon", engine: "1.0 TCe 100 bg", fuelType: "Benzin", transmission: "5 ileri Manuel" },
  { trim: "Icon", engine: "1.0 TCe 100 bg", fuelType: "Benzin", transmission: "X-Tronic" },
  { trim: "Icon", engine: "1.3 TCe 130 bg", fuelType: "Benzin", transmission: "EDC" },
  { trim: "Icon", engine: "1.5 Blue dCi 115 bg", fuelType: "Dizel", transmission: "Manuel" },
];

export const verifiedVariants: VehicleVariant[] = [
  ...petrolTrims.map((trim) => ({ year: 2024, brand: "Toyota", model: "Corolla", engine: "1.5 L", fuelType: "Benzin", transmission: "Multidrive S", version: "1.5L Benzinli Multidrive S", trim, factoryEquipment: [], sourceUrl })),
  ...hybridTrims.map((trim) => ({ year: 2024, brand: "Toyota", model: "Corolla", engine: "1.8 L", fuelType: "Hibrit", transmission: "e-CVT", version: "1.8L Hybrid e-CVT", trim, factoryEquipment: [], sourceUrl })),
  ...qashqai2019.flatMap(({ engine, fuelType, transmission, trims }) => trims.map((trim) => ({ year: 2019, brand: "Nissan", model: "Qashqai", engine, fuelType, transmission, version: `${engine} · ${transmission}`, trim, factoryEquipment: [], sourceUrl: qashqai2019Source }))),
  ...qashqai2026Trims.map((trim) => ({ year: 2026, brand: "Nissan", model: "Qashqai", engine: "1.3 DIG-T Mild Hybrid 158 PS", fuelType: "Hibrit", transmission: "Otomatik", version: "1.3 DIG-T Mild Hybrid 158 PS · Otomatik", trim, factoryEquipment: [], sourceUrl: qashqai2026Source })),
  ...clio2020.map(({ engine, fuelType, transmission, trim }) => ({ year: 2020, brand: "Renault", model: "Clio", engine, fuelType, transmission, version: `${engine} · ${transmission}`, trim, factoryEquipment: [], sourceUrl: clio2020Source })),
];
