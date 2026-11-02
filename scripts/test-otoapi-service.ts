import assert from "node:assert/strict";
import { getOtoApiTechnicalVariants, OtoApiError, resetOtoApiRuntimeStateForTests } from "../services/otoApiService";

process.env.OTOAPI_ENABLED = "true";
process.env.OTOAPI_KEY = "test-key";

function json(data: unknown, status = 200, headers?: Record<string, string>) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...headers } });
}

const calls: string[] = [];
const mockFetch = (async (input: string | URL | Request) => {
  const url = String(input); calls.push(url);
  if (url.includes("/brands?")) return json({ ok: true, data: [{ id: 42, name: "Ford" }] });
  if (url.includes("/models?")) return json({ ok: true, data: [{ id: 412, name: "Focus" }] });
  if (url.includes("/cars?")) return json({ ok: true, data: [{ id: 9001 }], pagination: { total: 1, limit: 5, offset: 0, count: 1, has_more: false } });
  return json({ ok: true, data: { id: 9001, name: "Ford Focus 1.5 EcoBoost", power_hp: 150, generation_name: "Focus IV", specs: { "Genel bilgi": { "Modifikasyonu (Motor)": "1.5 EcoBoost (150 bg)" }, Performans: { "Yakıt Tipi": "Benzin" }, "Şanzıman, fren ve süspansiyon": { "Vites sayısı ve şanzıman tipi": "8 vites, otomatik şanzıman" } } } });
}) as typeof fetch;

const variants = await getOtoApiTechnicalVariants("Ford", "Focus", 2021, mockFetch);
assert.equal(calls.length, 4, "calls are sequential and limited to one result page plus details");
assert.deepEqual(variants[0], { id: 9001, engine: "1.5 EcoBoost (150 bg)", fuelType: "Benzin", transmission: "8 vites, otomatik", powerHp: 150, generation: "Focus IV", bodyType: undefined, sourceUrl: undefined });
assert.equal((await getOtoApiTechnicalVariants("Ford", "Focus", 2021, mockFetch)).length, 1);
assert.equal(calls.length, 4, "memory cache prevents duplicate API calls");

resetOtoApiRuntimeStateForTests();
let rateLimitCalls = 0;
const rateLimited = (async () => { rateLimitCalls++; return json({ ok: false, error: "limit" }, 429, { "retry-after": "60" }); }) as typeof fetch;
await assert.rejects(() => getOtoApiTechnicalVariants("Ford", "Focus", 2021, rateLimited), (error: unknown) => error instanceof OtoApiError && error.status === 429 && error.retryAfter === 60);
await assert.rejects(() => getOtoApiTechnicalVariants("Ford", "Focus", 2021, rateLimited), (error: unknown) => error instanceof OtoApiError && error.status === 429);
assert.equal(rateLimitCalls, 1, "429 cooldown prevents repeat provider requests");

process.env.OTOAPI_ENABLED = "false";
delete process.env.OTOAPI_KEY;
assert.deepEqual(await getOtoApiTechnicalVariants("Renault", "Clio", 2020, mockFetch), [], "missing key/disabled integration keeps the local catalog path working");
console.log("OtoAPI service mock tests passed");
