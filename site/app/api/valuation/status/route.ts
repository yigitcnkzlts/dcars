import { and, count, eq } from "drizzle-orm";
import { valuationPhotos, valuationRequests } from "@/db/schema";

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") || 0) > 2048) return Response.json({ error: "Sorgu çok uzun." }, { status: 413 });
    const input = await request.json() as { id?: number | string; phone?: string };
    const id = Number(input.id);
    const phone = String(input.phone ?? "").replace(/\s/g, "");
    if (!Number.isSafeInteger(id) || id < 1 || !/^0?5\d{9}$/.test(phone)) return Response.json({ error: "Başvuru numarası ve telefonunuzu kontrol edin." }, { status: 400 });
    const { getDb } = await import("@/db");
    const db = getDb();
    const [record] = await db.select({ id: valuationRequests.id, brand: valuationRequests.brand, model: valuationRequests.model, year: valuationRequests.year, status: valuationRequests.status, createdAt: valuationRequests.createdAt }).from(valuationRequests).where(and(eq(valuationRequests.id, id), eq(valuationRequests.phone, phone))).limit(1);
    if (!record) return Response.json({ error: "Bu bilgilerle başvuru bulunamadı." }, { status: 404 });
    const [photoResult] = await db.select({ total: count() }).from(valuationPhotos).where(eq(valuationPhotos.requestId, id));
    return Response.json({ id: record.id, vehicle: [record.year, record.brand, record.model].filter(Boolean).join(" "), status: record.status === "received" ? "Başvuru alındı" : "Güncelleme için ekibimizle iletişime geçin", photoCount: photoResult?.total ?? 0, createdAt: record.createdAt });
  } catch {
    return Response.json({ error: "Başvuru şu an sorgulanamıyor. Lütfen daha sonra tekrar deneyin." }, { status: 503 });
  }
}
