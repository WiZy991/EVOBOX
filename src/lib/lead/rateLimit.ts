const buckets = new Map<string, number[]>();

/**
 * Простая защита от спама: не более max запросов за windowMs с одного ключа (например IP).
 * Для serverless без общего хранилища эффект ограничен — при масштабировании заменить на Redis и т.п.
 */
export function checkLeadRateLimit(
  key: string,
  max = 8,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const prev = buckets.get(key) ?? [];
  const fresh = prev.filter((t) => now - t < windowMs);
  if (fresh.length >= max) {
    return false;
  }
  fresh.push(now);
  buckets.set(key, fresh);
  return true;
}
