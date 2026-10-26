import assert from "node:assert/strict";
import { getCsvEngineLabels, getCsvFuelTypes, getCsvTransmissions, isCsvCatalogAvailable } from "../services/csvCatalogService";
import { variantsFor } from "../services/vehicleCatalogService";
import { getPackageSuggestions } from "../services/vehiclePackageService";

assert.equal(isCsvCatalogAvailable(), true, "licensed CSV catalog is available");

const focusEngines = getCsvEngineLabels("Ford", "Focus", 2021, "Benzin", "Otomatik");
assert.deepEqual(focusEngines, [
  "1.0L EcoBoost 8AT FWD (125 HP)",
  "1.5L EcoBoost 8AT Star Stop FWD (150 HP)",
  "2.3L EcoBoost 7AT FWD (280 HP)",
]);
assert.deepEqual(getCsvFuelTypes("Ford", "Focus", 2021, "Otomatik"), ["Benzin", "Dizel"]);
assert.deepEqual(getCsvTransmissions("Ford", "Focus", 2021).filter((item) => item.includes("Otomatik")), ["7 ileri Otomatik", "8 ileri Otomatik"]);
assert.deepEqual(getPackageSuggestions("Ford", "Focus"), ["Trend", "Titanium", "ST-Line"]);

assert.ok(variantsFor(2020, "Renault", "Clio").some((item) => item.engine === "1.3 TCe 130 bg" && item.trim === "Icon"));
assert.ok(variantsFor(2017, "Volkswagen", "Golf").some((item) => item.trim === "Comfortline"));
assert.ok(getCsvEngineLabels("Volkswagen", "Golf", 2018, "Benzin", "Otomatik").length > 0, "Golf 2018 licensed technical fallback remains available");
assert.equal(variantsFor(2018, "Volkswagen", "Golf").length, 0, "Golf 2018 is not falsely promoted to the verified TR catalog");

const expectedHyundai2021Models = ["i10", "i20", "Elantra", "Bayon", "Kona", "Tucson", "Santa Fe"];
for (const model of expectedHyundai2021Models) {
  const rows = variantsFor(2021, "Hyundai", model);
  assert.ok(rows.length > 0, `Hyundai ${model} 2021 has source-backed variants`);
  assert.ok(rows.every((row) => row.market === "TR" && row.verificationStatus === "verified"), `Hyundai ${model} 2021 rows are verified for TR`);
}
assert.ok(variantsFor(2021, "Hyundai", "i20").some((row) => row.engine === "1.4 MPI" && row.transmission === "6 ileri Otomatik" && row.trim === "Elite Plus"));
assert.ok(variantsFor(2021, "Hyundai", "Tucson").some((row) => row.engine === "1.6 CRDI" && row.driveType === "4x4" && row.trim === "Elite Plus"));

console.log(JSON.stringify({ focus2021AutomaticPetrolEngines: focusEngines, verifiedFocusTrims: [], packageSuggestionsOnly: getPackageSuggestions("Ford", "Focus") }, null, 2));
console.log("Vehicle option fallback tests passed");
