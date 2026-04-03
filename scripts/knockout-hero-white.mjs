#!/usr/bin/env node
/**
 * Делает PNG для hero: прозрачный фон (связная белая область от краёв изображения).
 * Белый корпус терминала внутри кадра не трогаем — он не соединён с краями через чисто белые пиксели.
 *
 * node scripts/knockout-hero-white.mjs
 *
 * Зависимость sharp не в package.json сайта (сборка на слабом VPS). Перед запуском: npm i -D sharp
 */

import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "images", "hero-evotor-6.png");
const DEFAULT_URL =
  "https://evotor.ru/static/8c8da6a5c9fe1d58558d90d2464c413a/evotor6_view0_cd997d7c5d.jpg";

/** Пиксель считаем «фоном», если все каналы не ниже порога (почти белый) */
function isBg(r, g, b, minChannel) {
  return r >= minChannel && g >= minChannel && b >= minChannel;
}

async function main() {
  const url = process.argv[2] || DEFAULT_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const stride = channels;
  const w = width;
  const h = height;
  const minCh = Number(process.argv[3]) || 236;

  const visited = new Uint8Array(w * h);
  const qx = [];
  const qy = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (visited[p]) return;
    const i = p * stride;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!isBg(r, g, b, minCh)) return;
    visited[p] = 1;
    qx.push(x);
    qy.push(y);
  };

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  let qi = 0;
  while (qi < qx.length) {
    const x = qx[qi];
    const y = qy[qi];
    qi++;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  const out = Buffer.from(data);
  for (let p = 0; p < w * h; p++) {
    if (visited[p]) {
      out[p * stride + 3] = 0;
    } else {
      out[p * stride + 3] = 255;
    }
  }

  const png = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, png);
  console.error("Wrote", OUT, `(${w}×${h}, minChannel=${minCh})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
