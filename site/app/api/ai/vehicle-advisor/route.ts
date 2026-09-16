import { answerVehicleQuestion } from "@/services/aiVehicleAdvisorService";
import type { AdvisorRequest } from "@/types/ai";

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Partial<AdvisorRequest>;
    const message = payload.message?.trim();
    if (!message || message.length > 600) return Response.json({ error: "Geçerli bir soru girin." }, { status: 400 });
    return Response.json(await answerVehicleQuestion(message, payload.vehicle, payload.profile));
  } catch {
    return Response.json({ error: "Danışman şu an kullanılamıyor." }, { status: 500 });
  }
}
