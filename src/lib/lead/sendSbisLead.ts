import type { LeadApiInput } from "./validators";

/**
 * Интеграция с Saby (SBIS) CRM.
 *
 * Режимы (см. .env.example):
 * - JSON-RPC `CRMLead.insertRecord` на https://online.sbis.ru/service/ при SBIS_JSONRPC=true:
 *   • OAuth: `SBIS_ACCESS_TOKEN` + заголовок `Authorization: Bearer`
 *   • или логин/пароль: `SBIS_LOGIN` + `SBIS_PASSWORD` → `СБИС.Аутентифицировать` на https://online.sbis.ru/auth/service/
 *     затем `X-SBISSessionID` (сессия кэшируется в памяти процесса, см. help.sbis.ru «СБИС.Аутентифицировать»).
 * - Webhook: SBIS_JSONRPC=false — POST на SBIS_API_URL с Bearer SBIS_API_KEY.
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

/** Формат записи Saby API: поля данных `d` + схема `s` (см. CRMLead.insertRecord, help.sbis.ru). */
function sbisContactPersonRecord(data: LeadApiInput): {
  d: Record<string, string>;
  s: Record<string, string>;
} {
  const d: Record<string, string> = {
    ФИО: data.name,
    Телефон: data.phone,
  };
  const s: Record<string, string> = {
    ФИО: "Строка",
    Телефон: "Строка",
  };
  if (data.email) {
    d.email = data.email;
    s.email = "Строка";
  }
  return { d, s };
}

function buildUserConds(data: LeadApiInput): Record<string, string> {
  const conds: Record<string, string> = {
    "Тип формы": data.formType,
    Город: data.city,
    Источник: siteSource(),
  };
  if (data.sourcePage) conds["Страница"] = data.sourcePage;
  if (data.productName) conds["Товар"] = data.productName;
  if (data.productSlug) conds["Slug товара"] = data.productSlug;
  if (data.serviceTopic) conds["Услуга"] = data.serviceTopic;
  return conds;
}

function parseOptionalNomenclatures(): Array<{ code: string; price: number; count: number }> | null {
  const raw = process.env.SBIS_LEAD_NOMENCLATURES_JSON?.trim();
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const out: Array<{ code: string; price: number; count: number }> = [];
    for (const row of arr) {
      if (!row || typeof row !== "object") continue;
      const r = row as Record<string, unknown>;
      const code = typeof r.code === "string" ? r.code : "";
      const price = typeof r.price === "number" ? r.price : Number(r.price);
      const count = typeof r.count === "number" ? r.count : Number(r.count);
      if (!code || !Number.isFinite(price) || !Number.isFinite(count)) continue;
      out.push({ code, price, count: Math.trunc(count) });
    }
    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}

/**
 * Тело params для CRMLead.insertRecord: один параметр «Лид» — запись с d/s.
 * @see tz.txt п. 50, документация «Загрузить сделку в Saby CRM по API»
 */
function buildCrmLeadInsertParams(data: LeadApiInput, reglement: number): { Лид: { d: Record<string, unknown>; s: Record<string, string> } } {
  const note = buildSbisNote(data);
  const contact = sbisContactPersonRecord(data);
  const userConds = buildUserConds(data);

  const leadD: Record<string, unknown> = {
    Регламент: reglement,
    КонтактноеЛицо: contact,
    Примечание: note,
    UserConds: userConds,
  };
  const leadS: Record<string, string> = {
    Регламент: "Число целое",
    КонтактноеЛицо: "Запись",
    Примечание: "Строка",
    UserConds: "JSON-объект",
  };

  const responsible = process.env.SBIS_CRM_RESPONSIBLE?.trim();
  if (responsible) {
    leadD.Ответственный = responsible;
    leadS.Ответственный = "Строка";
  }

  const useRules = process.env.SBIS_LEAD_USE_RULES?.trim();
  if (useRules === "true" || useRules === "false") {
    leadD.UseRules = useRules === "true";
    leadS.UseRules = "Логическое";
  }

  const nomenclatures = parseOptionalNomenclatures();
  if (nomenclatures) {
    leadD.Nomenclatures = nomenclatures;
    leadS.Nomenclatures = "JSON-объект";
  }

  const srcCode = process.env.SBIS_LEAD_SRC_CODE?.trim();
  if (srcCode) {
    leadD.MrkSourceData = {
      d: { SrcCode: srcCode },
      s: { SrcCode: "Строка" },
    };
    leadS.MrkSourceData = "Запись";
  }

  return { Лид: { d: leadD, s: leadS } };
}

