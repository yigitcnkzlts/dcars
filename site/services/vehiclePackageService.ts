// These are selection aids, not an exhaustive year-by-year factory trim catalog.
// Names were checked against Turkish manufacturer model pages and brochures.
const packageSuggestions: Record<string, string[]> = {
  "Toyota|Corolla": ["Vision Plus", "Dream", "Dream X-Pack", "Flame X-Pack", "Passion X-Pack", "Hybrid Dream", "Hybrid Dream X-Pack", "Hybrid Flame X-Pack", "Hybrid Passion X-Pack"],
  "Volkswagen|Golf": ["Impression", "Life", "Style", "R-Line"],
  "Fiat|Egea": ["Easy", "Urban", "Lounge"],
  "Renault|Clio": ["evolution", "evolution plus", "esprit Alpine"],
};

export function getPackageSuggestions(brand: string, model: string): string[] {
  return packageSuggestions[`${brand}|${model}`] ?? [];
}
