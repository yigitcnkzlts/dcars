import type { VehicleVariant } from "./variants";

type Hyundai2021Offer = {
  model: string;
  generation: string;
  bodyType: string;
  engine: string;
  fuelType: string;
  transmission: string;
  driveType: string;
  trims: readonly string[];
  sourceUrl: string;
  sourceDocument: string;
  verifiedLevel: "official" | "trusted";
};

const officialSource = "https://www.akbak.com.tr/public/upload/fiyatListe/2_1_2021-haziran-fl.pdf";
const secondarySource = "https://otomobil.haber7.com/otomobil/haber/3136769-hyunda-2021-eylul-ayi-fiyat-listesi-belli-oldu-yeni-bayon-i10-i20-elentra-tucson-guncel-fiyati";
const secondaryCrossCheck = "https://otomobilir.com/hyundai-eylul-2021-fiyat-listesi/";

// Akbak'ın 2 Haziran 2021 tarihli Hyundai 2021 MY fiyat listesinde birebir
// yayımlanan motor, şanzıman, çekiş ve ticari donanım eşleşmeleri.
const officialOffers: Hyundai2021Offer[] = [
  { model: "i10", generation: "i10 AC3", bodyType: "Hatchback", engine: "1.0 MPI", fuelType: "Benzin", transmission: "5 ileri Manuel", driveType: "4x2", trims: ["Jump"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "i10", generation: "i10 AC3", bodyType: "Hatchback", engine: "1.0 MPI", fuelType: "Benzin", transmission: "AMT", driveType: "4x2", trims: ["Jump"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "i10", generation: "i10 AC3", bodyType: "Hatchback", engine: "1.2 MPI", fuelType: "Benzin", transmission: "AMT", driveType: "4x2", trims: ["Style", "Style Çift Renk", "Elite", "Elite Çift Renk"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "i20", generation: "i20 BC3", bodyType: "Hatchback", engine: "1.4 MPI", fuelType: "Benzin", transmission: "6 ileri Manuel", driveType: "4x2", trims: ["Jump", "Style"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "i20", generation: "i20 BC3", bodyType: "Hatchback", engine: "1.4 MPI", fuelType: "Benzin", transmission: "6 ileri Otomatik", driveType: "4x2", trims: ["Jump", "Style", "Style Design", "Style Plus", "Elite", "Elite Plus"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "i20", generation: "i20 BC3", bodyType: "Hatchback", engine: "1.0 T-GDI", fuelType: "Benzin", transmission: "7 ileri DCT", driveType: "4x2", trims: ["Style", "Style Plus"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "i20", generation: "i20 BC3", bodyType: "Hatchback", engine: "1.0 T-GDI 48V", fuelType: "Mild Hibrit", transmission: "7 ileri DCT", driveType: "4x2", trims: ["Style Plus"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "Kona", generation: "Kona OS FL", bodyType: "SUV", engine: "1.0 T-GDI", fuelType: "Benzin", transmission: "7 ileri DCT", driveType: "4x2", trims: ["Style"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "Kona", generation: "Kona OS FL", bodyType: "SUV", engine: "1.6 T-GDI", fuelType: "Benzin", transmission: "7 ileri DCT", driveType: "4x2", trims: ["Smart", "N Line"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "Kona", generation: "Kona OS FL", bodyType: "SUV", engine: "1.6 CRDI 48V MHEV", fuelType: "Dizel", transmission: "7 ileri DCT", driveType: "4x2", trims: ["Style", "Smart", "Elite"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "Elantra", generation: "Elantra CN7", bodyType: "Sedan", engine: "1.6 MPI", fuelType: "Benzin", transmission: "6 ileri Manuel", driveType: "4x2", trims: ["Style"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "Elantra", generation: "Elantra CN7", bodyType: "Sedan", engine: "1.6 MPI", fuelType: "Benzin", transmission: "CVT", driveType: "4x2", trims: ["Style Comfort", "Smart", "Elite", "Elite Plus"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "Tucson", generation: "Tucson NX4", bodyType: "SUV", engine: "1.6 T-GDI", fuelType: "Benzin", transmission: "7 ileri DCT", driveType: "4x2", trims: ["Comfort"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "Tucson", generation: "Tucson NX4", bodyType: "SUV", engine: "1.6 CRDI", fuelType: "Dizel", transmission: "7 ileri DCT", driveType: "4x2", trims: ["Prime", "Elite"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
  { model: "Tucson", generation: "Tucson NX4", bodyType: "SUV", engine: "1.6 CRDI", fuelType: "Dizel", transmission: "7 ileri DCT", driveType: "4x4", trims: ["Elite Plus"], sourceUrl: officialSource, sourceDocument: "Hyundai 2 Haziran 2021 — 2021 MY fiyat listesi", verifiedLevel: "official" },
];

// Eylül 2021 dönem listesi aktarımı. Birincil üretici PDF'i arşivlenene kadar
// bu satırlar official değil trusted olarak tutulur.
const trustedOffers: Hyundai2021Offer[] = [
  { model: "Bayon", generation: "Bayon BC3 CUV", bodyType: "SUV", engine: "1.4 MPI", fuelType: "Benzin", transmission: "6 ileri Manuel", driveType: "4x2", trims: ["Jump"], sourceUrl: secondarySource, sourceDocument: "Hyundai Eylül 2021 fiyat listesi aktarımı", verifiedLevel: "trusted" },
  { model: "Bayon", generation: "Bayon BC3 CUV", bodyType: "SUV", engine: "1.4 MPI", fuelType: "Benzin", transmission: "6 ileri Otomatik", driveType: "4x2", trims: ["Style", "Style Design", "Elite"], sourceUrl: secondarySource, sourceDocument: "Hyundai Eylül 2021 fiyat listesi aktarımı", verifiedLevel: "trusted" },
  { model: "Bayon", generation: "Bayon BC3 CUV", bodyType: "SUV", engine: "1.0 T-GDI", fuelType: "Benzin", transmission: "7 ileri DCT", driveType: "4x2", trims: ["Style", "Elite"], sourceUrl: secondarySource, sourceDocument: "Hyundai Eylül 2021 fiyat listesi aktarımı", verifiedLevel: "trusted" },
  { model: "Santa Fe", generation: "Santa Fe TM FL", bodyType: "SUV", engine: "1.6 T-GDI HEV", fuelType: "Hibrit", transmission: "6 ileri Otomatik", driveType: "4x4", trims: ["Progressive"], sourceUrl: secondarySource, sourceDocument: "Hyundai Eylül 2021 fiyat listesi aktarımı", verifiedLevel: "trusted" },
];

export const hyundai2021Variants: VehicleVariant[] = [...officialOffers, ...trustedOffers].flatMap((offer) =>
  offer.trims.map((trim) => ({
    year: 2021,
    yearFrom: 2021,
    yearTo: 2021,
    brand: "Hyundai",
    model: offer.model,
    generation: offer.generation,
    bodyType: offer.bodyType,
    engine: offer.engine,
    fuelType: offer.fuelType,
    transmission: offer.transmission,
    driveType: offer.driveType,
    version: `${offer.engine} · ${offer.transmission} · ${offer.driveType}`,
    trim,
    factoryEquipment: [],
    market: "TR" as const,
    sourceUrl: offer.sourceUrl,
    sourceUrls: offer.verifiedLevel === "trusted" ? [offer.sourceUrl, secondaryCrossCheck] : [offer.sourceUrl],
    sourceDocument: offer.sourceDocument,
    verified: true,
    verifiedLevel: offer.verifiedLevel,
    verificationStatus: "verified" as const,
    verifiedAt: "2026-10-13",
    lastUpdated: "2026-10-13",
  })),
);
