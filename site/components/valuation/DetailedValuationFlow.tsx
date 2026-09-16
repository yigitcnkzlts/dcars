"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/layout/NativeLink";
import { ArrowLeft, ArrowRight, Camera, Check, ClipboardCheck } from "lucide-react";
import { BrandSelect } from "./BrandSelect";
import { ModelSelect } from "./ModelSelect";
import { InspectionDiagram, initialInspection, inspectionParts, inspectionStatuses } from "./InspectionDiagram";
import { InspectionTable } from "./InspectionTable";
import { optionsFor, selectedVariant, variantsFor, type SelectionField, type VehicleSelection } from "@/services/vehicleCatalogService";
import type { ContactMethod, InspectionPart, InspectionStatus, ValuationRequest, VehicleInspection } from "@/types/valuation";
import type { VehicleContext } from "@/types/vehicle";

const steps = ["Araç Bilgileri", "Kilometre & Ekspertiz", "Ön Değerleme", "Randevu"];
const equipmentOptions = ["Panoramik Cam Tavan", "Sunroof", "Deri Koltuk", "Isıtmalı Koltuk", "Hafızalı Koltuk", "360° Kamera", "Geri Görüş Kamerası", "Adaptif Cruise Control", "Matrix / LED Far", "Head-Up Display", "Premium Ses Sistemi", "Elektrikli Bagaj", "Keyless Go"];
const photoAreas = ["Ön", "Arka", "Sol yan", "Sağ yan", "İç mekân", "Hasarlı bölge", "Diğer"];
const draftKey = "dcars-detailed-valuation-v1";
type Photo = { file: File; url: string; area: string };
type Draft = { selection: Partial<VehicleSelection>; mileage: string; color: string; accidentStatus: string; damageAmount: string; inspection: VehicleInspection; optionalEquipment: string[] };
const initialDraft = (): Draft => ({ selection: {}, mileage: "", color: "", accidentStatus: "", damageAmount: "", inspection: initialInspection(), optionalEquipment: [] });
const digits = (value: string) => value.replace(/\D/g, "").slice(0, 9);
const formatNumber = (value: string) => value ? new Intl.NumberFormat("tr-TR").format(Number(value)) : "";