type SbisRpcResponse = {
  error?: { message?: string; code?: number; data?: unknown };
  result?: unknown;
};

function isLeadInsertResult(res: unknown): res is {
  d?: {
    Состояние?: string;
    "@Документ"?: number;
    ИдентификаторДокумента?: string;
  };
} {
  return typeof res === "object" && res !== null && "d" in res;
}

/** Кэш сессии логин/пароль: не дергать СБИС.Аутентифицировать на каждую заявку (лимит ~300/мин). */
let sbisSessionCache: { sessionId: string; until: number } | null = null;
let sbisAuthInflight: Promise<string> | null = null;

const SBIS_SESSION_TTL_MS = 18 * 60 * 60 * 1000;

function invalidateSbisSessionCache(): void {
  sbisSessionCache = null;
}

/**
 * @see https://sbis.ru/help/integration/api/all_methods/auth_one/
 */
async function sbisAuthenticateByPassword(): Promise<{ ok: true; sessionId: string } | { ok: false; error: string }> {
  const login = process.env.SBIS_LOGIN?.trim();
  const password = process.env.SBIS_PASSWORD?.trim();
  const authUrl = (process.env.SBIS_AUTH_URL?.trim() || "https://online.sbis.ru/auth/service/").replace(/\/?$/, "/");
  const account = process.env.SBIS_ACCOUNT_NUMBER?.trim();

  if (!login || !password) {
    return {
      ok: false,
      error:
        "SBIS_JSONRPC=true: укажите SBIS_ACCESS_TOKEN (OAuth) или пару SBIS_LOGIN + SBIS_PASSWORD (личный кабинет online.sbis.ru)",
    };
  }

  const param: Record<string, string> = { Логин: login, Пароль: password };
  if (account) param.НомерАккаунта = account;

  const rpcBody = {
    jsonrpc: "2.0" as const,
    method: "СБИС.Аутентифицировать",
    params: { Параметр: param },
    id: 0,
  };

  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 20_000);
    const res = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json-rpc;charset=utf-8",
        Accept: "application/json-rpc",
      },
      body: JSON.stringify(rpcBody),
      signal: ac.signal,
    });
    clearTimeout(t);

    const raw = await res.text();
    let parsed: SbisRpcResponse | undefined;
    try {
      parsed = JSON.parse(raw) as SbisRpcResponse;
    } catch {
      /* not json */
    }

    if (!res.ok) {
      return { ok: false, error: `SBIS авторизация HTTP ${res.status}: ${raw.slice(0, 280)}` };
    }

    if (parsed?.error) {
      const e = parsed.error;
      const msg = e.message || String(e.code ?? "ошибка");
      return { ok: false, error: `SBIS вход: ${msg}` };
    }

    const sid = parsed?.result;
    const sessionId = typeof sid === "string" && sid.length > 0 ? sid : null;
    if (!sessionId) {
      return { ok: false, error: "SBIS: пустой ответ сессии при авторизации по паролю" };
    }

    return { ok: true, sessionId };
  } catch (e) {
    const message =
      e instanceof Error
        ? e.name === "AbortError"
          ? "SBIS: таймаут авторизации"
          : e.message
        : "SBIS: ошибка авторизации";
    return { ok: false, error: message };
  }
}

