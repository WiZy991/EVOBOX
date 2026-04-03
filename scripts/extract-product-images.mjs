/**
 * Вспомогательный скрипт: вытащить пути /static/*.jpg|png из HTML карточки Эвотор.
 * Используется при ручном обновлении src/data/products.imported.json
 */
const url = process.argv[2];
if (!url) {
  console.error("Usage: node extract-product-images.mjs <product-page-url>");
  process.exit(1);
}
const t = await (await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } })).text();
const rel = [...t.matchAll(/"(\/static\/[^"]+\.(jpg|jpeg|png|webp))"/gi)].map((m) => m[1]);
const uniq = [...new Set(rel)];
const cover = uniq.find((p) => /cover|view0|_0_/i.test(p)) || uniq[0];
console.log(JSON.stringify({ url, cover: cover ? `https://evotor.ru${cover}` : null, all: uniq.slice(0, 12).map((p) => `https://evotor.ru${p}`) }, null, 2));
