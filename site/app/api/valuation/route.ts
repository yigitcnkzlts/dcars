import { eq } from "drizzle-orm";
import { valuationPhotos, valuationRequests } from "@/db/schema";
import { createValuationRequest } from "@/services/valuationService";
import type { ValuationRequest } from "@/types/valuation";

const maxPhotos = 5;
const maxPhotoBytes = 4 * 1024 * 1024;
const areas = new Set(["Ön", "Arka", "Sol yan", "Sağ yan", "İç mekân", "Hasarlı bölge", "Diğer"]);

function validImage(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}

export async function POST(request: Request) {
  let requestId: number | undefined;
  let bucket: R2Bucket | undefined;
  const storedKeys: string[] = [];
  try {
    if (Number(request.headers.get("content-length") || 0) > 22 * 1024 * 1024) return Response.json({ error: "Fotoğrafların toplam boyutu çok büyük." }, { status: 413 });
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) return Response.json({ error: "Geçersiz başvuru biçimi." }, { status: 415 });
    const data = await request.formData();
    const raw = data.get("payload");
    if (typeof raw !== "string") return Response.json({ error: "Araç bilgileri eksik." }, { status: 400 });
    const payload = JSON.parse(raw) as Partial<ValuationRequest>;
    if (!payload.year || !payload.brand?.trim() || !payload.model?.trim() || !Number.isFinite(Number(payload.mileage)) || Number(payload.mileage) < 0 || !payload.firstName?.trim() || !payload.lastName?.trim() || !/^0?5\d{9}$/.test((payload.phone ?? "").replace(/\s/g, "")) || !/^\S+@\S+\.\S+$/.test(payload.email ?? "") || JSON.stringify(payload).length > 16_000) return Response.json({ error: "Zorunlu alanları kontrol edin." }, { status: 400 });
    if ((payload.version !== undefined && (typeof payload.version !== "string" || payload.version.length > 120)) ||
        (payload.optionalEquipment !== undefined && (!Array.isArray(payload.optionalEquipment) || payload.optionalEquipment.length > 20 || !payload.optionalEquipment.every((item) => typeof item === "string" && item.length <= 80))) ||
        (payload.inspection !== undefined && (typeof payload.inspection !== "object" || payload.inspection === null || Array.isArray(payload.inspection) || Object.keys(payload.inspection).length > 13 || !Object.values(payload.inspection).every((value) => ["Orijinal", "Lokal Boyalı", "Boyalı", "Değişen"].includes(value)))) ||
        (payload.preferredContactMethod !== undefined && !["Telefon", "WhatsApp", "E-posta"].includes(payload.preferredContactMethod))) return Response.json({ error: "Araç detaylarını kontrol edin." }, { status: 400 });
    const photos = data.getAll("photos");
    if (photos.length > maxPhotos) return Response.json({ error: "En fazla 5 fotoğraf ekleyebilirsiniz." }, { status: 400 });
    const prepared: { file: File; bytes: ArrayBuffer; area: string }[] = [];
    for (let index = 0; index < photos.length; index++) {
      const file = photos[index];
      if (!(file instanceof File) || file.size === 0 || file.size > maxPhotoBytes) return Response.json({ error: "Fotoğraflar JPG, PNG veya WebP biçiminde ve en fazla 4 MB olmalıdır." }, { status: 400 });
      const area = data.get(`photoArea${index}`);
      const bytes = await file.arrayBuffer();
      if (typeof area !== "string" || !areas.has(area) || !validImage(new Uint8Array(bytes), file.type)) return Response.json({ error: "Bir fotoğrafın biçimi veya bölge bilgisi geçersiz." }, { status: 400 });
      prepared.push({ file, bytes, area });
    }
    if (prepared.length > 0) {
      const { env } = await import("cloudflare:workers");
      bucket = env.BUCKET;
      if (!bucket) return Response.json({ error: "Fotoğraf yükleme şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin." }, { status: 503 });
    }
    const result = await createValuationRequest(payload as ValuationRequest);
    requestId = result.id;
    for (const { file, bytes, area } of prepared) {
      const key = `valuation/${requestId}/${crypto.randomUUID()}`;
      storedKeys.push(key);
      await bucket!.put(key, bytes, { httpMetadata: { contentType: file.type } });
      const { getDb } = await import("@/db");
      await getDb().insert(valuationPhotos).values({ requestId, objectKey: key, area, fileName: file.name.slice(0, 120), contentType: file.type });
    }
    return Response.json({ id: requestId, photoCount: prepared.length }, { status: 201 });
  } catch (error) {
    console.error("Valuation request failed", error);
    for (const key of storedKeys) { try { await bucket?.delete(key); } catch (cleanupError) { console.error("Photo cleanup failed", cleanupError); } }
    if (requestId) { try { const { getDb } = await import("@/db"); await getDb().delete(valuationPhotos).where(eq(valuationPhotos.requestId, requestId)); await getDb().delete(valuationRequests).where(eq(valuationRequests.id, requestId)); } catch (cleanupError) { console.error("Request cleanup failed", cleanupError); } }
    return Response.json({ error: "Talep kaydedilemedi. Bilgileriniz ekranda duruyor; tekrar deneyin." }, { status: 500 });
  }
}
