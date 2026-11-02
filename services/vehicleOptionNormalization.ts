const normalize = (value: string) => value
  .toLocaleLowerCase("tr-TR")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim();

export type TransmissionCategory = "automatic" | "manual" | "electric" | "other";

export function transmissionCategory(value: string): TransmissionCategory {
  const normalized = normalize(value);
  if (/otomatik|automatic|\bat\b|dct|dsg|edc|cvt|powershift/.test(normalized)) return "automatic";
  if (/manuel|manual|\bmt\b/.test(normalized)) return "manual";
  if (/tek hiz|single.speed|electric/.test(normalized)) return "electric";
  return "other";
}
export function transmissionMatches(actual: string, selected?: string): boolean {
  if (!selected) return true;
  if (normalize(actual) === normalize(selected)) return true;
  const selectedCategory = transmissionCategory(selected);
  return selectedCategory !== "other" && transmissionCategory(actual) === selectedCategory;
}
