"use client";

const shots = ["Önden görünüm", "Arkadan görünüm", "Sol yan", "Sağ yan", "Ön iç konsol", "Kilometre göstergesi"];

export function PhotoGuide({ areas, hasDamage }: { areas: string[]; hasDamage: boolean }) {
  const wanted = hasDamage ? [...shots, "Hasarlı bölge"] : shots;
  return <div className="photo-guide"><strong>Fotoğraf çekim rehberi</strong><p>Aracı gün ışığında, tamamı kadraja sığacak şekilde çekin. Plaka ve kişisel belgeleri kapatabilirsiniz.</p><div className="photo-guide__items">{wanted.map((area, index) => <span key={area} data-done={areas.includes(area)}><b>{areas.includes(area) ? "✓" : index + 1}</b>{area}</span>)}</div><small>{wanted.filter((area) => areas.includes(area)).length}/{wanted.length} önerilen açı eklendi · Fotoğraf eklemek isteğe bağlıdır.</small></div>;
}
