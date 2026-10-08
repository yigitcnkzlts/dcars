/**
 * vehiclePackageService.ts
 *
 * Donanım paketi önerileri — verifiedVariants'ta doğrulanmış kayıt
 * bulunamayan araçlar için yedek seçenek listesi sunar.
 *
 * ÖNEMLI: Bu listeler "selection aid" niteliğindedir.
 * Belirli bir yıl+motor+şanzıman kombinasyonunun üretici belgesiyle
 * doğrulandığı anlamına gelmez. Her modelin aktif dönemine
 * uygun paketler listelenmiştir.
 *
 * Doğrulanmış kombinasyonlar verifiedVariants üzerinden gelir;
 * bu servis yalnızca eşleşme yoksa devreye girer.
 */

// [marka|model]: paket adları
const packageSuggestions: Record<string, string[]> = {

  // ── Hyundai ──────────────────────────────────────────────────────────────
  "Hyundai|Accent":       ["GLS", "Style"],
  "Hyundai|Accent Era":   ["Team", "Select", "Style", "Mode"],
  "Hyundai|Accent Blue":  ["Mode", "Style", "Prime"],
  "Hyundai|Getz":         ["GL", "GLS"],
  "Hyundai|i10":          ["Jump", "Style", "Elite"],
  "Hyundai|i20":          ["Jump", "Style", "Elite"],
  "Hyundai|i20 Active":   ["Style"],
  "Hyundai|i20 N":        ["N"],
  "Hyundai|i30":          ["Comfort", "Prime", "Elite"],
  "Hyundai|i30 Fastback": ["Prime", "Elite"],
  "Hyundai|Elantra":      ["Style", "Elite"],
  "Hyundai|Sonata":       ["Style", "Prime", "Elite"],
  "Hyundai|Matrix":       ["GL", "GLS"],
  "Hyundai|ix20":         ["Comfort", "Style"],
  "Hyundai|ix35":         ["Style", "Elite"],
  "Hyundai|Tucson":       ["Comfort", "Prime", "Elite", "Elite Plus"],
  "Hyundai|Santa Fe":     ["Comfort", "Prime", "Elite", "Progressive"],
  "Hyundai|Bayon":        ["Jump", "Style", "Elite"],
  "Hyundai|Kona":         ["Prime", "Elite"],
  "Hyundai|Inster":       ["Dynamic", "Advance", "Cross Advance"],
  "Hyundai|Ioniq":        ["Comfort", "Prime", "Elite"],
  "Hyundai|Ioniq 5":      ["Dynamic Vision Roof", "Progressive", "N"],
  "Hyundai|Ioniq 6":      ["Advance", "Progressive"],
  "Hyundai|Ioniq 9":      ["Progressive", "Calligraphy"],
  "Hyundai|Staria":       ["Comfort", "Elite"],
  "Hyundai|H-1":          ["Comfort", "Elite"],
  "Hyundai|Coupe":        ["FX", "GLS"],
  "Hyundai|Veloster":     ["Style", "Elite"],

  // ── Nissan ───────────────────────────────────────────────────────────────
  "Nissan|Micra":    ["Visia", "Acenta", "Tekna", "Platinum"],
  "Nissan|Note":     ["Visia", "Acenta", "Tekna"],
  "Nissan|Almera":   ["Comfort", "Tekna"],
  "Nissan|Primera":  ["Elegance", "Tekna"],
  "Nissan|Sunny":    ["LX", "SLX"],
  "Nissan|Tiida":    ["Visia", "Tekna"],
  "Nissan|Pulsar":   ["Visia", "Acenta", "Tekna"],
  "Nissan|Juke":     ["Tekna Plus", "Platinum", "Platinum Premium"],
  "Nissan|Qashqai":  ["Designpack", "Skypack", "N-Design", "Platinum", "Platinum Premium"],
  "Nissan|X-Trail":  ["Visia", "Tekna", "Platinum", "Platinum Premium"],
  "Nissan|Pathfinder": ["SE", "LE", "Platinum"],
  "Nissan|Murano":   ["SE", "LE", "Platinum"],
  "Nissan|Navara":   ["Visia", "Tekna", "Platinum"],
  "Nissan|Patrol":   ["SE", "LE", "Platinum"],
  "Nissan|350Z":     ["Touring", "Track"],
  "Nissan|370Z":     ["GT", "Nismo"],
  "Nissan|GT-R":     ["Premium", "Track Edition", "Nismo"],
  "Nissan|Leaf":     ["Visia", "Acenta", "Tekna"],
  "Nissan|Ariya":    ["Advance", "Evolve"],
  "Nissan|Townstar": ["Visia", "Tekna", "Tekna+", "Designpack", "Platinum"],

  // ── Renault ──────────────────────────────────────────────────────────────
  "Renault|Clio":          ["Joy", "Touch", "Icon", "Evolution Plus", "Esprit Alpine"],
  "Renault|Clio Sport Tourer": ["Joy", "Touch", "Icon"],
  "Renault|Symbol":        ["Joy", "Touch"],
  "Renault|Thalia":        ["Authentique", "Expression", "Dynamique"],
  "Renault|Megane":        ["Joy", "Touch", "Icon"],
  "Renault|Megane E-Tech": ["Evolution", "Techno", "Iconic"],
  "Renault|Fluence":       ["Touch", "Icon"],
  "Renault|Taliant":       ["Joy", "Touch"],
  "Renault|Captur":        ["Joy", "Touch", "Icon", "Techno", "Esprit Alpine"],
  "Renault|Kadjar":        ["Touch", "Icon"],
  "Renault|Austral":       ["Techno", "Esprit Alpine"],
  "Renault|Arkana":        ["Evolution", "Techno", "Esprit Alpine"],
  "Renault|Duster":        ["Evolution", "Techno", "Esprit Alpine"],
  "Renault|Koleos":        ["Dynamique", "Privilege", "Icon"],
  "Renault|Scenic":        ["Techno", "Esprit Alpine"],
  "Renault|Laguna":        ["Expression", "Dynamique", "Privilege"],
  "Renault|Latitude":      ["Expression", "Privilege"],
  "Renault|Talisman":      ["Touch", "Icon"],
  "Renault|Rafale":        ["Techno", "Esprit Alpine", "Atelier Alpine"],
  "Renault|Kangoo":        ["Touch", "Icon"],
  "Renault|Zoe":           ["Life", "Zen", "Intens"],
  "Renault|R5 E-Tech":     ["Evolution", "Techno", "Iconic"],
  "Renault|Symbioz":       ["Evolution", "Techno", "Esprit Alpine"],

  // ── Toyota ───────────────────────────────────────────────────────────────
  "Toyota|Corolla":  ["Vision Plus", "Dream", "Dream X-Pack", "Flame X-Pack", "Passion X-Pack",
                      "Hybrid Dream", "Hybrid Dream X-Pack", "Hybrid Flame X-Pack", "Hybrid Passion X-Pack"],
  "Toyota|Yaris":    ["Comfort", "Dream", "Flame"],
  "Toyota|C-HR":     ["Comfort", "Style", "Prime"],
  "Toyota|Hilux":    ["Comfort", "Style"],
  "Toyota|RAV4":     ["Comfort", "Prime", "Passion"],

  // ── Volkswagen ───────────────────────────────────────────────────────────
  "Volkswagen|Polo":   ["Trendline", "Comfortline", "Highline", "R-Line"],
  "Volkswagen|Golf":   ["Impression", "Life", "Style", "R-Line", "GTI"],
  "Volkswagen|Tiguan": ["Life", "Elegance", "R-Line"],
  "Volkswagen|Taigo":  ["Life", "Style", "R-Line"],
  "Volkswagen|Passat": ["Trendline", "Comfortline", "Highline"],
  "Volkswagen|T-Roc":  ["Life", "Style", "R-Line"],

  // ── Fiat ─────────────────────────────────────────────────────────────────
  "Fiat|Egea":   ["Easy", "Urban", "Lounge", "Cross Urban", "Cross Lounge"],
  "Fiat|500":    ["Pop", "Lounge", "Dolcevita"],
  "Fiat|Tipo":   ["Easy", "Pop", "Lounge"],
  "Fiat|Panda":  ["Pop", "Easy", "Lounge"],

  // ── Opel ─────────────────────────────────────────────────────────────────
  "Opel|Corsa":     ["Edition", "GS", "Elegance"],
  "Opel|Astra":     ["Edition", "GS", "Elegance"],
  "Opel|Mokka":     ["Edition", "GS", "Elegance"],
  "Opel|Grandland": ["Edition", "GS", "Elegance"],
  "Opel|Crossland": ["Edition", "GS", "Elegance"],
  "Opel|Frontera":  ["Edition", "GS"],

  // ── Peugeot ──────────────────────────────────────────────────────────────
  "Peugeot|208":  ["Active", "Allure", "GT"],
  "Peugeot|308":  ["Active", "Allure", "GT"],
  "Peugeot|2008": ["Active", "Allure", "GT"],
  "Peugeot|3008": ["Active", "Allure", "GT"],
  "Peugeot|5008": ["Active", "Allure", "GT"],

  // ── Citroën ──────────────────────────────────────────────────────────────
  "Citroen|C3":         ["Live", "Shine", "MAX"],
  "Citroen|C4":         ["Live", "Shine", "YOU", "MAX"],
  "Citroen|C4 X":       ["Live", "Shine", "YOU", "MAX"],
  "Citroen|C5 Aircross": ["Live", "Shine", "MAX"],

  // ── BMW ──────────────────────────────────────────────────────────────────
  "BMW|1 Serisi": ["Standart", "M Sport"],
  "BMW|2 Serisi": ["Standart", "M Sport"],
  "BMW|3 Serisi": ["Standart", "M Sport", "M Sport Pro"],
  "BMW|4 Serisi": ["Standart", "M Sport", "Edition M Sport"],
  "BMW|5 Serisi": ["Standart", "M Sport"],
  "BMW|X1":       ["Standart", "M Sport"],
  "BMW|X3":       ["Standart", "M Sport"],
  "BMW|X5":       ["Standart", "M Sport"],

  // ── Mercedes-Benz ────────────────────────────────────────────────────────
  "Mercedes-Benz|A-Serisi": ["Progressive", "AMG Line"],
  "Mercedes-Benz|C-Serisi": ["Progressive", "Avantgarde", "AMG Line"],
  "Mercedes-Benz|E-Serisi": ["Avantgarde", "Exclusive", "AMG Line"],
  "Mercedes-Benz|GLA":      ["Progressive", "AMG Line"],
  "Mercedes-Benz|GLC":      ["Progressive", "Avantgarde", "AMG Line"],

  // ── Seat / Cupra ─────────────────────────────────────────────────────────
  "Seat|Ibiza":  ["Style", "FR"],
  "Seat|Leon":   ["Style", "FR", "FR Plus"],
  "Seat|Ateca":  ["Style", "FR"],
  "Cupra|Formentor": ["Standard", "VZ", "Supreme"],
  "Cupra|Leon":      ["VZ-Line", "Supreme"],

  // ── Skoda ────────────────────────────────────────────────────────────────
  "Skoda|Fabia":   ["Active", "Ambition", "Style"],
  "Skoda|Octavia": ["Active", "Ambition", "Style"],
  "Skoda|Karoq":   ["Active", "Ambition", "Style"],
  "Skoda|Kodiaq":  ["Active", "Ambition", "Style"],

  // ── Diğer ────────────────────────────────────────────────────────────────
  "Dacia|Duster":   ["Essential", "Expression", "Extreme"],
  "Dacia|Sandero":  ["Essential", "Expression", "Extreme"],
  "Dacia|Jogger":   ["Essential", "Expression", "Extreme"],
  "Ford|Fiesta":    ["Trend", "Titanium", "ST-Line"],
  "Ford|Focus":     ["Trend", "Titanium", "ST-Line"],
  "Ford|Puma":      ["Trend", "Titanium", "ST-Line"],
  "Ford|Kuga":      ["Trend", "Titanium", "ST-Line"],
  "Honda|Civic":    ["Comfort", "Style", "Elegance"],
  "Kia|Sportage":   ["Comfort", "Vision", "Prestige"],
  "Kia|Ceed":       ["Comfort", "Vision", "Prestige"],
  "Mazda|Mazda 3":  ["Comfort", "Style", "Homura"],
  "Suzuki|Vitara":  ["GL+", "GLX"],
  "Mini|Cooper":    ["Classic", "Favourite", "JCW"],
};

export function getPackageSuggestions(brand: string, model: string): string[] {
  return packageSuggestions[`${brand}|${model}`] ?? [];
}