async function getSbisSessionIdCached(): Promise<{ ok: true; sessionId: string } | { ok: false; error: string }> {
  const now = Date.now();
  if (sbisSessionCache && sbisSessionCache.until > now) {
    return { ok: true, sessionId: sbisSessionCache.sessionId };
  }

  if (!sbisAuthInflight) {
    sbisAuthInflight = (async () => {
      const auth = await sbisAuthenticateByPassword();
      if (!auth.ok) throw new Error(auth.error);
      sbisSessionCache = { sessionId: auth.sessionId, until: Date.now() + SBIS_SESSION_TTL_MS };
      return auth.sessionId;
    })().finally(() => {
      sbisAuthInflight = null;
    });
  }

  try {
    const sessionId = await sbisAuthInflight;
    return { ok: true, sessionId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "SBIS: ошибка входа";
    return { ok: false, error: msg };
  }
}

type SbisJsonRpcAuth =
  | { kind: "bearer"; token: string }
  | { kind: "session"; sessionId: string };

async function resolveSbisJsonRpcAuth(): Promise<{ ok: true; auth: SbisJsonRpcAuth } | { ok: false; error: string }> {
  const token = process.env.SBIS_ACCESS_TOKEN?.trim();
  if (token) {
    return { ok: true, auth: { kind: "bearer", token } };
  }

  const session = await getSbisSessionIdCached();
  if (!session.ok) {
    return session;
  }
  return { ok: true, auth: { kind: "session", sessionId: session.sessionId } };
}

function jsonRpcHeaders(auth: SbisJsonRpcAuth): Record<string, string> {
  const h: Record<string, string> = {
    "Content-Type": "application/json-rpc;charset=utf-8",
    Accept: "application/json-rpc",
  };
  if (auth.kind === "bearer") {
    h.Authorization = `Bearer ${auth.token}`;
  } else {
    h["X-SBISSessionID"] = auth.sessionId;
  }
  return h;
}

async function sendSbisJsonRpcRequest(
  serviceUrl: string,
  auth: SbisJsonRpcAuth,
  body: object,
): Promise<{ ok: true } | { ok: false; error: string; unauthorized?: boolean }> {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 25_000);
    const res = await fetch(serviceUrl, {
      method: "POST",
      headers: jsonRpcHeaders(auth),
      body: JSON.stringify(body),
      signal: ac.signal,
    });
    clearTimeout(t);

    const raw = await res.text();
    let parsed: SbisRpcResponse | undefined;
    try {
      parsed = JSON.parse(raw) as SbisRpcResponse;
    } catch {
      /* not json */
    }

    if (res.status === 401) {
      return { ok: false, error: "SBIS HTTP 401: сессия истекла или нет доступа", unauthorized: true };
    }

    if (!res.ok) {
      return { ok: false, error: `SBIS HTTP ${res.status}: ${raw.slice(0, 350)}` };
    }

    if (parsed?.error) {
      const e = parsed.error;
      const msg = e.message || String(e.code ?? "ошибка RPC");
      const low = msg.toLowerCase();
      const unauthorized =
        low.includes("unauthorized") ||
        low.includes("не авториз") ||
        low.includes("сессия") ||
        low.includes("session");
      return { ok: false, error: `SBIS RPC: ${msg}`, unauthorized };
    }

    const result = parsed?.result;
    if (isLeadInsertResult(result)) {
      const state = result.d?.Состояние?.trim();
      if (state) {
        return { ok: false, error: `Saby CRM: ${state}` };
      }
      const docId = result.d?.["@Документ"];
      if (docId !== undefined) {
        console.info("[evobox lead] Saby CRM: сделка создана, @Документ=", docId);
      }
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

async function sendSbisJsonRpc(data: LeadApiInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const reglementRaw = process.env.SBIS_CRM_REGLEMENT_ID?.trim();
  const serviceUrl = (process.env.SBIS_SERVICE_URL?.trim() || "https://online.sbis.ru/service/").replace(/\/?$/, "/");

  const reglement = reglementRaw ? Number(reglementRaw) : NaN;
  if (!Number.isFinite(reglement)) {
    return {
      ok: false,
      error: "SBIS_JSONRPC=true: задайте SBIS_CRM_REGLEMENT_ID — целое число регламента сделки из Saby CRM",
    };
  }

  const authRes = await resolveSbisJsonRpcAuth();
  if (!authRes.ok) {
    return authRes;
  }

  const params = buildCrmLeadInsertParams(data, reglement);
  const rpcBody = {
    jsonrpc: "2.0" as const,
    method: "CRMLead.insertRecord",
    params,
    id: Math.floor(Date.now() / 1000),
  };

  let first = await sendSbisJsonRpcRequest(serviceUrl, authRes.auth, rpcBody);
  if (
    !first.ok &&
    first.unauthorized &&
    authRes.auth.kind === "session"
  ) {
    invalidateSbisSessionCache();
    const again = await resolveSbisJsonRpcAuth();
    if (!again.ok) {
      return again;
    }
    first = await sendSbisJsonRpcRequest(serviceUrl, again.auth, rpcBody);
  }

  return first;
}

async function sendSbisRestWebhook(data: LeadApiInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiUrl = process.env.SBIS_API_URL?.trim();
  const apiKey = process.env.SBIS_API_KEY?.trim();
  const secretKey = process.env.SBIS_SECRET_KEY?.trim();

  if (!apiUrl || !apiKey) {
    return {
      ok: false,
      error:
        "Задайте SBIS_API_URL и SBIS_API_KEY (режим webhook) или SBIS_JSONRPC=true с SBIS_ACCESS_TOKEN / SBIS_LOGIN+SBIS_PASSWORD",
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
