import type { Product, ProductSpec, ProductStatus } from "@/types/product";
import type { EvotorScrapedProduct } from "./types";

/**
 * Преобразует сырой результат парсинга в карточку каталога.
 * Дополняйте полями, когда скрипт импорта начнёт тянуть характеристики из HTML/API.
 */
export function normalizeEvotorProduct(
  raw: EvotorScrapedProduct,
  defaults: Partial<Product>,
): Product {
  const specs: ProductSpec[] = defaults.specifications ?? [];
  const status = (defaults.status ?? "current") as ProductStatus;

  return {
    id: defaults.id ?? raw.slug,
    slug: raw.slug,
    name: raw.name ?? defaults.name ?? raw.slug,
    shortDescription: raw.shortDescription ?? defaults.shortDescription ?? "",
    fullDescription: defaults.fullDescription ?? "",
    image: raw.imageUrls?.[0] ?? defaults.image ?? "",
    priceFromRub: raw.priceFromRub ?? defaults.priceFromRub ?? 0,
    priceNote: defaults.priceNote,
    specifications: specs,
    status,
    statusNote: defaults.statusNote,
    sourceUrl: raw.sourceUrl,
    category: defaults.category ?? "Смарт-терминалы",
    highlights: defaults.highlights ?? [],
  };
}
