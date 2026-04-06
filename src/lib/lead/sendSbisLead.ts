import type { LeadApiInput } from "./validators";

/**
 * Интеграция с Saby (SBIS) CRM: POST JSON на URL из панели интеграции.
 * Точный контракт API уточняйте в документации SBIS; при несовпадении формата смотрите логи сервера.
 */
export type SbisPayload = {
  formType: LeadApiInput["formType"];
  name: string;
  city: string;
  phone: string;
  email?: string;
  comment?: string;
  productName?: string;
  productSlug?: string;
  serviceTopic?: string;
  sourcePage?: string;
  source: "evoboxvl.ru";
};

export function buildSbisPayload(data: LeadApiInput): SbisPayload {
  return {
    formType: data.formType,
    name: data.name,
    city: data.city,
    phone: data.phone,
    email: data.email,
    comment: data.comment,
    productName: data.productName,
    productSlug: data.productSlug,
    serviceTopic: data.serviceTopic,
    sourcePage: data.sourcePage,
    source: "evoboxvl.ru",
  };
}

export async function sendSbisLead(data: LeadApiInput): Promise<
  { ok: true; skipped?: boolean } | { ok: false; error: string }
> {
  const enabled = process.env.SBIS_ENABLED === "true";

  if (!enabled) {
    return { ok: true, skipped: true };
  }

  const apiUrl = process.env.SBIS_API_URL?.trim();
  const apiKey = process.env.SBIS_API_KEY?.trim();
  const secretKey = process.env.SBIS_SECRET_KEY?.trim();

  if (!apiUrl || !apiKey) {
    return {
      ok: false,
      error: "SBIS_ENABLED=true, но не заданы SBIS_API_URL или SBIS_API_KEY",
    };
  }

  const payload = buildSbisPayload(data);
  const body: Record<string, unknown> = {
    ...payload,
    ...(secretKey ? { secretKey } : {}),
  };

  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 20_000);
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: ac.signal,
    });
    clearTimeout(t);

    if (!res.ok) {
      const snippet = (await res.text()).slice(0, 400);
      return {
        ok: false,
        error: `SBIS ответ ${res.status}${snippet ? `: ${snippet}` : ""}`,
      };
    }

    return { ok: true };
  } catch (e) {
    const message =
      e instanceof Error
        ? e.name === "AbortError"
          ? "SBIS: таймаут запроса"
          : e.message
        : "SBIS: неизвестная ошибка";
    return { ok: false, error: message };
  }
}
