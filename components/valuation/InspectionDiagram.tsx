"use client";

import type { InspectionPart, InspectionStatus, VehicleInspection } from "@/types/valuation";

export const inspectionParts: InspectionPart[] = [
  "Sol Ön Çamurluk", "Sol Ön Kapı", "Sol Arka Kapı", "Sol Arka Çamurluk",
  "Sağ Ön Çamurluk", "Sağ Ön Kapı", "Sağ Arka Kapı", "Sağ Arka Çamurluk",
  "Kaput", "Tavan", "Bagaj", "Ön Tampon", "Arka Tampon",
];
export const inspectionStatuses: InspectionStatus[] = ["Orijinal", "Lokal Boyalı", "Boyalı", "Değişen"];
export const initialInspection = (): VehicleInspection => Object.fromEntries(inspectionParts.map((part) => [part, "Orijinal"])) as VehicleInspection;

const bodyPanels: { part: InspectionPart; path: string }[] = [
  { part: "Ön Tampon", path: "M96 25 Q150 5 204 25 L211 48 Q150 39 89 48 Z" },
  { part: "Kaput", path: "M92 54 Q150 43 208 54 L213 152 Q150 141 87 152 Z" },
  { part: "Sol Ön Çamurluk", path: "M84 62 Q62 66 54 95 L47 173 Q64 158 87 157 L91 75 Z" },
  { part: "Sağ Ön Çamurluk", path: "M216 62 Q238 66 246 95 L253 173 Q236 158 213 157 L209 75 Z" },
  { part: "Sol Ön Kapı", path: "M48 180 L87 164 L91 282 L47 284 Z" },
  { part: "Sağ Ön Kapı", path: "M252 180 L213 164 L209 282 L253 284 Z" },
  { part: "Tavan", path: "M98 169 Q150 153 202 169 L207 380 Q150 397 93 380 Z" },
  { part: "Sol Arka Kapı", path: "M47 291 L91 289 L94 385 L49 391 Z" },
  { part: "Sağ Arka Kapı", path: "M253 291 L209 289 L206 385 L251 391 Z" },
  { part: "Sol Arka Çamurluk", path: "M49 398 L94 392 L89 481 Q61 477 53 455 Z" },
  { part: "Sağ Arka Çamurluk", path: "M251 398 L206 392 L211 481 Q239 477 247 455 Z" },
  { part: "Bagaj", path: "M100 392 Q150 406 200 392 L211 486 Q150 504 89 486 Z" },
  { part: "Arka Tampon", path: "M89 493 Q150 510 211 493 L205 520 Q150 540 95 520 Z" },
];

export function InspectionDiagram({ inspection, selectedPart, onSelect }: { inspection: VehicleInspection; selectedPart: InspectionPart | null; onSelect: (part: InspectionPart) => void }) {
  const counts = inspectionStatuses.map((status) => ({ status, count: inspectionParts.filter((part) => inspection[part] === status).length }));
  return <div className="inspection-visual">
    <div className="inspection-direction">ÖN ↑</div>
    <svg viewBox="0 0 300 550" role="group" aria-label="Üstten otomobil ekspertiz şeması">
      <path className="inspection-silhouette" d="M96 23 Q150 3 204 23 Q235 35 246 69 L259 171 L259 402 L251 468 Q246 502 212 520 Q150 546 88 520 Q54 502 49 468 L41 402 L41 171 L54 69 Q65 35 96 23 Z" />
      {bodyPanels.map(({ part, path }) => <path key={part} d={path} className="inspection-panel" data-status={inspection[part]} data-selected={selectedPart === part} role="button" tabIndex={0} aria-label={`${part} — ${inspection[part]}. Durum seçmek için açın.`} onClick={() => onSelect(part)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(part); } }}><title>{part} — {inspection[part]}</title></path>)}
      <path className="inspection-glass" d="M104 179 Q150 164 196 179 L198 233 Q150 220 102 233 Z" />
      <path className="inspection-glass" d="M100 337 Q150 350 200 337 L202 371 Q150 387 98 371 Z" />
      <path className="inspection-glass-detail" d="M111 244 L189 244 M111 325 L189 325" />
      <path className="inspection-light" d="M99 63 L121 59 M179 59 L201 63 M99 510 L120 515 M180 515 L201 510" />
    </svg>
    <div className="inspection-legend">{counts.map(({ status, count }) => <span key={status} data-status={status}><i />{count} {status}</span>)}</div>
    <p>Parçaya dokunun; durumunu sağdaki tablodan seçin.</p>
  </div>;
}
