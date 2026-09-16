"use client";

import type { InspectionPart, InspectionStatus, VehicleInspection } from "@/types/valuation";

export const inspectionParts: InspectionPart[] = [
  "Sol Ön Çamurluk", "Sol Ön Kapı", "Sol Arka Kapı", "Sol Arka Çamurluk",
  "Sağ Ön Çamurluk", "Sağ Ön Kapı", "Sağ Arka Kapı", "Sağ Arka Çamurluk",
  "Kaput", "Tavan", "Bagaj", "Ön Tampon", "Arka Tampon",
];
export const inspectionStatuses: InspectionStatus[] = ["Orijinal", "Lokal Boyalı", "Boyalı", "Değişen"];
export const initialInspection = (): VehicleInspection => Object.fromEntries(inspectionParts.map((part) => [part, "Orijinal"])) as VehicleInspection;

const regions: { part: InspectionPart; x: number; y: number; width: number; height: number }[] = [
  { part: "Ön Tampon", x: 91, y: 20, width: 118, height: 31 },
  { part: "Kaput", x: 96, y: 56, width: 108, height: 111 },
  { part: "Sol Ön Çamurluk", x: 53, y: 86, width: 39, height: 86 },
  { part: "Sağ Ön Çamurluk", x: 208, y: 86, width: 39, height: 86 },
  { part: "Sol Ön Kapı", x: 53, y: 179, width: 39, height: 91 },
  { part: "Sağ Ön Kapı", x: 208, y: 179, width: 39, height: 91 },
  { part: "Tavan", x: 98, y: 177, width: 104, height: 190 },
  { part: "Sol Arka Kapı", x: 53, y: 277, width: 39, height: 91 },
  { part: "Sağ Arka Kapı", x: 208, y: 277, width: 39, height: 91 },
  { part: "Sol Arka Çamurluk", x: 53, y: 375, width: 39, height: 91 },
  { part: "Sağ Arka Çamurluk", x: 208, y: 375, width: 39, height: 91 },
  { part: "Bagaj", x: 96, y: 375, width: 108, height: 117 },
  { part: "Arka Tampon", x: 91, y: 498, width: 118, height: 31 },
];

export function InspectionDiagram({ inspection, onChange }: { inspection: VehicleInspection; onChange: (part: InspectionPart, status: InspectionStatus) => void }) {
  const cycle = (part: InspectionPart) => onChange(part, inspectionStatuses[(inspectionStatuses.indexOf(inspection[part]) + 1) % inspectionStatuses.length]);
  return <div className="inspection-visual"><svg viewBox="0 0 300 550" role="group" aria-label="Üstten araç kaporta şeması. Parçaya tıklayarak durumunu değiştirebilirsiniz.">
    <rect className="inspection-outline" x="45" y="12" width="210" height="526" rx="82" />
    {regions.map(({ part, x, y, width, height }) => <g key={part} role="button" tabIndex={0} data-status={inspection[part]} className="inspection-region" aria-label={`${part}: ${inspection[part]}. Değiştirmek için seçin.`} onClick={() => cycle(part)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); cycle(part); } }}><title>{part}: {inspection[part]}</title><rect x={x} y={y} width={width} height={height} rx="11" /></g>)}
    <rect className="inspection-window" x="105" y="177" width="90" height="49" rx="16" />
    <rect className="inspection-window" x="105" y="318" width="90" height="49" rx="16" />
  </svg><div className="inspection-legend">{inspectionStatuses.map((status) => <span key={status} data-status={status}><i />{status}</span>)}</div><p>Şemadaki parçaya dokunarak durumunu değiştirebilir veya sağdaki listeden seçebilirsiniz.</p></div>;
}
