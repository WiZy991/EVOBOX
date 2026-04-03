#!/usr/bin/env node
/**
 * Импорт карточек с публичных страниц evotor.ru (без браузера).
 * Запуск: node scripts/import-evotor-products.mjs
 * Результат: вывод JSON в stdout — перенаправьте в src/data/products.imported.json вручную или через пайп.
 *
 * Важно: полные описания и статусы лучше доработать вручную после импорта цен/картинок.
 */

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const URLS = [
  "https://evotor.ru/product/evotor-6/",
  "https://evotor.ru/product/evotor-5i/",
  "https://evotor.ru/product/evotor-5-st/",
  "https://evotor.ru/product/evotor-7-3/",
  "https://evotor.ru/product/evotor-10/",
  "https://evotor.ru/product/power-st/",
  "https://evotor.ru/product/power-pos-base/",
  "https://evotor.ru/product/evotor-7-2/",
];

async function parsePage(sourceUrl) {
  const res = await fetch(sourceUrl, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; EVOBOX-import/1.0)" },
  });
  const html = await res.text();
  const slug = sourceUrl.replace(/\/$/, "").split("/").pop() || "x";

  const priceMatch = html.match(/От\s+([\d\s]+)\s*₽/) || html.match(/(\d[\d\s]*)\s*₽/);
  const priceFromRub = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, ""), 10) : 0;

  const imgs = Array.from(
    html.matchAll(/"(\/static\/[^"]+\.(jpg|jpeg|png|webp))"/gi),
    (m) => `https://evotor.ru${m[1]}`,
  );

  const cover =
    imgs.find((u) => /cover|view0|main/i.test(u)) || imgs[0] || "";

  const discontinued = /снят/i.test(html) && /производств/i.test(html);

  return {
    slug,
    sourceUrl,
    priceFromRub,
    image: cover,
    discontinued,
    imageCandidates: Array.from(new Set(imgs)).slice(0, 8),
  };
}

async function main() {
  const rows = [];
  for (const u of URLS) {
    try {
      rows.push(await parsePage(u));
      console.error("ok", u);
    } catch (e) {
      console.error("fail", u, e);
    }
  }
  console.log(JSON.stringify(rows, null, 2));
  writeFileSync(join(__dirname, "..", "src", "data", "import-debug.json"), JSON.stringify(rows, null, 2));
  console.error("Wrote import-debug.json (raw scrape). Merge into products.imported.json manually.");
}

main();
