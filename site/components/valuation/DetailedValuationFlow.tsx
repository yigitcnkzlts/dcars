"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import Link from "@/components/layout/NativeLink";
import { ArrowLeft, ArrowRight, Camera, Check } from "lucide-react";
import { VehicleSelectionSteps, versionLabel } from "./VehicleSelectionSteps";
import { InspectionDiagram, initialInspection, inspectionParts } from "./InspectionDiagram";
import { InspectionTable } from "./InspectionTable";
import { PhotoGuide } from "./PhotoGuide";
import { selectedVariant, type VehicleSelection } from "@/services/vehicleCatalogService";
import { updateVehicleSelection, selectionFields } from "@/services/vehicleSelectionState";
import type { ContactMethod, InspectionPart, InspectionStatus, ValuationRequest, VehicleInspection } from "@/types/valuation";
import type { VehicleContext } from "@/types/vehicle";

const steps = ["Araç Bilgileri", "Kilometre ve Ekspertiz", "Ön Değerleme", "Randevu"];
const equipmentOptions = ["Koltuk ısıtma", "Koltuk soğutma", "Direksiyon ısıtma", "Elektrikli koltuk", "Hafızalı koltuk", "Panoramik cam tavan", "Sunroof", "Adaptif hız sabitleyici", "Kör nokta uyarısı", "360 derece kamera", "Geri görüş kamerası", "Park sensörü", "Head-up display", "Premium ses sistemi", "Anahtarsız giriş", "Elektrikli bagaj", "Matrix LED far", "Diğer"];
const photoAreas = ["Önden görünüm", "Arkadan görünüm", "Sağ yan", "Sol yan", "Ön iç konsol", "Koltuklar", "Kilometre göstergesi", "Motor bölümü", "Hasarlı bölge", "Ek fotoğraflar"];
const draftKey = "dcars-detailed-valuation-v1";
type Photo = { file: File; url: string; area: string };
type ContactState = { firstName: string; lastName: string; phone: string; email: string; city: string; plate: string; saleTiming: string; customerNotes: string; callRequested: boolean; preferredContactMethod: ContactMethod; preferredContactTime: string };
type Draft = { selection: Partial<VehicleSelection>; mileage: string; color: string; accidentStatus: string; damageAmount: string; severeDamage: string; sunroof: string; chassisWork: string; mechanicalIssue: string; damageNotes: string; equipmentNotes: string; inspection: VehicleInspection; optionalEquipment: string[] };
const initialDraft = (): Draft => ({ selection: {}, mileage: "", color: "", accidentStatus: "", damageAmount: "", severeDamage: "", sunroof: "", chassisWork: "", mechanicalIssue: "", damageNotes: "", equipmentNotes: "", inspection: initialInspection(), optionalEquipment: [] });
const digits = (value: string) => value.replace(/\D/g, "").slice(0, 9);
const formatNumber = (value: string) => value ? new Intl.NumberFormat("tr-TR").format(Number(value)) : "";

function phaseFromDraft(draft: Draft) {
  const { selection, color } = draft;
  if (!selection.year) return 0;
  if (!selection.brand) return 1;
  if (!selection.model) return 2;
  if (!selection.transmission) return 3;
  if (!selection.fuelType) return 4;
  if (!selection.engine) return 5;
  if (!selection.trim) return 5;
  if (!color) return 6;
  return 6;
}

