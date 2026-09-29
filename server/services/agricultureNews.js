import { XMLParser } from "fast-xml-parser";

const FEED_URL = "https://news.google.com/rss/search?" + new URLSearchParams({
  q: "agriculture India when:7d",
  hl: "en-IN",
  gl: "IN",
  ceid: "IN:en"
});
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_FEED_BYTES = 1_000_000;
const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false, trimValues: true });
const indiaAgricultureContext = /\b(india|indian|andhra pradesh|arunachal|assam|bihar|chhattisgarh|goa|gujarat|haryana|himachal|jharkhand|karnataka|kerala|madhya pradesh|maharashtra|manipur|meghalaya|mizoram|nagaland|odisha|orissa|punjab|rajasthan|sikkim|tamil nadu|telangana|tripura|uttar pradesh|uttarakhand|west bengal|delhi|ladakh|kashmir|chitrakoot|kisan|msp|icar|e-nam|pm-r?kvy|pm-kisan|pib|niti aayog|rupees|rs\.?\s?\d)/i;

let cached = { items: [], fetchedAt: 0 };

function decodeEntities(value = "") {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function toItems(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeItem(item) {
  const url = new URL(String(item.link || ""));
  if (url.protocol !== "https:" || url.hostname !== "news.google.com") return null;
  const publishedAt = new Date(item.pubDate);
  if (Number.isNaN(publishedAt.getTime())) return null;
  const ageMs = Date.now() - publishedAt.getTime();
  if (ageMs < -60 * 60 * 1000 || ageMs > 14 * 24 * 60 * 60 * 1000) return null;

  const source = decodeEntities(item.source || "Google News").trim().slice(0, 80);
  let title = decodeEntities(item.title).trim();
  const publisherSuffix = ` - ${source}`;
  if (title.toLowerCase().endsWith(publisherSuffix.toLowerCase())) {
    title = title.slice(0, -publisherSuffix.length).trim();
  }
  if (!indiaAgricultureContext.test(title)) return null;
  if (!title) return null;
  return {
    title: title.slice(0, 240),
    source,
    url: url.href,
    publishedAt: publishedAt.toISOString()
  };
}

export async function getAgricultureNews() {
  if (cached.fetchedAt && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return { items: cached.items, updatedAt: new Date(cached.fetchedAt).toISOString(), stale: false };
  }

  try {
    const response = await fetch(FEED_URL, {
      headers: { accept: "application/rss+xml, application/xml, text/xml" },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error("Agriculture news feed request failed.");
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > MAX_FEED_BYTES) throw new Error("Agriculture news feed is too large.");

    const xml = new TextDecoder().decode(bytes);
    const feed = parser.parse(xml);
    const parsedItems = toItems(feed?.rss?.channel?.item)
      .map((item) => {
        try { return normalizeItem(item); } catch { return null; }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 10);

    cached = { items: parsedItems, fetchedAt: Date.now() };
    return { items: cached.items, updatedAt: new Date(cached.fetchedAt).toISOString(), stale: false };
  } catch (error) {
    if (cached.items.length) {
      return { items: cached.items, updatedAt: new Date(cached.fetchedAt).toISOString(), stale: true };
    }
    throw error;
  }
}
