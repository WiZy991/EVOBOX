const t = await (
  await fetch("https://evotor.ru/product/evotor-6/", {
    headers: { "user-agent": "Mozilla/5.0" },
  })
).text();
const rel = [...t.matchAll(/"(\/[^"]+\.(jpg|jpeg|png|webp))"/gi)].map((m) => m[1]);
console.log("rel imgs", [...new Set(rel)].slice(0, 20));
const abs = [...t.matchAll(/"https:\/\/evotor\.ru[^"]+"/g)].map((m) => m[0]).filter((s) => /\.(jpg|png|webp)/i.test(s));
console.log("abs", abs.slice(0, 15));
