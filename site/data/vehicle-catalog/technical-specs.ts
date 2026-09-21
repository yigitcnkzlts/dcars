import type { VehicleVariant } from "./variants";

export type VehicleTechnicalSpecs = {
  bodyType: string; lengthMm: number; widthMm: number; heightMm: number; wheelbaseMm: number;
  cargoLiters: string; curbWeightKg: string; powerHp: number; torqueNm: string; driveType: string;
  acceleration0100: string; topSpeedKph: number; combinedConsumption: string; co2Gkm: string;
  fuelTankLiters: number; seats: number; sourceUrl: string;
};

const corolla2026Source = "https://www.toyota.com.tr/content/dam/toyota/nmsc/turkey/cars/e-brosur/corolla/Corolla-Teknik-ve-Donanim-Ozellikleri-01-2026.pdf";
const qashqai2026Source = "https://www.nissan.com.tr/content/dam/Nissan/turkey/brochures/NISSAN_QASHQAI_BROSUR_260211_WEB.pdf";
const qashqai2019Source = "https://www.nissan.com.tr/content/dam/Nissan/turkey/brochures/Nissan-Qashqai-Brosuru-Haziran-2019.pdf";

export function technicalSpecsFor(car: VehicleVariant): Partial<VehicleTechnicalSpecs> {
  if ([2024, 2026].includes(car.year) && car.brand === "Toyota" && car.model === "Corolla") {
    const hybrid = car.fuelType === "Hibrit";
    return { bodyType: "Sedan", lengthMm: 4630, widthMm: 1780, heightMm: 1435, wheelbaseMm: 2700,
      cargoLiters: "471 lt", curbWeightKg: hybrid ? "1.430–1.500 kg" : "1.370–1.430 kg",
      powerHp: hybrid ? 140 : 125, torqueNm: hybrid ? "142 Nm + 185 Nm elektrik motoru" : "153 Nm",
      driveType: "Önden çekiş", acceleration0100: hybrid ? "9,3 sn" : "11,5 sn", topSpeedKph: hybrid ? 180 : 190,
      combinedConsumption: hybrid ? "4,5–4,7 lt/100 km" : "6,1–6,3 lt/100 km", co2Gkm: hybrid ? "102–106 g/km" : "137–143 g/km",
      fuelTankLiters: hybrid ? 43 : 50, seats: 5, sourceUrl: car.year === 2026 ? corolla2026Source : car.sourceUrl };
  }
  if (car.year === 2026 && car.brand === "Nissan" && car.model === "Qashqai") {
    const fourWheelDrive = car.trim.includes("4x4");
    return { bodyType: "SUV", lengthMm: 4425, widthMm: 1835, heightMm: 1625, wheelbaseMm: 2665,
      cargoLiters: "455–504 lt", curbWeightKg: fourWheelDrive ? "1.500–1.560 kg" : "1.390–1.505 kg", powerHp: 158,
      torqueNm: "270 Nm", driveType: fourWheelDrive ? "4x4" : "4x2", acceleration0100: fourWheelDrive ? "9,9 sn" : "9,2 sn",
      topSpeedKph: fourWheelDrive ? 190 : 199, combinedConsumption: fourWheelDrive ? "7,0 lt/100 km" : "6,4 lt/100 km",
      co2Gkm: fourWheelDrive ? "158 g/km" : "144 g/km", fuelTankLiters: 55, seats: 5, sourceUrl: qashqai2026Source };
  }
  if (car.year === 2019 && car.brand === "Nissan" && car.model === "Qashqai") {
    const petrol = car.fuelType === "Benzin"; const automatic = car.transmission.includes("DCT");
    return { bodyType: "SUV", lengthMm: 4394, widthMm: 1806, heightMm: 1590, wheelbaseMm: 2646, cargoLiters: "401 lt",
      powerHp: petrol ? 160 : 115, torqueNm: petrol && automatic ? "270 Nm" : "260 Nm", driveType: "4x2",
      acceleration0100: petrol ? (automatic ? "10,1 sn" : "8,9 sn") : (automatic ? "13,0 sn" : "12,3 sn"),
      topSpeedKph: petrol ? (automatic ? 198 : 200) : (automatic ? 183 : 181),
      combinedConsumption: petrol ? (automatic ? "6,9 lt/100 km (WLTP)" : "6,81 lt/100 km (WLTP)") : (automatic ? "5,257 lt/100 km (WLTP)" : "5,273 lt/100 km (WLTP)"),
      fuelTankLiters: 55, seats: 5, sourceUrl: qashqai2019Source };
  }
  return { bodyType: car.bodyType, powerHp: car.powerHp, driveType: car.driveType, sourceUrl: car.sourceUrl };
}
