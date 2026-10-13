import { getDb } from "@/db";
import { valuationDrafts } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { firstName?: string; phone?: string; vehicle?: Record<string, unknown> };
    const firstName = payload.firstName?.trim() ?? "";
    const phone = payload.phone?.replace(/\s/g, "") ?? "";
    if (!firstName || firstName.length > 80 || !/^0?5\d{9}$/.test(phone) || !payload.vehicle || JSON.stringify(payload.vehicle).length > 2_000) {
      return Response.json({ error: "Adınızı ve geçerli cep telefonu numaranızı girin." }, { status: 400 });
    }
    const [draft] = await getDb().insert(valuationDrafts).values({ firstName, phone, vehicle: payload.vehicle }).returning({ id: valuationDrafts.id });
    return Response.json({ id: draft.id }, { status: 201 });
  } catch (error) {
    console.error("Valuation draft failed", error);
    return Response.json({ error: "Taslak şu anda kaydedilemedi. Form bilgileriniz bu cihazda korunuyor." }, { status: 500 });
  }
}