export function DetailedValuationFlow({ onVehicleChange }: { onVehicleChange?: (vehicle: VehicleContext) => void }) {
  const [step, setStep] = useState(0);
  const [selectedPart, setSelectedPart] = useState<InspectionPart | null>(null);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [contact, setContact] = useState({ firstName: "", lastName: "", phone: "", email: "", preferredContactMethod: "Telefon" as ContactMethod, preferredContactTime: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const photoUrls = useRef<string[]>([]);
  const draftRestored = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(draftKey);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<Draft>;
          setDraft({ ...initialDraft(), ...parsed, inspection: { ...initialInspection(), ...parsed.inspection } });
        }
      } catch { /* Invalid drafts start fresh. */ }
      draftRestored.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => { if (draftRestored.current && !requestId) localStorage.setItem(draftKey, JSON.stringify(draft)); }, [draft, requestId]);
  useEffect(() => { onVehicleChange?.({ year: draft.selection.year, brand: draft.selection.brand, model: draft.selection.model, engine: draft.selection.engine, fuelType: draft.selection.fuelType, transmission: draft.selection.transmission, trim: draft.selection.trim, mileage: Number(draft.mileage) || undefined }); }, [draft.selection, draft.mileage, onVehicleChange]);
  useEffect(() => () => { photoUrls.current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  const { selection, inspection } = draft;
  const catalog = variantsFor(selection.year ?? 0, selection.brand ?? "", selection.model ?? "");
  const variant = selectedVariant(selection);
  const setSelection = (field: keyof VehicleSelection, value: string | number) => {
    const order: (keyof VehicleSelection)[] = ["year", "brand", "model", "engine", "fuelType", "transmission", "version", "trim"];
    setDraft((current) => {
      const next = { ...current.selection, [field]: value };
      for (const key of order.slice(order.indexOf(field) + 1)) delete next[key];
      return { ...current, selection: next };
    });
    setError("");
  };
  const setInspection = (part: InspectionPart, status: InspectionStatus) => setDraft((current) => ({ ...current, inspection: { ...current.inspection, [part]: status } }));
  const counts = Object.fromEntries(inspectionStatuses.map((status) => [status, inspectionParts.filter((part) => inspection[part] === status).length])) as Record<InspectionStatus, number>;

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    if (photos.length + incoming.length > 5) { setError("En fazla 5 fotoğraf ekleyebilirsiniz."); return; }
    if (incoming.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size === 0 || file.size > 4 * 1024 * 1024)) { setError("JPG, PNG veya WebP biçiminde, 4 MB altındaki fotoğrafları seçin."); return; }
    setPhotos((current) => [...current, ...incoming.map((file) => { const url = URL.createObjectURL(file); photoUrls.current.push(url); return { file, url, area: draft.accidentStatus === "Var" ? "Hasarlı bölge" : "Diğer" }; })]);
    setError("");
  };
  const removePhoto = (url: string) => { URL.revokeObjectURL(url); photoUrls.current = photoUrls.current.filter((item) => item !== url); setPhotos((current) => current.filter((item) => item.url !== url)); };

  const next = () => {
    if (step === 0 && (!selection.year || !selection.brand?.trim() || !selection.model?.trim() || !selection.engine?.trim() || !selection.fuelType?.trim() || !selection.transmission?.trim() || !selection.version?.trim() || !selection.trim?.trim())) { setError("Araç bilgilerini sırayla tamamlayın. Bilmediğiniz teknik alanlara ‘Bilmiyorum’ yazabilirsiniz."); return; }
    if (step === 1 && (!draft.mileage || !draft.accidentStatus)) { setError("Kilometreyi ve hasar kaydı durumunu seçin."); return; }
    if (step === 1 && draft.accidentStatus === "Var" && draft.damageAmount && !/^\d+$/.test(draft.damageAmount)) { setError("Hasar tutarını yalnızca rakamla girin."); return; }
    setError(""); setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const submit = async () => {
    const phone = contact.phone.replace(/\s/g, "");
    if (!contact.firstName.trim() || !contact.lastName.trim() || !/^0?5\d{9}$/.test(phone) || !/^\S+@\S+\.\S+$/.test(contact.email)) { setError("Ad, soyad, geçerli cep telefonu ve e-posta adresi girin."); return; }
    if (!agreed) { setError("Devam etmek için aydınlatma metnini okuyup onaylayın."); return; }
    setSending(true); setError("");
    const payload: ValuationRequest = {
      year: selection.year, brand: selection.brand, model: selection.model, engine: selection.engine,
      fuelType: selection.fuelType, transmission: selection.transmission, version: selection.version, trim: selection.trim,
      mileage: Number(draft.mileage), color: draft.color, accidentStatus: draft.accidentStatus, damageAmount: draft.damageAmount,
      inspection, optionalEquipment: draft.optionalEquipment, factoryEquipment: variant?.factoryEquipment ?? [],
      firstName: contact.firstName.trim(), lastName: contact.lastName.trim(), phone, email: contact.email.trim(),
      preferredContactMethod: contact.preferredContactMethod, preferredContactTime: contact.preferredContactTime,
    };
    try {
      const body = new FormData(); body.set("payload", JSON.stringify(payload));
      photos.forEach((photo, index) => { body.append("photos", photo.file); body.set(`photoArea${index}`, photo.area); });
      const response = await fetch("/api/valuation", { method: "POST", body });
      const result = await response.json() as { id?: number; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error || "Başvuru gönderilemedi.");
      localStorage.removeItem(draftKey); setRequestId(result.id);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Bağlantı kurulamadı. Tekrar deneyin."); }
    finally { setSending(false); }
  };

  if (requestId) return <section className="detailed-success" id="teklif-formu"><div className="success-mark"><Check /></div><span className="vehicle-eyebrow">BAŞVURU ALINDI</span><h2>Bilgileriniz değerlendirmeye alındı.</h2><p>Başvuru numaranız <strong>#{requestId}</strong>. Tercih ettiğiniz iletişim yöntemiyle size dönüş yapılacak; nihai teklif incelemeden sonra netleşecek.</p><Link className="button button--primary" href="/basvuru-takip">Başvurumu kontrol et <ArrowRight size={17} /></Link></section>;

  return <section className="detailed-flow" id="teklif-formu" aria-labelledby="detailed-title"><div className="detailed-flow__intro"><span className="vehicle-eyebrow">D CARS · ÜCRETSİZ BAŞVURU</span><h2 id="detailed-title">Aracınızı birlikte tanıyalım.</h2><p>Bilgilerinizi tamamlayın, durumunu gösterin ve inceleme için gönderin. Fiyat, uzman değerlendirmesinden sonra iletilir.</p></div>
    <nav className="detailed-stepper" aria-label="Başvuru adımları">{steps.map((name, index) => <button type="button" key={name} disabled={index >= step} aria-current={index === step ? "step" : undefined} onClick={() => { setStep(index); setError(""); }}><b>{String(index + 1).padStart(2, "0")}</b><span>{name}</span></button>)}</nav>
    <div className="detailed-panel">
      {step === 0 && <div className="detailed-stage"><StageTitle number="01" title="Aracınızın gerçek versiyonunu seçin" text="Alanlar sırayla açılır. Üretici kaynağı bulunan araçlarda motor ve donanım paketleri yılınıza göre listelenir." /><div className="detailed-vehicle-grid"><label className="valuation-field"><span>Model yılı</span><select value={selection.year ?? ""} onChange={(event) => setSelection("year", event.target.value ? Number(event.target.value) : "")}><option value="">Yıl seçin</option>{Array.from({ length: 70 }, (_, index) => new Date().getFullYear() + 1 - index).map((year) => <option key={year} value={year}>{year}</option>)}</select></label><BrandSelect value={selection.brand ?? ""} onChange={(value) => setSelection("brand", value)} disabled={!selection.year} /><ModelSelect brand={selection.year ? selection.brand ?? "" : ""} value={selection.model ?? ""} onChange={(value) => setSelection("model", value)} />
        {(["engine", "fuelType", "transmission", "version", "trim"] as SelectionField[]).map((field, index) => <CatalogField key={`${field}-${[selection.year, selection.brand, selection.model, ...([selection.engine, selection.fuelType, selection.transmission, selection.version].slice(0, index))].join("|")}`} label={["Motor / hacim", "Yakıt tipi", "Vites", "Versiyon (motor ve vites)", "Donanım paketi (ör. Sky Pack)"][index]} field={field} value={selection[field] ?? ""} options={optionsFor(selection, field)} disabled={!selection[["model", "engine", "fuelType", "transmission", "version"][index] as keyof VehicleSelection]} onChange={(value) => setSelection(field, value)} />)}
      </div><p className="catalog-integrity">{catalog.length ? <><Check size={15} /> {selection.year} {selection.brand} {selection.model} için {catalog.length} kaynaklı varyant gösteriliyor. <a href={catalog[0].sourceUrl} target="_blank" rel="noopener noreferrer">Üretici kaynağı</a></> : "Bu yıl ve model için doğrulanmış motor/paket verisi henüz yok. Yanlış bilgi vermemek için hazır teknik varyant gösterilmiyor."}</p></div>}
      {step === 1 && <div className="detailed-stage"><StageTitle number="02" title="Kilometre ve ekspertiz" text="Bildiklerinizi işaretleyin. Emin olmadığınız parçalar için mevcut durumunu değiştirmeyin; uzman incelemesinde doğrulanır." /><div className="detailed-facts"><label className="valuation-field"><span>Kilometre *</span><div className="number-input"><input inputMode="numeric" value={formatNumber(draft.mileage)} onChange={(event) => setDraft((current) => ({ ...current, mileage: digits(event.target.value) }))} placeholder="85.000" /><span>km</span></div></label><label className="valuation-field"><span>Hasar kaydı *</span><select value={draft.accidentStatus} onChange={(event) => setDraft((current) => ({ ...current, accidentStatus: event.target.value, damageAmount: event.target.value === "Var" ? current.damageAmount : "" }))}><option value="">Seçin</option><option value="Yok">Hasar kaydı yok</option><option value="Var">Hasar kaydı var</option><option value="Bilmiyorum">Bilmiyorum</option></select></label>{draft.accidentStatus === "Var" && <label className="valuation-field"><span>Hasar tutarı (biliniyorsa)</span><div className="number-input"><input inputMode="numeric" value={formatNumber(draft.damageAmount)} onChange={(event) => setDraft((current) => ({ ...current, damageAmount: digits(event.target.value) }))} placeholder="Örn. 25.000" /><span>₺</span></div></label>}</div><label className="valuation-field"><span>Araç rengi</span><select value={draft.color} onChange={(event) => setDraft((current) => ({ ...current, color: event.target.value }))}><option value="">Renk seçin</option>{["Beyaz", "Siyah", "Gri", "Gümüş", "Kırmızı", "Mavi", "Lacivert", "Yeşil", "Sarı", "Turuncu", "Kahverengi", "Bej", "Bordo", "Mor", "Diğer", "Bilmiyorum"].map((color) => <option key={color} value={color}>{color}</option>)}</select></label><div className="inspection-layout"><InspectionDiagram inspection={inspection} selectedPart={selectedPart} onSelect={setSelectedPart} /><InspectionTable inspection={inspection} selectedPart={selectedPart} onSelect={setSelectedPart} onChange={setInspection} /></div><div className="detailed-equipment"><h3>Ek donanımlar <small>isteğe bağlı</small></h3><p>Aracınızda bulunanları işaretleyin. Bunlar fabrika paketinin doğrulanmış donanımı olarak değerlendirilmez.</p><div>{equipmentOptions.map((item) => <label key={item}><input type="checkbox" checked={draft.optionalEquipment.includes(item)} onChange={(event) => setDraft((current) => ({ ...current, optionalEquipment: event.target.checked ? [...current.optionalEquipment, item] : current.optionalEquipment.filter((existing) => existing !== item) }))} />{item}</label>)}</div></div><div className="detailed-photos"><Camera size={22} /><div><strong>Fotoğraf ekleyin (isteğe bağlı)</strong><p>Ön, arka, yanlar ve varsa hasarlı bölge. En fazla 5 adet JPG, PNG veya WebP; her biri 4 MB altında.</p><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => { addPhotos(event.target.files); event.target.value = ""; }} />{photos.length > 0 && <div className="detailed-photo-list">{photos.map((photo) => <div key={photo.url}><img src={photo.url} alt="Araç fotoğrafı önizlemesi" /><select aria-label="Fotoğraf bölgesi" value={photo.area} onChange={(event) => setPhotos((current) => current.map((item) => item.url === photo.url ? { ...item, area: event.target.value } : item))}>{photoAreas.map((area) => <option key={area}>{area}</option>)}</select><button type="button" onClick={() => removePhoto(photo.url)}>Kaldır</button></div>)}</div>}</div></div></div>}
      {step === 2 && <div className="detailed-stage"><StageTitle number="03" title="Bilgileriniz değerlendirmeye hazır" text="Özeti kontrol edin. Eksik veya yanlış bilgi varsa önceki adımlara dönüp düzeltebilirsiniz." /><div className="valuation-review"><div className="valuation-review__vehicle"><span className="vehicle-eyebrow">ARAÇ ÖZETİ</span><h3>{selection.year} {selection.brand} {selection.model}</h3><dl>{[["Motor", selection.engine], ["Renk", draft.color || "Belirtilmedi"], ["Yakıt", selection.fuelType], ["Vites", selection.transmission], ["Versiyon", selection.version], ["Paket", selection.trim], ["Kilometre", `${formatNumber(draft.mileage)} km`]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div><div><span className="vehicle-eyebrow">EKSPERTİZ ÖZETİ</span><div className="valuation-review__counts">{inspectionStatuses.map((status) => <p key={status} data-status={status}><b>{counts[status]}</b><span>{status}</span></p>)}</div><p className="valuation-review__note">Hasar kaydı: <strong>{draft.accidentStatus === "Var" ? `Var${draft.damageAmount ? ` · ${formatNumber(draft.damageAmount)} ₺` : " · Tutar belirtilmedi"}` : draft.accidentStatus}</strong></p><p className="valuation-review__note">Ek donanımlar: <strong>{draft.optionalEquipment.length ? draft.optionalEquipment.join(", ") : "Belirtilmedi"}</strong></p><p className="valuation-review__note">Fotoğraf: <strong>{photos.length} adet</strong></p></div></div><div className="valuation-review__disclaimer"><ClipboardCheck size={23} /><div><strong>Ön değerleme için hazır</strong><p>Bu aşamada otomatik piyasa fiyatı hesaplanmıyor. Aracın gerçek durumu ve piyasa verileri incelendikten sonra sizinle iletişime geçilecek.</p></div></div></div>}
      {step === 3 && <div className="detailed-stage"><StageTitle number="04" title="Size nasıl ulaşalım?" text="Bilgilerinizi başvurunuz için kullanacağız. Teklif için görüşme zamanı daha sonra netleştirilebilir." /><div className="detailed-contact"><ContactField label="Ad *" value={contact.firstName} onChange={(value) => setContact((current) => ({ ...current, firstName: value }))} placeholder="Adınız" /><ContactField label="Soyad *" value={contact.lastName} onChange={(value) => setContact((current) => ({ ...current, lastName: value }))} placeholder="Soyadınız" /><ContactField label="Telefon *" type="tel" value={contact.phone} onChange={(value) => setContact((current) => ({ ...current, phone: value }))} placeholder="05XX XXX XX XX" /><ContactField label="E-posta *" type="email" value={contact.email} onChange={(value) => setContact((current) => ({ ...current, email: value }))} placeholder="ornek@email.com" /><fieldset className="contact-method"><legend>Tercih edilen iletişim yöntemi</legend>{(["Telefon", "WhatsApp", "E-posta"] as ContactMethod[]).map((method) => <label key={method}><input type="radio" name="contact-method" checked={contact.preferredContactMethod === method} onChange={() => setContact((current) => ({ ...current, preferredContactMethod: method }))} />{method}</label>)}</fieldset><label className="valuation-field"><span>Uygun iletişim zamanı</span><select value={contact.preferredContactTime} onChange={(event) => setContact((current) => ({ ...current, preferredContactTime: event.target.value }))}><option value="">Fark etmez</option><option value="09.00–12.00">09.00–12.00</option><option value="12.00–17.00">12.00–17.00</option><option value="17.00 sonrası">17.00 sonrası</option></select></label></div><label className="offer-consent detailed-consent"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /><span><Link href="/aydinlatma-metni" target="_blank" rel="noopener noreferrer">Aydınlatma metnini</Link> okudum; bilgilerimin teklif başvurum için kullanılacağını biliyorum.</span></label></div>}
    </div>{error && <p className="detailed-error" role="alert">{error}</p>}<div className="detailed-actions"><button type="button" className="detailed-back" onClick={() => { setStep((current) => Math.max(current - 1, 0)); setError(""); }} disabled={step === 0}><ArrowLeft size={17} /> Geri</button><span>{step + 1} / {steps.length}</span>{step === steps.length - 1 ? <button type="button" className="button button--primary" onClick={submit} disabled={sending}>{sending ? "Gönderiliyor..." : "Teklif talebi gönder"} <ArrowRight size={17} /></button> : <button type="button" className="button button--primary" onClick={next}>Devam et <ArrowRight size={17} /></button>}</div>
  </section>;
}

function StageTitle({ number, title, text }: { number: string; title: string; text: string }) { return <div className="detailed-stage__title"><span className="vehicle-eyebrow">ADIM {number}</span><h3>{title}</h3><p>{text}</p></div>; }
function CatalogField({ label, field, value, options, disabled, onChange }: { label: string; field: SelectionField; value: string; options: string[]; disabled: boolean; onChange: (value: string) => void }) {
  const general = field === "fuelType" ? ["Benzin", "Dizel", "LPG", "Benzin / LPG", "Hibrit", "Şarj Edilebilir Hibrit", "Elektrik"] : field === "transmission" ? ["Manuel", "Otomatik", "Yarı otomatik"] : [];
  const choices = [...new Set([...options, ...general, "Bilmiyorum"])];
  return <label className="valuation-field detailed-catalog-field"><span>{label}</span><select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}><option value="">{disabled ? "Önceki alanı seçin" : `${label} seçin`}</option>{choices.map((option) => <option key={option} value={option}>{option}</option>)}</select>{!disabled && options.length === 0 && <small>Bu araç için doğrulanmış teknik seçenek bulunmuyor.</small>}</label>;
}
function ContactField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) { return <label className="valuation-field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>; }
