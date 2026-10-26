const BASE_URL = "https://otoapi.net/api/v1";
const REQUEST_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_RATE_LIMIT_COOLDOWN_MS = 15 * 60 * 1000;

export type OtoApiTechnicalVariant = {
  id: number;
  engine: string;
  fuelType: string;
  transmission: string;
  powerHp?: number;
  generation?: string;
  bodyType?: string;
  sourceUrl?: string;
};

type ListResponse<T> = {
  ok: boolean;
  data: T[];
  pagination?: { total: number; limit: number; offset: number; count: number; has_more: boolean };
};

type DetailResponse = {
  ok: boolean;
  data: {
    id: number;
    name: string;
    specs?: Record<string, Record<string, string>>;
    power_hp?: number | null;
    fuel_type?: string | null;
    body_type?: string | null;
    generation_name?: string | null;
    url?: string | null;
  };
};

export class OtoApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) {
    super(message);
    this.name = "OtoApiError";
  }
}
let requestQueue: Promise<void> = Promise.resolve();
const memoryCache = new Map<string, { expiresAt: number; data: OtoApiTechnicalVariant[] }>();
let rateLimitedUntil = 0;

function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = requestQueue.then(operation, operation);
  requestQueue = result.then(() => undefined, () => undefined);
  return result;
}

function errorMessage(status: number): string {
  if (status === 401) return "OtoAPI anahtarı geçersiz veya eksik.";
  if (status === 403) return "OtoAPI bu çalışma ortamından erişime izin vermiyor.";
  if (status === 422) return "OtoAPI sorgu parametrelerini kabul etmedi.";
  if (status === 429) return "OtoAPI istek limiti doldu. Mevcut katalog veya manuel giriş kullanılabilir.";
  return "OtoAPI şu anda yanıt vermiyor. Mevcut katalog veya manuel giriş kullanılabilir.";
}

async function request<T>(path: string, fetcher: typeof fetch): Promise<T> {
  const apiKey = process.env.OTOAPI_KEY;
  if (!apiKey) throw new OtoApiError(503, "OtoAPI anahtarı yapılandırılmamış.");

  if (rateLimitedUntil > Date.now()) {
    throw new OtoApiError(429, errorMessage(429), Math.ceil((rateLimitedUntil - Date.now()) / 1000));
  }

  return enqueue(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetcher(`${BASE_URL}${path}`, {
        headers: { "X-API-Key": apiKey, Accept: "application/json" },
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok) {
        const retryAfter = Number(response.headers.get("retry-after")) || undefined;
        if (response.status === 429) {
          rateLimitedUntil = Date.now() + (retryAfter ? retryAfter * 1000 : DEFAULT_RATE_LIMIT_COOLDOWN_MS);
        }
        throw new OtoApiError(response.status, errorMessage(response.status), retryAfter);
      }
      return await response.json() as T;
    } catch (cause) {
      if (cause instanceof OtoApiError) throw cause;
      if (cause instanceof Error && cause.name === "AbortError") {
        throw new OtoApiError(504, "OtoAPI isteği zaman aşımına uğradı.");
      }
      throw new OtoApiError(502, errorMessage(502));
    } finally {
      clearTimeout(timer);
    }
  });
}

const normalize = (value: string) => value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

function exactByName<T extends { name: string }>(items: T[], name: string): T | undefined {
  const target = normalize(name);
  return items.find((item) => normalize(item.name) === target);
}

function spec(detail: DetailResponse["data"], group: string, key: string): string {
  return detail.specs?.[group]?.[key]?.trim() ?? "";
}

function normalizeTransmission(value: string): string {
  if (!value) return "Belirtilmemiş";
  const lower = normalize(value);
  if (lower.includes("otomatik")) return value.replace(/şanzıman/gi, "").trim();
  if (lower.includes("manuel")) return value.replace(/şanzıman/gi, "").trim();
  return value;
}

function toTechnicalVariant(detail: DetailResponse["data"]): OtoApiTechnicalVariant {
  const modification = spec(detail, "Genel bilgi", "Modifikasyonu (Motor)") || detail.name;
  return {
    id: detail.id,
    engine: modification,
    fuelType: spec(detail, "Performans", "Yakıt Tipi") || detail.fuel_type || "Belirtilmemiş",
    transmission: normalizeTransmission(spec(detail, "Şanzıman, fren ve süspansiyon", "Vites sayısı ve şanzıman tipi")),
    powerHp: detail.power_hp ?? undefined,
    generation: detail.generation_name ?? (spec(detail, "Genel bilgi", "Nesil") || undefined),
    bodyType: detail.body_type ?? (spec(detail, "Genel bilgi", "Gövde tipi") || undefined),
    sourceUrl: detail.url ?? undefined,
  };
}

export function isOtoApiEnabled(): boolean {
  return process.env.OTOAPI_ENABLED === "true" && Boolean(process.env.OTOAPI_KEY);
}

/** Test isolation helper; production code must not use this to bypass cooldowns. */
export function resetOtoApiRuntimeStateForTests(): void {
  if (process.env.NODE_ENV === "production") return;
  memoryCache.clear();
  rateLimitedUntil = 0;
  requestQueue = Promise.resolve();
}

/** Fetches only one API page (max five cars on Free) and never persists provider data. */
export async function getOtoApiTechnicalVariants(
  brandName: string,
  modelName: string,
  year: number,
  fetcher: typeof fetch = fetch,
): Promise<OtoApiTechnicalVariant[]> {
  if (!isOtoApiEnabled()) return [];
  const cacheKey = `${normalize(brandName)}|${normalize(modelName)}|${year}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const brands = await request<ListResponse<{ id: number; name: string }>>(`/brands?q=${encodeURIComponent(brandName)}&offset=0`, fetcher);
  const brand = exactByName(brands.data, brandName);
  if (!brand) return [];

  const models = await request<ListResponse<{ id: number; name: string }>>(`/models?brand_id=${brand.id}&q=${encodeURIComponent(modelName)}&offset=0`, fetcher);
  const model = exactByName(models.data, modelName);
  if (!model) return [];

  const cars = await request<ListResponse<{ id: number }>>(`/cars?brand_id=${brand.id}&model_id=${model.id}&year=${year}&offset=0`, fetcher);
  const variants: OtoApiTechnicalVariant[] = [];
  for (const car of cars.data) {
    const detail = await request<DetailResponse>(`/cars/${car.id}`, fetcher);
    variants.push(toTechnicalVariant(detail.data));
  }
  memoryCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, data: variants });
  return variants;
}
