import type { Product } from "@/types/product";
import imported from "./products.imported.json";

const list = imported as Product[];

export const products: Product[] = list;

export const productCategories = Array.from(new Set(products.map((p) => p.category)));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCurrentProducts(): Product[] {
  return products.filter((p) => p.status === "current");
}

export function getArchiveProducts(): Product[] {
  return products.filter((p) => p.status !== "current");
}

export function formatProductPrice(p: Product): string {
  if (p.status === "discontinued" && p.priceFromRub <= 0) {
    return "—";
  }
  if (p.priceFromRub <= 0) return "уточняйте";
  const base = `от ${p.priceFromRub.toLocaleString("ru-RU")} ₽`;
  return p.priceNote ? `${base} (${p.priceNote})` : base;
}

/** Для превью на главной — только актуальные, порядок как в ТЗ */
export function getLandingEquipment(): Product[] {
  const order = [
    "evotor-6",
    "evotor-5i",
    "evotor-5-st",
    "evotor-7-3",
    "evotor-10",
    "evotor-power-st",
    "evotor-power-pos-base",
  ];
  return order.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
}
