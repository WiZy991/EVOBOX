/** Сырой объект со страницы / после парсинга (расширяйте по мере развития импорта) */
export type EvotorScrapedProduct = {
  slug: string;
  sourceUrl: string;
  name?: string;
  priceFromRub?: number;
  imageUrls?: string[];
  shortDescription?: string;
};
