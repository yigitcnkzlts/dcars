"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/layout/NativeLink";
import { ArrowLeft, ArrowRight, Camera, Check, X } from "lucide-react";
import type { ValuationRequest } from "@/types/valuation";
import type { VehicleContext } from "@/types/vehicle";
import { optionsFor } from "@/services/vehicleCatalogService";
import { inspectionParts } from "./InspectionDiagram";

type Props = { vehicle: VehicleContext; onClose: () => void };
type Photo = { file: File; url: string; area: string };
const steps = ["Teknik bilgiler", "Durum ve hasar", "Fotoğraflar", "Teklif talebi"];
const stepDescriptions = ["Yakıt, vites ve paket bilgisini ekleyin. Bilmiyorsanız boş bırakabilirsiniz.", "Hasar veya değişen parça varsa açıkça belirtin. Emin değilseniz bilmiyorum seçebilirsiniz.", "Ön, arka ve varsa hasarlı bölgenin fotoğrafını ekleyin. Bu adım isteğe bağlıdır.", "İletişim bilgilerinizi yazın; başvurunuzu inceleyip size dönüş yapalım."];
const areas = ["Ön", "Arka", "Sol yan", "Sağ yan", "İç mekân", "Hasarlı bölge", "Diğer"];
const colors = ["Beyaz", "Siyah", "Gri", "Gümüş", "Kırmızı", "Mavi", "Lacivert", "Yeşil", "Sarı", "Turuncu", "Kahverengi", "Bej", "Bordo", "Mor", "Altın", "Diğer", "Bilmiyorum"];
const conditionOptions = ["Çok iyi", "İyi", "Orta", "Onarım gerekli", "Bilmiyorum"];
const draftKey = "dcars-valuation-draft";
const initial: ValuationRequest = { firstName: "", lastName: "", phone: "", email: "" };

