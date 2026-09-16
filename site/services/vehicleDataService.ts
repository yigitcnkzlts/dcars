import type { VehicleBrand } from "@/types/vehicle";

// Replace this catalog with a database or external vehicle API without changing the UI contract.
export const vehicleBrands: VehicleBrand[] = [
  ["Audi", "A1,A3,A4,A5,A6,A7,A8,Q2,Q3,Q5,Q7,Q8"], ["BMW", "1 Serisi,2 Serisi,3 Serisi,4 Serisi,5 Serisi,7 Serisi,X1,X2,X3,X5,X6"], ["Mercedes-Benz", "A-Serisi,B-Serisi,C-Serisi,E-Serisi,S-Serisi,CLA,GLA,GLB,GLC,GLE"], ["Volkswagen", "Polo,Golf,Jetta,Passat,Arteon,T-Cross,T-Roc,Tiguan,Touareg,Transporter"], ["Toyota", "Corolla,Yaris,C-HR,RAV4,Camry,Land Cruiser"], ["Honda", "Civic,City,CR-V,HR-V"], ["Hyundai", "i10,i20,i30,Accent,Elantra,Bayon,Kona,Tucson,Santa Fe"], ["Kia", "Picanto,Rio,Ceed,Stonic, Sportage,Sorento"], ["Renault", "Clio,Megane,Fluence,Taliant,Captur,Austral,Kadjar,Kangoo"], ["Peugeot", "208,308,408,2008,3008,5008"], ["Citroen", "C3,C4,C5 Aircross,Berlingo"], ["Fiat", "Egea,500,Panda,Tipo,Linea,Doblo,Fiorino"], ["Ford", "Fiesta,Focus,Puma,Kuga,Mustang,Ranger,Transit"], ["Opel", "Corsa,Astra,Insignia,Mokka,Grandland"], ["Skoda", "Fabia,Scala,Octavia,Superb,Kamiq,Karoq,Kodiaq"], ["Seat", "Ibiza,Leon,Arona,Ateca"], ["Cupra", "Formentor,Born,Ateca,Leon"], ["Volvo", "S60,S90,XC40,XC60,XC90"], ["Nissan", "Micra,Juke,Qashqai,X-Trail"], ["Mazda", "Mazda2,Mazda3,CX-3,CX-5"], ["Mitsubishi", "Space Star,ASX,Eclipse Cross,L200"], ["Suzuki", "Swift,Vitara,S-Cross,Jimny"], ["Dacia", "Sandero,Logan,Duster,Jogger"], ["Tesla", "Model 3,Model Y,Model S,Model X"], ["Porsche", "Macan,Cayenne,Panamera,911,Taycan"], ["Land Rover", "Defender,Discovery,Discovery Sport"], ["Range Rover", "Evoque,Velar,Range Rover,Range Rover Sport"], ["Jeep", "Renegade,Compass,Wrangler,Grand Cherokee"], ["Alfa Romeo", "Giulia,Stelvio,Tonale"], ["Lexus", "UX,NX,RX,ES,LS"], ["Mini", "Cooper,Countryman,Clubman"], ["Jaguar", "XE,XF,E-Pace,F-Pace"], ["Subaru", "XV,Forester,Outback"], ["MG", "MG3,ZS,HS,Marvel R"], ["BYD", "Atto 3,Seal,Dolphin"], ["Chery", "Tiggo 7 Pro,Tiggo 8 Pro,Omoda 5"], ["Togg", "T10X,T10F"], ["Chevrolet", "Aveo,Cruze,Captiva,Trax,Camaro"], ["DS Automobiles", "DS 3,DS 4,DS 7,DS 9"], ["Smart", "Fortwo,Forfour,#1,#3"], ["Saab", "9-3,9-5"], ["Maserati", "Ghibli,Quattroporte,Levante,Grecale,GranTurismo"], ["Bentley", "Continental GT,Flying Spur,Bentayga"], ["Lamborghini", "Huracan,Urus,Revuelto"], ["Ferrari", "Roma,Portofino,296,812,Purosangue"], ["Aston Martin", "Vantage,DB11,DB12,DBX"], ["Genesis", "G70,G80,G90,GV60,GV70,GV80"], ["Isuzu", "D-Max,MU-X"], ["SsangYong", "Korando,Musso,Rexton,Tivoli,Torres"],
  ["Abarth", "500,595,695"], ["Acura", "ILX,MDX,RDX,TLX"], ["Aiways", "U5,U6"], ["Alpine", "A110"], ["Anadol", "A1,A2,STC-16"], ["BAIC", "X35,X55"], ["Buick", "Encore,Envision,LaCrosse"], ["Cadillac", "CTS,Escalade,XT5"], ["Chrysler", "300C,PT Cruiser,Voyager"], ["Daewoo", "Lanos,Matiz,Nubira"], ["Daihatsu", "Cuore,Sirion,Terios"], ["Dodge", "Challenger,Charger,Durango,Journey"], ["Geely", "Coolray,Emgrand,Monjaro"], ["Great Wall", "Haval,H6,Poer"], ["Hummer", "H2,H3"], ["Infiniti", "FX,Q30,Q50,QX70"], ["Lada", "Niva,Samara,Vesta"], ["Lancia", "Delta,Ypsilon"], ["Lincoln", "Aviator,Continental,Navigator"], ["Lotus", "Elise,Emira,Evora"], ["Lucid", "Air,Gravity"], ["Maxus", "eDeliver 3,eDeliver 9"], ["McLaren", "570S,720S,Artura"], ["Nio", "ET5,ET7,ES6"], ["Polestar", "2,3,4"], ["Proton", "Gen-2,Saga"], ["Rover", "25,45,75"], ["Seat Cupra", "Leon,Formentor"], ["Seres", "3,5"], ["Skywell", "ET5,HT-i"], ["Tata", "Indica,Indigo,Nexon"], ["TOFAŞ", "Doğan,Kartal,Şahin"], ["Voyah", "Free,Dream"], ["XPeng", "G6,G9,P7"], ["Zeekr", "001,X,7X"]
].map(([name, models]) => ({ name, slug: name.toLowerCase().replaceAll(" ", "-"), models: models.split(",").map((model) => model.trim()) })).sort((a, b) => a.name.localeCompare(b.name, "tr-TR"));

