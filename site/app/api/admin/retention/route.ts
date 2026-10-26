import { audit, requireAdmin, sameOrigin } from "@/lib/security";
import { applyValuationRetention } from "@/services/retentionService";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 }); const identity = await requireAdmin(request, ["admin"]); if (!identity) return Response.json({ error: "Yönetici yetkisi gerekli." }, { status: 403 });
  const input = await request.json().catch(() => ({})) as { before?: string; execute?: boolean; confirmation?: string }; const before = String(input.before ?? ""); if (!/^\d{4}-\d{2}-\d{2}T/.test(before) || Number.isNaN(new Date(before).getTime())) return Response.json({ error: "Geçerli eşik tarihi gerekli." }, { status: 400 });
  const execute = input.execute === true && input.confirmation === "ANONIMLESTIR"; const result = await applyValuationRetention(new Date(before).toISOString(), execute); await audit(identity, execute ? "retention.execute" : "retention.preview", "valuation", undefined, { before, ...result }); return Response.json(result);
}
