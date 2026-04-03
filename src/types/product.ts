export type ProductStatus = "current" | "archive" | "discontinued";

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  /** Прямой URL превью (CDN); на сайте не используется как ссылка для пользователя */
  image: string;
  /** Минимальная цена «от N ₽» с официального сайта на момент наполнения */
  priceFromRub: number;
  priceNote?: string;
  specifications: ProductSpec[];
  status: ProductStatus;
  /** Для архивных моделей — пояснение (например, замена на 7.3) */
  statusNote?: string;
  /** Служебный URL карточки при импорте; не показывать на сайте как ссылку */
  sourceUrl: string;
  category: string;
  /** Ключевые особенности для карточки */
  highlights: string[];
};
