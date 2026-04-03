import type { LeadApiInput } from "./validators";

/**
 * Заглушка для будущей интеграции с CRM SBIS.
 * Не вызывать напрямую из форм — только через submitLead().
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

  const apiUrl = process.env.SBIS_API_URL;
  const apiKey = process.env.SBIS_API_KEY;

  if (!apiUrl || !apiKey) {
    return {
      ok: false,
      error: "SBIS_ENABLED=true, но не заданы SBIS_API_URL или SBIS_API_KEY",
    };
  }

  const _payload = buildSbisPayload(data);

  try {
    void apiUrl;
    void apiKey;
    void _payload;
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "SBIS: неизвестная ошибка";
    return { ok: false, error: message };
  }
}