export function ValuationWizard({ vehicle, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ValuationRequest>({ ...initial, ...vehicle });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState<number | string | null>(null);
  const photoUrls = useRef<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) setForm({ ...initial, ...JSON.parse(saved), ...vehicle });
    } catch { /* An unreadable draft should not prevent a new request. */ }
  }, [vehicle]);
  useEffect(() => {
    if (!submitted) localStorage.setItem(draftKey, JSON.stringify({ year: form.year, brand: form.brand, model: form.model, mileage: form.mileage, fuelType: form.fuelType, transmission: form.transmission, engine: form.engine, trim: form.trim, color: form.color, replacedParts: form.replacedParts, paintedParts: form.paintedParts, damageAmount: form.damageAmount, severeDamage: form.severeDamage, condition: form.condition, accidentStatus: form.accidentStatus, damageNotes: form.damageNotes, expectedPrice: form.expectedPrice, saleTiming: form.saleTiming }));
  }, [form, submitted]);
  useEffect(() => () => { photoUrls.current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  const update = (key: keyof ValuationRequest, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const engineOptions = optionsFor(form, "engine");
  const trimOptions = optionsFor(form, "trim");
  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    if (photos.length + incoming.length > 5) { setError("En fazla 5 fotoğraf ekleyebilirsiniz."); return; }
    if (incoming.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 4 * 1024 * 1024 || file.size === 0)) { setError("Yalnızca 4 MB altındaki JPG, PNG veya WebP fotoğrafları ekleyin."); return; }
    setError("");
    setPhotos((current) => [...current, ...incoming.map((file) => { const url = URL.createObjectURL(file); photoUrls.current.push(url); return { file, url, area: form.accidentStatus === "Var" ? "Hasarlı bölge" : "Diğer" }; })]);
  };
  const removePhoto = (url: string) => {
    URL.revokeObjectURL(url);
    photoUrls.current = photoUrls.current.filter((item) => item !== url);
    setPhotos((current) => current.filter((item) => item.url !== url));
  };
  const submit = async () => {
    setError("");
    if (!form.firstName.trim() || !form.lastName.trim() || !/^0?5\d{9}$/.test(form.phone.replace(/\s/g, "")) || !/^\S+@\S+\.\S+$/.test(form.email)) { setError("Ad, soyad, geçerli cep telefonu ve e-posta adresi girin."); return; }
    if (!agreed) { setError("Devam etmek için aydınlatma metnini okuyup onaylayın."); return; }
    setSending(true);
    try {
      const data = new FormData();
      data.set("payload", JSON.stringify(form));
      photos.forEach((photo, index) => { data.append("photos", photo.file); data.set(`photoArea${index}`, photo.area); });
      const response = await fetch("/api/valuation", { method: "POST", body: data });
      if (response.status === 413) throw new Error("Fotoğrafların toplam boyutu çok büyük. Daha küçük dosyalar seçip tekrar deneyin.");
      const result = await response.json() as { id?: number | string; error?: string };
      if (!response.ok) throw new Error(result.error || "Talep gönderilemedi.");
      setRequestId(result.id ?? null);
      localStorage.removeItem(draftKey);
      setSubmitted(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Bağlantı kurulamadı. Tekrar deneyin."); }
    finally { setSending(false); }
  };

  if (submitted) return <div className="wizard-backdrop"><div className="wizard wizard--success" role="dialog" aria-modal="true" aria-labelledby="success-title"><button className="wizard-close" onClick={onClose} aria-label="Pencereyi kapat"><X size={18} /></button><div className="success-mark"><Check /></div><span className="section-index">BAŞVURUNUZ ALINDI</span><h2 id="success-title">Teklif talebiniz kaydedildi.</h2>{requestId && <p>Başvuru numaranız: <strong>#{requestId}</strong></p>}<p>{photos.length > 0 ? `${photos.length} fotoğrafınız ve araç bilgileriniz incelenecek.` : "Araç bilgileriniz incelenecek."} İletişim tercihinize göre size dönüş yapılacak; teklif, araç durumu doğrulandıktan sonra netleşecek.</p><div className="success-actions"><Link href="/basvuru-takip" className="button button--primary">Başvurumu kontrol et <ArrowRight size={16} /></Link><button type="button" onClick={onClose}>Kapat</button></div></div></div>;

  return <div className="wizard-backdrop"><div className="wizard" role="dialog" aria-modal="true" aria-labelledby="wizard-title"><button className="wizard-close" onClick={onClose} aria-label="Pencereyi kapat"><X size={18} /></button><div className="wizard-header"><span className="section-index">ÜCRETSİZ TEKLİF TALEBİ</span><h2 id="wizard-title">{steps[step]}</h2><p>{step + 1}/{steps.length}. adım · {stepDescriptions[step]}</p><div className="wizard-progress">{steps.map((item, index) => <div className={index <= step ? "wizard-step wizard-step--active" : "wizard-step"} key={item}><b>0{index + 1}</b><span>{item}</span></div>)}</div></div><div className="wizard-body">
    {step === 0 && <div className="wizard-grid"><Field label="Kilometre" value={String(form.mileage ?? "")} onChange={(value) => update("mileage", value)} type="number" placeholder="Örn. 85000" /><Choice label="Yakıt" value={form.fuelType ?? ""} onChange={(value) => update("fuelType", value)} options={["Benzin", "Dizel", "LPG", "Benzin / LPG", "Hibrit", "Şarj Edilebilir Hibrit", "Elektrik", "Bilmiyorum"]} /><Choice label="Vites" value={form.transmission ?? ""} onChange={(value) => update("transmission", value)} options={[...new Set([...optionsFor(form, "transmission"), "Manuel", "Otomatik", "Yarı otomatik", "Bilmiyorum"])]} /><Choice label="Motor" value={form.engine ?? ""} onChange={(value) => update("engine", value)} options={[...new Set([...engineOptions, "Bilmiyorum"])]} /><Choice label="Paket / versiyon" value={form.trim ?? ""} onChange={(value) => update("trim", value)} options={[...new Set([...(form.trim ? [form.trim] : []), ...trimOptions, "Bilmiyorum"])]} /><Choice label="Araç rengi" value={form.color ?? ""} onChange={(value) => update("color", value)} options={colors} /></div>}
    {step === 1 && <div className="wizard-grid"><Choice label="Kaza veya hasar durumu" value={form.accidentStatus ?? ""} onChange={(value) => update("accidentStatus", value)} options={["Yok", "Var", "Bilmiyorum"]} /><Choice label="Ağır hasar kaydı" value={form.severeDamage ?? ""} onChange={(value) => update("severeDamage", value)} options={["Yok", "Var", "Bilmiyorum"]} /><Field label="Tramer tutarı" value={form.damageAmount ?? ""} onChange={(value) => update("damageAmount", value)} placeholder="Biliniyorsa tutar" /><Choice label="Değişen parça" value={form.replacedParts ?? ""} onChange={(value) => update("replacedParts", value)} options={["Yok", ...inspectionParts, "Birden fazla", "Bilmiyorum"]} /><Choice label="Boyalı parça" value={form.paintedParts ?? ""} onChange={(value) => update("paintedParts", value)} options={["Yok", ...inspectionParts, "Birden fazla", "Bilmiyorum"]} /><Choice label="Genel kondisyon" value={form.condition ?? ""} onChange={(value) => update("condition", value)} options={conditionOptions} /><Field label="Hasarı kısaca anlatın (isteğe bağlı)" value={form.damageNotes ?? ""} onChange={(value) => update("damageNotes", value)} placeholder="Ek açıklama" /></div>}
    {step === 2 && <div className="photo-step"><div className="photo-step__intro"><Camera size={21} /><div><strong>{form.accidentStatus === "Var" ? "Hasarlı bölgeyi gösterin" : "Aracınızın fotoğraflarını ekleyin"}</strong><p>Ön, arka, yanlar ve varsa hasarlı bölgeyi net ışıkta çekin. Fotoğraf eklemek isteğe bağlıdır; aracın durumunu anlamamıza yardımcı olur.</p></div></div><label className="photo-picker">Fotoğraf seç<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => { addPhotos(event.target.files); event.target.value = ""; }} /><span>En fazla 5 fotoğraf · Dosya başına 4 MB · JPG, PNG veya WebP</span></label>{photos.length > 0 && <div className="photo-grid">{photos.map((photo) => <div className="photo-card" key={photo.url}><img src={photo.url} alt={`${photo.area} fotoğraf önizlemesi`} /><label>Bölge<select value={photo.area} onChange={(event) => setPhotos((current) => current.map((item) => item.url === photo.url ? { ...item, area: event.target.value } : item))}>{areas.map((area) => <option key={area} value={area}>{area}</option>)}</select></label><button type="button" onClick={() => removePhoto(photo.url)}>Kaldır</button></div>)}</div>}</div>}
    {step === 3 && <><div className="wizard-grid"><Field label="Beklediğiniz fiyat (isteğe bağlı)" value={form.expectedPrice ?? ""} onChange={(value) => update("expectedPrice", value)} placeholder="Örn. 1.250.000 TL" /><label className="wizard-field"><span>Ne zaman satmak istiyorsunuz?</span><select value={form.saleTiming ?? ""} onChange={(event) => update("saleTiming", event.target.value)}><option value="">Seçin</option><option value="Hemen">Hemen</option><option value="1 ay içinde">1 ay içinde</option><option value="Karar vermedim">Karar vermedim</option></select></label><Field label="Ad" value={form.firstName} onChange={(value) => update("firstName", value)} placeholder="Adınız" required /><Field label="Soyad" value={form.lastName} onChange={(value) => update("lastName", value)} placeholder="Soyadınız" required /><Field label="Telefon" value={form.phone} onChange={(value) => update("phone", value)} placeholder="05XX XXX XX XX" type="tel" required /><Field label="E-posta" value={form.email} onChange={(value) => update("email", value)} placeholder="ornek@email.com" type="email" required /><label className="wizard-field"><span>Uygun iletişim zamanı</span><select value={form.preferredContactTime ?? ""} onChange={(event) => update("preferredContactTime", event.target.value)}><option value="">Fark etmez</option><option value="09.00–12.00">09.00–12.00</option><option value="12.00–17.00">12.00–17.00</option><option value="17.00 sonrası">17.00 sonrası</option></select></label></div><p className="offer-explainer">Bu bir teklif talebidir. Beklediğiniz fiyat bağlayıcı değildir; teklif, fotoğraflar ve araç durumu incelendikten sonra iletilir.</p><label className="offer-consent"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /><span><Link href="/aydinlatma-metni" target="_blank">Aydınlatma metnini</Link> okudum; bilgilerimin teklif başvurum için kullanılacağını biliyorum.</span></label></>}
  </div>{error && <p className="wizard-error" role="alert">{error}</p>}<div className="wizard-footer"><button className="wizard-back" type="button" onClick={() => { setError(""); setStep((current) => current - 1); }} disabled={step === 0}><ArrowLeft size={16} /> Geri</button>{step < steps.length - 1 ? <button className="button button--primary" type="button" onClick={() => { setError(""); setStep((current) => current + 1); }}>Devam et <ArrowRight size={16} /></button> : <button className="button button--primary" type="button" onClick={submit} disabled={sending}>{sending ? "Gönderiliyor..." : "Teklif talebi gönder"} <ArrowRight size={16} /></button>}</div></div></div>;
}

function Field({ label, value, onChange, placeholder, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; required?: boolean }) { return <label className="wizard-field"><span>{label}{required && " *"}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} /></label>; }
function Choice({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <label className="wizard-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Seçin</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>; }
