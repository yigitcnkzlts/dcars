"use client";

import { inspectionParts, inspectionStatuses } from "./InspectionDiagram";
import type { InspectionPart, InspectionStatus, VehicleInspection } from "@/types/valuation";

export function InspectionTable({ inspection, selectedPart, onSelect, onChange }: { inspection: VehicleInspection; selectedPart: InspectionPart | null; onSelect: (part: InspectionPart) => void; onChange: (part: InspectionPart, status: InspectionStatus) => void }) {
  return <div className="inspection-list">
    <h3>Ekspertiz Bilgileri</h3><p>Boya ve hasar durumu</p>
    <div className="inspection-table-head"><span>Parça</span>{inspectionStatuses.map((status) => <span key={status}>{status}</span>)}</div>
    <div className="inspection-table-rows">{inspectionParts.map((part) => <div className="inspection-table-row" data-selected={selectedPart === part} key={part} onClick={() => onSelect(part)}>
      <strong>{part}</strong><div className="inspection-table-choices">{inspectionStatuses.map((status) => <label key={status} title={`${part} — ${status}`}><input type="radio" name={part} value={status} checked={inspection[part] === status} onChange={() => { onSelect(part); onChange(part, status); }} /><span>{status}</span></label>)}</div>
    </div>)}</div>
  </div>;
}
