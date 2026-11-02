export type AutomotiveNews = {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: "İkinci el piyasası" | "Otomotiv sektörü";
};

const FEEDS = [
  { query: '"ikinci el otomobil" Türkiye when:30d', category: "İkinci el piyasası" },
  { query: '"otomotiv pazarı" Türkiye when:30d', category: "Otomotiv sektörü" },
] as const;
const CACHE_MS = 30 * 60 * 1000;
const MAX_AGE_MS = 45 * 24 * 60 * 60 * 1000;
let cache: { at: number; items: AutomotiveNews[] } | undefined;
let pending: Promise<AutomotiveNews[]> | undefined;

function decodeXml(value: string): string {
  return value.replace(/^<!\[CDATA\[|\]\]>$/g, "").replace(/&#(x[0-9a-f]+|\d+);|&(amp|lt|gt|quot|apos|#39);/gi, (_match, number: string | undefined, named: string | undefined) => {
    if (number) { const code = number[0].toLowerCase() === "x" ? parseInt(number.slice(1), 16) : parseInt(number, 10); return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ""; }
    return ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'" } as Record<string, string>)[(named ?? "").toLowerCase()] ?? "";
  }).replace(/<[^>]*>/g, "").trim();
}

function field(xml: string, name: string): string {
  return decodeXml(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1] ?? "");
}

function parseFeed(xml: string, category: AutomotiveNews["category"]): AutomotiveNews[] {
  const now = Date.now();
  return Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi), ([, item]) => {
    const title = field(item, "title").replace(/\s+[-–]\s+[^-–]+$/, "");
    const source = field(item, "source") || "Haber kaynağı";
    const url = field(item, "link");
    const publishedAt = field(item, "pubDate");
    const timestamp = Date.parse(publishedAt);
    if (!title || !/^https:\/\/news\.google\.com\/rss\/articles\//.test(url) || !Number.isFinite(timestamp) || timestamp > now + 60_000 || now - timestamp > MAX_AGE_MS) return null;
    if (!/(ikinci el|otomobil|otomotiv|araç|oto pazar|sıfır km|elektrikli)/i.test(title)) return null;
    return { title: title.slice(0, 180), source: source.slice(0, 80), url, publishedAt: new Date(timestamp).toISOString(), category };
  }).filter((item): item is AutomotiveNews => item !== null);
}

async function refreshNews(): Promise<AutomotiveNews[]> {
  const results = await Promise.allSettled(FEEDS.map(async ({ query, category }) => {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=tr&gl=TR&ceid=TR:tr`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000), headers: { Accept: "application/rss+xml, application/xml" } });
    if (!response.ok) throw new Error(`News feed returned ${response.status}`);
    const xml = await response.text();
    if (xml.length > 1_000_000) throw new Error("News feed too large");
    return parseFeed(xml, category);
  }));
  const byTitle = new Map<string, AutomotiveNews>();
  for (const result of results) if (result.status === "fulfilled") for (const article of result.value) byTitle.set(article.title.toLocaleLowerCase("tr-TR"), article);
  const items = [...byTitle.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 9);
  if (items.length) cache = { at: Date.now(), items };
  return items.length ? items : cache?.items ?? [];
}

export async function getAutomotiveNews(): Promise<AutomotiveNews[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.items;
  if (!pending) pending = refreshNews().finally(() => { pending = undefined; });
  try { return await pending; } catch { return cache?.items ?? []; }
}
