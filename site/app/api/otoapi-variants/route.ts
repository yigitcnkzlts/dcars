import { NextRequest, NextResponse } from "next/server";
import { getOtoApiTechnicalVariants, isOtoApiEnabled, OtoApiError } from "@/services/otoApiService";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const brand = req.nextUrl.searchParams.get("brand")?.trim() ?? "";
  const model = req.nextUrl.searchParams.get("model")?.trim() ?? "";
  const year = Number(req.nextUrl.searchParams.get("year"));
  if (!brand || !model || !Number.isInteger(year) || year < 1886 || year > new Date().getFullYear() + 1) {
    return NextResponse.json({ variants: [], source: "otoapi", message: "Geçerli marka, model ve yıl gerekli." }, { status: 400 });
  }
  if (!isOtoApiEnabled()) {
    return NextResponse.json({ variants: [], source: "disabled", message: "Harici teknik katalog kapalı; mevcut katalog kullanılmaya devam ediyor." });
  }
  try {
    const variants = await getOtoApiTechnicalVariants(brand, model, year);
    return NextResponse.json({ variants, source: "otoapi", packageDataVerified: false }, {
      headers: { "Cache-Control": "private, max-age=300" },
    });
  } catch (cause) {
    const error = cause instanceof OtoApiError ? cause : new OtoApiError(502, "Harici teknik katalog şu anda kullanılamıyor.");
    return NextResponse.json({ variants: [], source: "otoapi", message: error.message, retryAfter: error.retryAfter }, { status: error.status });
  }
}
