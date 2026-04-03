import type { EvotorScrapedProduct } from "./types";

const USER_AGENT = "Mozilla/5.0 (compatible; EVOBOX-product-import/1.0; +https://evoboxvl.ru)";

/**
 * Минимальный парсер HTML карточки Эвотор (Gatsby): цена «от N ₽», пути /static/*.jpg|png.
 * Не вызывать из клиентского кода — только из Node-скрипта импорта или CI.
 */
export async function parseEvotorProductPage(sourceUrl: string): Promise<EvotorScrapedProduct> {
  const slug = sourceUrl.split("/").filter(Boolean).pop()?.replace(/\/$/, "") ?? "unknown";
  const res = await fetch(sourceUrl, { headers: { "user-agent": USER_AGENT } });
  const html = await res.text();

  const priceMatch = html.match(/От\s+([\d\s]+)\s*₽/);
  const priceFromRub = priceMatch
    ? parseInt(priceMatch[1].replace(/\s/g, ""), 10)
    : undefined;

  const imgPaths = Array.from(
    html.matchAll(/"(\/static\/[^"]+\.(jpg|jpeg|png|webp))"/gi),
    (m) => `https://evotor.ru${m[1]}`,
  );

  const titleMatch = html.match(/<title>([^<|]+)/i);
  const name = titleMatch?.[1]?.split("|")[0]?.trim();

  return {
    slug,
    sourceUrl,
    name,
    priceFromRub,
    imageUrls: Array.from(new Set(imgPaths)).slice(0, 16),
    shortDescription: name,
  };
}

/** Список URL для пакетного импорта (синхронизируйте с ассортиментом на evotor.ru) */
export const EVOTOR_PRODUCT_PAGE_URLS: string[] = [
  "https://evotor.ru/product/evotor-6/",
  "https://evotor.ru/product/evotor-5i/",
  "https://evotor.ru/product/evotor-5-st/",
  "https://evotor.ru/product/evotor-7-3/",
  "https://evotor.ru/product/evotor-10/",
  "https://evotor.ru/product/power-st/",
  "https://evotor.ru/product/power-pos-base/",
  "https://evotor.ru/product/evotor-7-2/",
];