export function DetailedValuationFlow({ onVehicleChange }: { onVehicleChange?: (vehicle: VehicleContext) => void }) {
  const [step, setStep] = useState(0);
  const [vehiclePhase, setVehiclePhase] = useState(0);
  const [selectedPart, setSelectedPart] = useState<InspectionPart | null>(null);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [contact, setContact] = useState<ContactState>({ firstName: "", lastName: "", phone: "", email: "", city: "", plate: "", saleTiming: "", customerNotes: "", callRequested: false, preferredContactMethod: "Telefon", preferredContactTime: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const photoUrls = useRef<string[]>([]);
  const draftRestored = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const startFresh = new URLSearchParams(window.location.search).get("new") === "1";
        const params = new URLSearchParams(window.location.search);
        if (startFresh) {
          localStorage.removeItem(draftKey);
          window.history.replaceState({}, "", window.location.pathname);
        }
        const saved = startFresh ? null : localStorage.getItem(draftKey);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<Draft>;
          const next = { ...initialDraft(), ...parsed, inspection: { ...initialInspection(), ...parsed.inspection } };
          setDraft(next);
          setVehiclePhase(phaseFromDraft(next));
        } else {
          const year = Number(params.get("year"));
          const brand = params.get("brand") ?? "";
          const seeded = { ...initialDraft(), selection: { ...(Number.isInteger(year) && year >= 1985 ? { year } : {}), ...(brand ? { brand } : {}) } };
          setDraft(seeded);
          setVehiclePhase(brand ? 2 : year ? 1 : 0);
          setStep(0);
        }
      } catch { /* Invalid drafts start fresh. */ }
      draftRestored.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => { if (draftRestored.current && !requestId) { try { localStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* Storage may be disabled. The form still works. */ } } }, [draft, requestId]);
  useEffect(() => { onVehicleChange?.({ year: draft.selection.year, brand: draft.selection.brand, model: draft.selection.model, engine: draft.selection.engine, fuelType: draft.selection.fuelType, transmission: draft.selection.transmission, trim: draft.selection.trim, mileage: draft.mileage === "" ? undefined : Number(draft.mileage) }); }, [draft.selection, draft.mileage, onVehicleChange]);
  useEffect(() => () => { photoUrls.current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  const previousScreen = useRef("0:0");
  useEffect(() => {
    const screen = step + ":" + vehiclePhase;
    if (screen === previousScreen.current) return;
    previousScreen.current = screen;
    const heading = document.querySelector<HTMLElement>("[data-selection-heading], .detailed-stage__title h3");
    heading?.focus({ preventScroll: true });
    document.getElementById("teklif-formu")?.scrollIntoView({ block: "start" });
  }, [step, vehiclePhase]);

  const { selection, inspection } = draft;
  const variant = selectedVariant(selection);
  const setSelection = (field: keyof VehicleSelection, value: string | number) => {
    setDraft((current) => ({ ...current, selection: updateVehicleSelection(current.selection, field, value), color: "" }));
    if (value) {
      const nextPhase = field === "engine" ? 5 : selectionFields.findIndex((item) => item === field) + 1;
      setVehiclePhase(Math.min(nextPhase, 6));
    }
    setError("");
  };
  const chooseVersion = (chosen: NonNullable<typeof variant>) => {
    setDraft((current) => ({ ...current, selection: { ...current.selection, generation: chosen.generation, engine: chosen.engine, fuelType: chosen.fuelType, transmission: chosen.transmission, version: chosen.version, trim: chosen.trim } }));
    setVehiclePhase(6);
    setError("");
  };
  const chooseFallbackVersion = (transmission: string, trim: string) => {
    setVehiclePhase(6);
    setDraft((current) => ({ ...current, selection: { ...current.selection, generation: undefined, engine: current.selection.engine ?? "Belirtilmedi", transmission, version: trim, trim } }));
    setError("");
  };
  const setInspection = (part: InspectionPart, status: InspectionStatus) => setDraft((current) => ({ ...current, inspection: { ...current.inspection, [part]: status } }));

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    if (photos.length + incoming.length > 15) { setError("En fazla 15 fotoğraf ekleyebilirsiniz."); return; }
    if (incoming.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size === 0 || file.size > 4 * 1024 * 1024)) { setError("JPG, PNG veya WebP biçiminde, 4 MB altındaki fotoğrafları seçin."); return; }
    setPhotos((current) => { const used = new Set(current.map((photo) => photo.area)); return [...current, ...incoming.map((file) => { const url = URL.createObjectURL(file); photoUrls.current.push(url); const suggested = photoAreas.find((area) => area !== "Diğer" && !used.has(area)) ?? "Diğer"; used.add(suggested); return { file, url, area: suggested }; })]; });
    setError("");
  };
  const removePhoto = (url: string) => { URL.revokeObjectURL(url); photoUrls.current = photoUrls.current.filter((item) => item !== url); setPhotos((current) => current.filter((item) => item.url !== url)); };

  const next = () => {
    if (step === 0 && vehiclePhase < 6) {
      const missingSelection = vehiclePhase === 5 ? !selection.engine || !selection.trim : !selection[selectionFields[vehiclePhase]];
      if (missingSelection) { setError(vehiclePhase === 5 ? "Devam etmek için motor ve versiyon / donanım seçin." : "Devam etmek için bir seçenek seçin."); return; }
      setVehiclePhase((current) => current + 1); setError(""); return;
    }
    if (step === 0 && (!selection.year || !selection.brand || !selection.model || !selection.transmission || !selection.fuelType || !selection.engine || !selection.trim || !draft.color)) { setError("Araç bilgilerini ve rengini tamamlayın."); return; }
    if (step === 1 && (!draft.mileage || !draft.accidentStatus || !draft.severeDamage || !draft.sunroof || !draft.chassisWork || !draft.mechanicalIssue)) { setError("Kilometre, tramer, tavan, şasi ve mekanik durum alanlarını tamamlayın."); return; }
    if (step === 1 && draft.accidentStatus === "Var" && draft.damageAmount && !/^\d+$/.test(draft.damageAmount)) { setError("Hasar tutarını yalnızca rakamla girin."); return; }
    if (step === 2) {
      const phone = contact.phone.replace(/\s/g, "");
      if (!contact.firstName.trim() || !contact.lastName.trim() || !contact.city.trim() || !contact.saleTiming || !/^0?5\d{9}$/.test(phone) || (contact.email.trim() && !/^\S+@\S+\.\S+$/.test(contact.email.trim()))) { setError("Ad, soyad, şehir, satış zamanı ve geçerli cep telefonu girin."); return; }
      if (!agreed) { setError("Devam etmek için aydınlatma metnini okuyup onaylayın."); return; }
    }
    setError(""); setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const submit = async () => {
    const phone = contact.phone.replace(/\s/g, "");
    if (!contact.firstName.trim() || !contact.lastName.trim() || !contact.city.trim() || !contact.saleTiming || !/^0?5\d{9}$/.test(phone) || (contact.email.trim() && !/^\S+@\S+\.\S+$/.test(contact.email.trim()))) { setError("Ad, soyad, şehir, satış zamanı, geçerli cep telefonu girin. E-posta yazdıysanız adresi kontrol edin."); return; }
    if (!agreed) { setError("Devam etmek için aydınlatma metnini okuyup onaylayın."); return; }
    setSending(true); setError("");
    const payload: ValuationRequest = {
      year: selection.year, brand: selection.brand, model: selection.model, generation: selection.generation, catalogMatched: Boolean(variant), engine: selection.engine,
      fuelType: selection.fuelType, transmission: selection.transmission, version: selection.version, trim: selection.trim,
      mileage: Number(draft.mileage), color: draft.color, accidentStatus: draft.accidentStatus, damageAmount: draft.damageAmount, severeDamage: draft.severeDamage,
      sunroof: draft.sunroof, chassisWork: draft.chassisWork, mechanicalIssue: draft.mechanicalIssue, damageNotes: draft.damageNotes,
      inspection, optionalEquipment: draft.optionalEquipment, equipmentNotes: draft.equipmentNotes, factoryEquipment: variant?.factoryEquipment ?? [],
      firstName: contact.firstName.trim(), lastName: contact.lastName.trim(), phone, email: contact.email.trim(),
      preferredContactMethod: contact.preferredContactMethod, preferredContactTime: contact.preferredContactTime, city: contact.city.trim(), plate: contact.plate.trim(), saleTiming: contact.saleTiming, callRequested: contact.callRequested,
      customerNotes: contact.customerNotes.trim(),
    };
    try {
      const body = new FormData(); body.set("payload", JSON.stringify(payload));
      photos.forEach((photo, index) => { body.append("photos", photo.file); body.set(`photoArea${index}`, photo.area); });
      const response = await fetch("/api/valuation", { method: "POST", body });
      const result = await response.json() as { id?: number; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error || "Başvuru gönderilemedi.");
      try { localStorage.removeItem(draftKey); } catch { /* Submission already succeeded. */ } setRequestId(result.id);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Bağlantı kurulamadı. Tekrar deneyin."); }
    finally { setSending(false); }
  };

  if (requestId) {
    return (
      <section className="detailed-success" id="teklif-formu">
        <div className="success-mark"><Check /></div>
        <span className="vehicle-eyebrow">BAŞVURU ALINDI</span>
        <h2>Bilgileriniz değerlendirmeye alındı.</h2>
        <p>Başvuru numaranız <strong>#{requestId}</strong>. Tercih ettiğiniz iletişim yöntemiyle size dönüş yapılacak; nihai teklif incelemeden sonra netleşecek.</p>
        <Link className="button button--primary" href="/basvuru-takip">Başvurumu kontrol et <ArrowRight size={17} /></Link>
      </section>
    );
  }

  return (
    <section className="detailed-flow" id="teklif-formu" aria-labelledby="detailed-title">
      <h2 id="detailed-title" className="sr-only">Araç değerleme başvurusu</h2>
      <nav className="detailed-stepper" aria-label="Başvuru adımları">
        {steps.map((name, index) => (
          <button type="button" key={name} disabled={index >= step} aria-current={index === step ? "step" : undefined} onClick={() => { setStep(index); setError(""); }}>
            <b>{index + 1}</b><span>{name}</span>
          </button>
        ))}
      </nav>
      <div className="detailed-panel">
        {step === 0 && (
          <div className="detailed-stage">
            <VehicleSelectionSteps
              key={vehiclePhase}
              phase={vehiclePhase}
              selection={selection}
              color={draft.color}
              onColor={(color) => { setDraft((current) => ({ ...current, color })); setStep(1); setError(""); }}
              onSelect={setSelection}
              onVariant={chooseVersion}
              onFallbackVersion={chooseFallbackVersion}
              onChangePhase={(phase) => { setVehiclePhase(phase); setError(""); }}
            />
          </div>
        )}
        {step === 1 && (
          <div className="detailed-stage">
            <StageTitle title="Kilometre ve ekspertiz" text="Bildiklerinizi işaretleyin. Emin olmadığınız parçalar için mevcut durumu değiştirmeyin." />
            <div className="detailed-facts">
              <label className="valuation-field">
                <span>Kilometre *</span>
                <div className="number-input">
                  <input inputMode="numeric" value={formatNumber(draft.mileage)} onChange={(event) => setDraft((current) => ({ ...current, mileage: digits(event.target.value) }))} placeholder="85.000" />
                  <span>km</span>
                </div>
              </label>
              <fieldset className="choice-pills">
                <legend>Tramer kaydı *</legend>
                {["Yok", "Var", "Bilmiyorum"].map((option) => (
                  <label key={option}>
                    <input type="radio" name="accident" checked={draft.accidentStatus === option} onChange={() => setDraft((current) => ({ ...current, accidentStatus: option, damageAmount: option === "Var" ? current.damageAmount : "" }))} />
                    {option}
                  </label>
                ))}
              </fieldset>
              {draft.accidentStatus === "Var" && (
                <label className="valuation-field">
                  <span>Hasar tutarı (biliniyorsa)</span>
                  <div className="number-input">
                    <input inputMode="numeric" value={formatNumber(draft.damageAmount)} onChange={(event) => setDraft((current) => ({ ...current, damageAmount: digits(event.target.value) }))} placeholder="Örn. 25.000" />
                    <span>₺</span>
                  </div>
                </label>
              )}
            </div>
            <fieldset className="severe-box">
              <legend>Aracınızda ağır hasar (pert) kaydı bulunuyor mu?</legend>
              <div className="choice-pills">
                {["Yok", "Var", "Bilmiyorum"].map((option) => (
                  <label key={option}>
                    <input type="radio" name="severe" checked={draft.severeDamage === option} onChange={() => setDraft((current) => ({ ...current, severeDamage: option }))} />
                    {option}
                  </label>
                ))}
              </div>
              {draft.severeDamage === "Var" && <p>Ağır hasar kaydı teklif sürecini ve nihai tutarı etkiler. Bu bilgi inceleme sırasında doğrulanır.</p>}
            </fieldset>
            <div className="condition-grid">
              <ChoiceField label="Sunroof / cam tavan *" name="sunroof" value={draft.sunroof} options={["Yok", "Sunroof", "Panoramik cam tavan", "Bilmiyorum"]} onChange={(sunroof) => setDraft((current) => ({ ...current, sunroof }))} />
              <ChoiceField label="Şasi / podye işlemi *" name="chassis" value={draft.chassisWork} options={["Yok", "Var", "Bilmiyorum"]} onChange={(chassisWork) => setDraft((current) => ({ ...current, chassisWork }))} />
              <ChoiceField label="Mekanik arıza *" name="mechanical" value={draft.mechanicalIssue} options={["Yok", "Var", "Bilmiyorum"]} onChange={(mechanicalIssue) => setDraft((current) => ({ ...current, mechanicalIssue }))} />
            </div>
            <div className="inspection-layout">
              <InspectionDiagram inspection={inspection} selectedPart={selectedPart} onSelect={setSelectedPart} />
              <InspectionTable inspection={inspection} selectedPart={selectedPart} onSelect={setSelectedPart} onChange={setInspection} />
            </div>
            <details className="detailed-equipment">
              <summary>Ek donanımlar <small>İsteğe bağlı</small></summary>
              <p>Aracınızda bulunanları işaretleyin. Bunlar fabrika paketinin doğrulanmış donanımı olarak değerlendirilmez.</p>
              <div>
                {equipmentOptions.map((item) => (
                  <label key={item}>
                    <input type="checkbox" checked={draft.optionalEquipment.includes(item)} onChange={(event) => setDraft((current) => ({ ...current, optionalEquipment: event.target.checked ? [...current.optionalEquipment, item] : current.optionalEquipment.filter((existing) => existing !== item) }))} />
                    {item}
                  </label>
                ))}
              </div>
              <label className="valuation-field equipment-notes">
                <span>Aracınızın ek donanımlarını belirtin</span>
                <textarea value={draft.equipmentNotes} maxLength={1200} onChange={(event) => setDraft((current) => ({ ...current, equipmentNotes: event.target.value }))} placeholder="Örneğin: Ön koltuk ısıtma, direksiyon ısıtma, sonradan takılan multimedya ekranı, özel ses sistemi..." />
                <small>İsteğe bağlı · Standart pakette bulunmayan özellikleri yazabilirsiniz.</small>
              </label>
            </details>
            <label className="valuation-field damage-notes">
              <span>Hasar ve araç durumu açıklaması</span>
              <textarea value={draft.damageNotes} maxLength={1200} onChange={(event) => setDraft((current) => ({ ...current, damageNotes: event.target.value }))} placeholder="Varsa hasarın konumu, onarım veya mekanik arıza hakkında bildiklerinizi yazın." />
            </label>
            <details className="detailed-photos">
              <summary>Fotoğraf ekle (isteğe bağlı)</summary>
              <div className="detailed-photos__body">
                <Camera size={22} />
                <div>
                  <p>Dış görünüm, iç mekân, kilometre, motor ve varsa hasarlı bölge. En fazla 15 adet JPG, PNG veya WebP; her biri 4 MB altında.</p>
                  <PhotoGuide areas={photos.map((photo) => photo.area)} hasDamage={draft.accidentStatus === "Var"} />
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => { addPhotos(event.target.files); event.target.value = ""; }} />
                  {photos.length > 0 && (
                    <div className="detailed-photo-list">
                      {photos.map((photo) => (
                        <div key={photo.url}>
                          <Image src={photo.url} alt="Araç fotoğrafı önizlemesi" width={180} height={120} unoptimized />
                          <select aria-label="Fotoğraf bölgesi" value={photo.area} onChange={(event) => setPhotos((current) => current.map((item) => item.url === photo.url ? { ...item, area: event.target.value } : item))}>
                            {photoAreas.map((area) => <option key={area}>{area}</option>)}
                          </select>
                          <button type="button" onClick={() => removePhoto(photo.url)}>Kaldır</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </details>
          </div>
        )}
        {step === 2 && (
          <div className="detailed-stage">
            <StageTitle title="Kişisel bilgiler" text="Uzman değerlendirmesi tamamlandığında size ulaşabilmemiz için iletişim bilgilerinizi girin." />
            <ContactForm contact={contact} setContact={setContact} agreed={agreed} setAgreed={setAgreed} />
          </div>
        )}
        {step === 3 && (
          <div className="detailed-stage estimate-stage">
            <div className="success-mark"><Check /></div>
            <h3>Bilgilerinizi son kez kontrol edin</h3>
            <p className="estimate-note">Otomatik veya rastgele fiyat göstermiyoruz. Başvurunuz araç ve piyasa verileri uzmanlarımız tarafından incelendikten sonra teklif oluşturulacaktır.</p>
            <dl className="estimate-summary">
              {([
                ["Araç", `${selection.year} ${selection.brand} ${selection.model}`],
                ["Motor ve paket", variant ? versionLabel(variant) : `${selection.engine} · ${selection.trim}`],
                ["Yakıt / vites", `${selection.fuelType} · ${selection.transmission}`],
                ["Renk / kilometre", `${draft.color} · ${formatNumber(draft.mileage)} km`],
                ["Tramer", draft.accidentStatus === "Var" && draft.damageAmount ? `${formatNumber(draft.damageAmount)} ₺` : draft.accidentStatus],
                ["Kaporta", `${inspectionParts.filter((part) => inspection[part] === "Değişen").length} değişen · ${inspectionParts.filter((part) => inspection[part] === "Boyalı" || inspection[part] === "Lokal Boyalı").length} boyalı/lokal`],
                ["Ek donanım", `${draft.optionalEquipment.length} seçim${draft.equipmentNotes ? " · açıklama var" : ""}`],
                ["Fotoğraflar", photos.length ? `${photos.length} fotoğraf` : "Fotoğraf eklenmedi"],
                ["İletişim", `${contact.firstName} ${contact.lastName} · ${contact.city}`],
              ] as const).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <p className="review-disclaimer">Nihai teklif, ekspertiz ve piyasa incelemesi sonrasında netleşir.</p>
          </div>
        )}
      </div>
      {error && <p className="detailed-error" role="alert">{error}</p>}
      <div className="detailed-actions">
        <button type="button" className="detailed-back" onClick={() => { if (step === 0) setVehiclePhase((current) => Math.max(current - 1, 0)); else setStep((current) => Math.max(current - 1, 0)); setError(""); }} disabled={step === 0 && vehiclePhase === 0}>
          <ArrowLeft size={17} /> Geri
        </button>
        {step === steps.length - 1
          ? <button type="button" className="button button--primary" onClick={submit} disabled={sending}>{sending ? "Gönderiliyor..." : "Teklif talebi gönder"} <ArrowRight size={17} /></button>
          : <button type="button" className="button button--primary" onClick={next}>{step === 2 ? "Ön değerlendirmeye geç" : "Devam et"} <ArrowRight size={17} /></button>}
      </div>
    </section>
  );
}

function StageTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="detailed-stage__title">
      <h3 tabIndex={-1}>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function ContactField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="valuation-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function ChoiceField({ label, name, value, options, onChange }: { label: string; name: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <fieldset className="choice-pills"><legend>{label}</legend>{options.map((option) => <label key={option}><input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} />{option}</label>)}</fieldset>;
}

function ContactForm({ contact, setContact, agreed, setAgreed }: { contact: ContactState; setContact: Dispatch<SetStateAction<ContactState>>; agreed: boolean; setAgreed: Dispatch<SetStateAction<boolean>> }) {
  return <>
    <div className="detailed-contact">
      <ContactField label="Ad *" value={contact.firstName} onChange={(value) => setContact((current) => ({ ...current, firstName: value }))} placeholder="Adınız" />
      <ContactField label="Soyad *" value={contact.lastName} onChange={(value) => setContact((current) => ({ ...current, lastName: value }))} placeholder="Soyadınız" />
      <ContactField label="Telefon *" type="tel" value={contact.phone} onChange={(value) => setContact((current) => ({ ...current, phone: value }))} placeholder="05XX XXX XX XX" />
      <ContactField label="E-posta" type="email" value={contact.email} onChange={(value) => setContact((current) => ({ ...current, email: value }))} placeholder="ornek@email.com" />
      <ContactField label="Şehir *" value={contact.city} onChange={(value) => setContact((current) => ({ ...current, city: value }))} placeholder="Şehriniz" />
      <ContactField label="Plaka" value={contact.plate} onChange={(value) => setContact((current) => ({ ...current, plate: value.toLocaleUpperCase("tr-TR") }))} placeholder="34 ABC 123" />
      <label className="valuation-field"><span>Aracınızı ne zaman satmayı düşünüyorsunuz? *</span><select value={contact.saleTiming} onChange={(event) => setContact((current) => ({ ...current, saleTiming: event.target.value }))}><option value="">Seçin</option><option value="Hemen">Hemen</option><option value="1 ay içinde">1 ay içinde</option><option value="1-3 ay içinde">1-3 ay içinde</option><option value="Kararsızım">Kararsızım</option></select></label>
      <fieldset className="contact-method"><legend>Tercih edilen iletişim yöntemi</legend>{(["Telefon", "WhatsApp", "E-posta"] as ContactMethod[]).map((method) => <label key={method}><input type="radio" name="contact-method" checked={contact.preferredContactMethod === method} onChange={() => setContact((current) => ({ ...current, preferredContactMethod: method }))} />{method}</label>)}</fieldset>
      <label className="valuation-field"><span>Uygun iletişim zamanı</span><select value={contact.preferredContactTime} onChange={(event) => setContact((current) => ({ ...current, preferredContactTime: event.target.value }))}><option value="">Fark etmez</option><option value="09.00–12.00">09.00–12.00</option><option value="12.00–17.00">12.00–17.00</option><option value="17.00 sonrası">17.00 sonrası</option></select></label>
      <label className="contact-call"><input type="checkbox" checked={contact.callRequested} onChange={(event) => setContact((current) => ({ ...current, callRequested: event.target.checked }))} />Müşteri temsilcisi beni arasın</label>
    </div>
    <label className="valuation-field customer-notes"><span>Ek açıklama</span><textarea value={contact.customerNotes} maxLength={1200} onChange={(event) => setContact((current) => ({ ...current, customerNotes: event.target.value }))} placeholder="Başvurunuzla ilgili eklemek istediğiniz bir bilgi varsa yazın." /></label>
    <label className="offer-consent detailed-consent"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /><span><Link href="/aydinlatma-metni" target="_blank" rel="noopener noreferrer">Aydınlatma metnini</Link> okudum; bilgilerimin teklif başvurum için kullanılacağını biliyorum.</span></label>
  </>;
}