export function getModelsForBrand(brand?: string): string[] {
  const listed = vehicleBrands.find((item) => item.name === brand)?.models ?? [];
  return [...new Set([...listed, ...(additionalModels[brand ?? ""] ?? [])])].sort((a, b) => a.localeCompare(b, "tr-TR"));
}

// Historical model names supplied for Turkey's used-car selection. Technical variants
// are kept separately because a model name alone does not prove year/engine/trim fit.
const additionalModels: Record<string, string[]> = {
  "TOFAŞ": ["Murat 124", "Murat 131"],
  "Renault": ["Renault 9", "Renault 11", "Renault 12", "Renault 19", "Broadway", "Spring", "Fairway", "Flash", "Toros", "Symbol", "Thalia", "Laguna", "Latitude", "Scenic", "Talisman", "Rafale", "Duster"],
  "Fiat": ["Uno", "Tempra", "Palio", "Siena", "Albea", "Marea", "Brava", "Bravo", "Punto", "Grande Punto", "500X", "500L"],
  "Ford": ["Taunus", "Escort", "Fusion", "Mondeo", "B-Max", "C-Max", "S-Max", "Mustang Mach-E", "Courier", "Connect", "Tourneo"],
  "Opel": ["Vectra", "Omega", "Calibra", "Tigra", "Meriva", "Zafira", "Crossland", "Frontera", "Combo"],
  "Volkswagen": ["Bora", "Scirocco", "Beetle", "Eos", "CC", "Taigo", "Tayron", "Caddy", "Caravelle", "Amarok", "ID.3", "ID.4", "ID.5", "ID.7"],
  "Toyota": ["Starlet", "Auris", "Avensis", "Carina", "Corona", "Corolla Cross", "Yaris Cross", "Hilux", "Prius"],
  "Honda": ["Accord", "Jazz", "CR-X", "CR-Z", "Integra", "Prelude", "ZR-V"],
  "Hyundai": ["Excel", "Accent Era", "Accent Blue", "Getz", "Atos", "Sonata", "Coupe", "Matrix", "Ioniq", "Ioniq 5", "Ioniq 6"],
  "Kia": ["Pride", "Cerato", "Sephia", "Shuma", "XCeed", "Niro", "EV3", "EV6", "EV9"],
  "Peugeot": ["106", "205", "206", "207", "301", "306", "307", "405", "406", "407", "508", "4007", "Partner", "Rifter"],
  "Citroen": ["Saxo", "Xsara", "C2", "C3 Aircross", "C4 X", "C5", "C-Elysée", "Ami"],
  "Nissan": ["Almera", "Primera", "Sunny", "Note", "Tiida", "Pathfinder", "Navara", "Patrol", "200SX", "350Z", "370Z", "GT-R"],
  "Skoda": ["Favorit", "Felicia", "Roomster", "Rapid", "Enyaq", "Elroq"],
  "Seat": ["Cordoba", "Toledo", "Altea", "Tarraco"],
  "BMW": ["6 Serisi", "8 Serisi", "Z3", "Z4", "X4", "X7", "i3", "i4", "i5", "i7", "iX1", "iX2", "iX3", "iX"],
  "Mercedes-Benz": ["190", "CLS", "CLK", "SLK", "SLC", "SL", "GLS", "G Serisi", "Vito", "Viano", "V Serisi", "EQA", "EQB", "EQE", "EQS"],
  "Volvo": ["S40", "S70", "S80", "V40", "V50", "V60", "V70", "V90", "C30", "C70", "XC70", "EX30", "EX40", "EX90"],
  "Dacia": ["Sandero Stepway", "Lodgy", "Dokker", "Bigster"],
};
