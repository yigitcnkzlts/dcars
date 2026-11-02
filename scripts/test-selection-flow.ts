/**
 * Araç seçim akışı testi — yıl → marka → model → vites → yakıt → motor → donanım
 * Run: npx tsx scripts/test-selection-flow.ts
 */
import { variantsFor, optionsFor, verifiedOptionsFor } from "../services/vehicleCatalogService";
import { getPackageSuggestions } from "../services/vehiclePackageService";

let pass = 0;
let fail = 0;

function check(label: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ✅ ${label}`);
    pass++;
  } else {
    console.error(`  ❌ FAIL: ${label}${detail ? ` — ${detail}` : ""}`);
    fail++;
  }
}

function frontendTrims(year: number, brand: string, model: string, transmission: string, fuelType: string, engine: string) {
  return [...new Set(variantsFor(year, brand, model)
    .filter((variant) => variant.transmission === transmission && variant.fuelType === fuelType && variant.engine === engine)
    .map((variant) => variant.trim))];
}

// ── Volkswagen Golf — gerçek frontend kaskadı ───────────────────────────────
console.log("\n── Volkswagen Golf 2017 / 2026");
{
  const golf2017 = frontendTrims(2017, "Volkswagen", "Golf", "DSG", "Benzin", "1.4 TSI BMT 125 PS");
  check("2017 1.4 TSI DSG Comfortline görünür", golf2017.includes("Comfortline"), `trims: ${golf2017.join(", ")}`);
  check("2017 1.4 TSI DSG Highline görünür", golf2017.includes("Highline"));
  const golf2026 = frontendTrims(2026, "Volkswagen", "Golf", "DSG", "Hibrit", "1.5 eTSI 150 PS");
  check("2026 1.5 eTSI DSG Style görünür", golf2026.includes("Style"), `trims: ${golf2026.join(", ")}`);
  check("2026 1.5 eTSI DSG R-Line görünür", golf2026.includes("R-Line"));
  check("2026 eTSI altında Impression görünmez", !golf2026.includes("Impression"));
}

// ── Renault Clio — gerçek frontend ve API kaskadı ────────────────────────────
console.log("\n── Renault Clio 2020 / 2021");
{
  const clio2020 = frontendTrims(2020, "Renault", "Clio", "EDC", "Benzin", "1.3 TCe 130 bg");
  check("2020 1.3 TCe EDC Touch görünür", clio2020.includes("Touch"), `trims: ${clio2020.join(", ")}`);
  check("2020 1.3 TCe EDC Icon görünür", clio2020.includes("Icon"));
  check("2020 1.3 TCe EDC Joy görünmez", !clio2020.includes("Joy"));
  const apiTrims = verifiedOptionsFor({ year: 2020, brand: "Renault", model: "Clio", transmission: "EDC", fuelType: "Benzin", engine: "1.3 TCe 130 bg" }, "trim");
  check("catalog-options trim kaynağı Touch/Icon döndürüyor", apiTrims.length === 2 && apiTrims.includes("Touch") && apiTrims.includes("Icon"), `trims: ${apiTrims.join(", ")}`);
  const clio2021 = frontendTrims(2021, "Renault", "Clio", "X-Tronic", "Benzin", "1.0 TCe 90 bg");
  check("2021 X-Tronic Icon görünür", clio2021.includes("Icon"), `trims: ${clio2021.join(", ")}`);
}

// ── Fiat Egea — gerçek frontend kaskadı ──────────────────────────────────────
console.log("\n── Fiat Egea 2020 / 2021");
{
  const egea2020 = frontendTrims(2020, "Fiat", "Egea", "Manuel", "Dizel", "1.3 Multijet 95 HP");
  check("2020 1.3 Multijet Easy görünür", egea2020.includes("Easy"), `trims: ${egea2020.join(", ")}`);
  check("2020 1.3 Multijet Urban Plus görünür", egea2020.includes("Urban Plus"));
  check("2020 1.3 Multijet Mirror görünür", egea2020.includes("Mirror"));
  const egea2021 = frontendTrims(2021, "Fiat", "Egea", "Manuel", "Benzin", "1.0 FireFly 100 HP");
  check("2021 1.0 FireFly Urban görünür", egea2021.includes("Urban"), `trims: ${egea2021.join(", ")}`);
  check("2021 1.0 FireFly Lounge görünür", egea2021.includes("Lounge"));
  check("2021 1.0 FireFly Easy görünmez", !egea2021.includes("Easy"));
}

// ── Hyundai i20 2026 ─────────────────────────────────────────────────────────
console.log("\n── Hyundai i20 2026");
{
  const variants = variantsFor(2026, "Hyundai", "i20");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  check("no unverified", variants.every(v => v.verifiedLevel === "official" || v.verifiedLevel === "trusted"));
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Jump paket mevcut", trims.includes("Jump"), `trims: ${trims.join(", ")}`);
  check("Style paket mevcut", trims.includes("Style"));
  check("Elite paket mevcut", trims.includes("Elite"));
  const trans = optionsFor({ year: 2026, brand: "Hyundai", model: "i20" }, "transmission");
  check("MT ve DCT seçenekleri var", trans.includes("MT") && trans.includes("DCT"), `trans: ${trans.join(", ")}`);
}

// ── Hyundai Tucson 2026 ──────────────────────────────────────────────────────
console.log("\n── Hyundai Tucson 2026");
{
  const variants = variantsFor(2026, "Hyundai", "Tucson");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Comfort paket mevcut", trims.includes("Comfort"));
  check("Prime paket mevcut", trims.includes("Prime"));
  check("Elite paket mevcut", trims.includes("Elite"));
  check("Elite Plus paket mevcut", trims.includes("Elite Plus"));
}

// ── Hyundai Bayon 2026 ───────────────────────────────────────────────────────
console.log("\n── Hyundai Bayon 2026");
{
  const variants = variantsFor(2026, "Hyundai", "Bayon");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Jump paket mevcut", trims.includes("Jump"));
  check("Elite paket mevcut", trims.includes("Elite"));
}

// ── Hyundai Kona 2026 ────────────────────────────────────────────────────────
console.log("\n── Hyundai Kona 2026");
{
  const variants = variantsFor(2026, "Hyundai", "Kona");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Prime paket mevcut", trims.includes("Prime"), `trims: ${trims.join(", ")}`);
}

// ── Hyundai Ioniq 5 2026 ─────────────────────────────────────────────────────
console.log("\n── Hyundai Ioniq 5 2026");
{
  const variants = variantsFor(2026, "Hyundai", "Ioniq 5");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const fuels = [...new Set(variants.map(v => v.fuelType))];
  check("Elektrik yakıt var", fuels.includes("Elektrik"));
}

// ── Nissan Qashqai 2026 ──────────────────────────────────────────────────────
console.log("\n── Nissan Qashqai 2026");
{
  const variants = variantsFor(2026, "Nissan", "Qashqai");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const engines = [...new Set(variants.map(v => v.engine))];
  check("Mild Hybrid 158PS motor var", engines.some(e => e.includes("158 PS")), `engines: ${engines.join(", ")}`);
  check("e-POWER motor var", engines.some(e => e.includes("e-POWER")), `engines: ${engines.join(", ")}`);
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Designpack mevcut", trims.includes("Designpack"));
  check("Platinum Premium mevcut", trims.includes("Platinum Premium"));
  check("Skypack 4x4 mevcut", trims.includes("Skypack 4x4"));
  // e-POWER için kaskad
  const ePowerVariants = variants.filter(v => v.engine.includes("e-POWER"));
  check("e-POWER variants > 0", ePowerVariants.length > 0, `got ${ePowerVariants.length}`);
  const ePowerTrims = [...new Set(ePowerVariants.map(v => v.trim))];
  check("e-POWER Designpack mevcut", ePowerTrims.includes("Designpack"), `e-POWER trims: ${ePowerTrims.join(", ")}`);
}

// ── Nissan Qashqai 2019 ──────────────────────────────────────────────────────
console.log("\n── Nissan Qashqai 2019");
{
  const variants = variantsFor(2019, "Nissan", "Qashqai");
  check("2019 verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Sky Pack mevcut", trims.includes("Sky Pack"));
  check("Visia mevcut", trims.includes("Visia"));
}

// ── Nissan Juke 2026 ─────────────────────────────────────────────────────────
console.log("\n── Nissan Juke 2026");
{
  const variants = variantsFor(2026, "Nissan", "Juke");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Tekna Plus mevcut", trims.includes("Tekna Plus"), `trims: ${trims.join(", ")}`);
  check("Platinum Premium mevcut", trims.includes("Platinum Premium"));
}

// ── Nissan X-Trail 2026 ──────────────────────────────────────────────────────
console.log("\n── Nissan X-Trail 2026");
{
  const variants = variantsFor(2026, "Nissan", "X-Trail");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Platinum mevcut", trims.includes("Platinum"));
}

// ── Renault Clio 2020 ────────────────────────────────────────────────────────
console.log("\n── Renault Clio 2020");
{
  const variants = variantsFor(2020, "Renault", "Clio");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Joy mevcut", trims.includes("Joy"));
  check("Touch mevcut", trims.includes("Touch"));
  check("Icon mevcut", trims.includes("Icon"));
  check("unverified yok", variants.every(v => v.verifiedLevel === "official"));
}

// ── Renault Clio 2026 (Clio VI) ──────────────────────────────────────────────
console.log("\n── Renault Clio 2026");
{
  const variants = variantsFor(2026, "Renault", "Clio");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Evolution Plus mevcut", trims.includes("Evolution Plus"), `trims: ${trims.join(", ")}`);
  check("Esprit Alpine mevcut", trims.includes("Esprit Alpine"));
  const engines = [...new Set(variants.map(v => v.engine))];
  check("TCe 115 bg motor var", engines.some(e => e.includes("TCe 115")), `engines: ${engines.join(", ")}`);
  check("EDC şanzıman var", variants.some(v => v.transmission === "EDC"));
}

// ── Renault Megane 2020 ──────────────────────────────────────────────────────
console.log("\n── Renault Megane 2020");
{
  const variants = variantsFor(2020, "Renault", "Megane");
  check("verified variants > 0", variants.length > 0, `got ${variants.length}`);
  const trims = [...new Set(variants.map(v => v.trim))];
  check("Joy mevcut", trims.includes("Joy"));
  check("Icon mevcut", trims.includes("Icon"));
}

// ── packageSuggestions genişletilmiş mi? ─────────────────────────────────────
console.log("\n── vehiclePackageService genişletme testleri");
{
  check("Hyundai i20 paketleri var", getPackageSuggestions("Hyundai", "i20").length > 0);
  check("Hyundai Tucson paketleri var", getPackageSuggestions("Hyundai", "Tucson").length > 0);
  check("Nissan Juke paketleri var", getPackageSuggestions("Nissan", "Juke").length > 0);
  check("Nissan Qashqai paketleri var", getPackageSuggestions("Nissan", "Qashqai").length > 0);
  check("Renault Clio paketleri var", getPackageSuggestions("Renault", "Clio").includes("Evolution Plus"));
  check("Renault Captur paketleri var", getPackageSuggestions("Renault", "Captur").length > 0);
  check("Volkswagen Golf paketleri var", getPackageSuggestions("Volkswagen", "Golf").length > 0);
  check("Ford Focus paketleri var", getPackageSuggestions("Ford", "Focus").length > 0);
  check("Dacia Duster paketleri var", getPackageSuggestions("Dacia", "Duster").length > 0);
}

// ── Sonuç ─────────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`Sonuç: ${pass} PASS, ${fail} FAIL`);
if (fail > 0) process.exit(1);
