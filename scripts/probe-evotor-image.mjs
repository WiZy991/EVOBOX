const url = process.argv[2] || "https://evotor.ru/product/evotor-6/";
const r = await fetch(url, {
  headers: { "user-agent": "Mozilla/5.0 (compatible; EVOBOX-import/1.0)" },
});
const t = await r.text();
if (t.length < 500) console.log("short body", t.slice(0, 200));
let og = t.match(/property="og:image" content="([^"]+)"/);
if (!og) og = t.match(/content="([^"]+)" property="og:image"/);
if (!og) og = t.match(/<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/);
const firstImg = t.match(/https:\/\/evotor\.ru\/wp-content\/[^"'\s>]+\.(webp|jpg|jpeg|png)/i);
console.log("og:image", og?.[1] || "none");
console.log("first wp img", firstImg?.[0] || "none");
const idx = t.indexOf("og:image");
console.log("idx og:image", idx);
if (idx >= 0) console.log(t.slice(idx, idx + 120));
console.log("body len", t.length, "head", t.slice(0, 200).replace(/\s+/g, " "));
const w = t.match(/\.webp/g);
console.log("webp count", w?.length || 0);
const g = t.match(/"gatsbyImageData":\{[^}]{0,200}/);
console.log("gatsby?", !!g);
const u = t.match(/https:\/\/images\.evotor\.ru[^"']+/);
console.log("images.evotor", u?.[0] || "none");
const u2 = t.match(/https:\/\/a\.storyblok\.com[^"']+/);
console.log("storyblok", u2?.[0] || "none");
