import type { LeadApiInput } from "./validators";

/**
 * Интеграция с Saby (SBIS) CRM.
 *
 * Режимы (см. .env.example):
 * - JSON-RPC `CRMLead.insertRecord` на https://online.sbis.ru/service/ — при SBIS_JSONRPC=true + токен OAuth и ID регламента (как в документации Saby).
 * - Произвольный webhook — POST на SBIS_API_URL с телом JSON и Bearer SBIS_API_KEY (если так настроена ваша интеграция).
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
  source: string;
};

function siteSource(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "evoboxvl.ru";
  return base;
}

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
    source: siteSource(),
  };
}

function buildSbisNote(data: LeadApiInput): string {
  const parts = [
    `Город: ${data.city}`,
    data.formType && `Тип: ${data.formType}`,
    data.productName && `Товар: ${data.productName}`,
    data.serviceTopic && `Услуга: ${data.serviceTopic}`,
    data.sourcePage && `Страница: ${data.sourcePage}`,
    data.comment && `Комментарий: ${data.comment}`,
  ].filter(Boolean) as string[];
  return parts.join("\n");
}

async function sendSbisJsonRpc(data: LeadApiInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = process.env.SBIS_ACCESS_TOKEN?.trim();
  const reglementRaw = process.env.SBIS_CRM_REGLEMENT_ID?.trim();
  const serviceUrl = (process.env.SBIS_SERVICE_URL?.trim() || "https://online.sbis.ru/service/").replace(/\/?$/, "/");

  if (!token) {
    return { ok: false, error: "SBIS_JSONRPC=true: задайте SBIS_ACCESS_TOKEN (OAuth, см. help.sbis.ru API авторизация)" };
  }
  const reglement = reglementRaw ? Number(reglementRaw) : NaN;
  if (!Number.isFinite(reglement)) {
    return {
      ok: false,
      error: "SBIS_JSONRPC=true: задайте SBIS_CRM_REGLEMENT_ID — целое число регламента сделки из Saby CRM",
    };
  }

  const note = buildSbisNote(data);
  const params: Record<string, unknown> = {
    Регламент: reglement,
    Клиент: {
      Наименование: `${data.name}, ${data.city}`,
      Type: [2],
    },
    КонтактноеЛицо: {
      ФИО: data.name,
      Телефон: data.phone,
      ...(data.email ? { email: data.email } : {}),
      Примечание: note,
    },
  };

  const body = {
    jsonrpc: "2.0",
    method: "CRMLead.insertRecord",
    params,
    id: Math.floor(Date.now() / 1000),
  };

  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 25_000);
    const res = await fetch(serviceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json-rpc;charset=utf-8",
        Accept: "application/json-rpc",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: ac.signal,
    });
    clearTimeout(t);

    const raw = await res.text();
    let rpcError: { message?: string; code?: number } | undefined;
    try {
      const parsed = JSON.parse(raw) as { error?: { message?: string; code?: number } };
      rpcError = parsed.error;
    } catch {
      /* not json */
    }

    if (!res.ok) {
      return { ok: false, error: `SBIS HTTP ${res.status}: ${raw.slice(0, 350)}` };
    }

    if (rpcError) {
      const msg = rpcError.message || String(rpcError.code ?? "ошибка RPC");
      return { ok: false, error: `SBIS RPC: ${msg}` };
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

async function sendSbisRestWebhook(data: LeadApiInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiUrl = process.env.SBIS_API_URL?.trim();
  const apiKey = process.env.SBIS_API_KEY?.trim();
  const secretKey = process.env.SBIS_SECRET_KEY?.trim();

  if (!apiUrl || !apiKey) {
    return {
      ok: false,
      error: "Задайте SBIS_API_URL и SBIS_API_KEY (режим webhook) или включите SBIS_JSONRPC=true с SBIS_ACCESS_TOKEN",
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

export async function sendSbisLead(data: LeadApiInput): Promise<
  { ok: true; skipped?: boolean } | { ok: false; error: string }
> {
  const enabled = process.env.SBIS_ENABLED === "true";

  if (!enabled) {
    return { ok: true, skipped: true };
  }

  const useJsonRpc = process.env.SBIS_JSONRPC === "true";

  if (useJsonRpc) {
    return sendSbisJsonRpc(data);
  }

  return sendSbisRestWebhook(data);
}
