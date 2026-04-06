import type { SubmitLeadResult } from "@/types/lead";
import { sendEmailLead } from "./sendEmailLead";
import { sendSbisLead } from "./sendSbisLead";
import { leadApiSchema, type LeadApiInput } from "./validators";

export type RawLeadBody = {
  name?: unknown;
  city?: unknown;
  phone?: unknown;
  email?: unknown;
  comment?: unknown;
  formType?: unknown;
  productName?: unknown;
  productSlug?: unknown;
  serviceTopic?: unknown;
  sourcePage?: unknown;
  companyWebsite?: unknown;
  consent?: unknown;
};

function normalizeBody(raw: RawLeadBody): unknown {
  const cityStr =
    raw.city === undefined || raw.city === null ? "" : String(raw.city).trim();
  return {
    name: raw.name,
    city: cityStr === "" ? undefined : cityStr,
    phone: raw.phone,
    email: raw.email === "" ? undefined : raw.email,
    comment: raw.comment === "" ? undefined : raw.comment,
    formType: raw.formType,
    productName: raw.productName === "" ? undefined : raw.productName,
    productSlug: raw.productSlug === "" ? undefined : raw.productSlug,
    serviceTopic: raw.serviceTopic === "" ? undefined : raw.serviceTopic,
    sourcePage: raw.sourcePage === "" ? undefined : raw.sourcePage,
    companyWebsite: raw.companyWebsite,
    consent: raw.consent === true || raw.consent === "true",
  };
}

/**
 * Валидация → почта и CRM независимы: при SBIS_ENABLED оба вызываются параллельно (Promise.all).
 * Один не блокирует другой. Успех, если хотя бы один канал сработал; ошибка — если все упали.
 */
export async function submitLead(raw: RawLeadBody): Promise<SubmitLeadResult> {
  const hp =
    typeof raw.companyWebsite === "string" ? raw.companyWebsite.trim() : "";
  if (hp.length > 0) {
    return { ok: false, error: "Отклонено", code: "SPAM" };
  }

  const parsed = leadApiSchema.safeParse(normalizeBody(raw));
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fieldMsg = Object.values(flat.fieldErrors).flat()[0];
    const formMsg = flat.formErrors[0];
    const msg = fieldMsg || formMsg || "Проверьте поля формы";
    return { ok: false, error: msg, code: "VALIDATION" };
  }

  const data: LeadApiInput = parsed.data;
  const sbisOn = process.env.SBIS_ENABLED === "true";

  if (sbisOn) {
    const [emailResult, sbisResult] = await Promise.all([
      sendEmailLead(data),
      sendSbisLead(data),
    ]);

    if (!emailResult.ok) {
      console.error("[evobox lead] Почта:", emailResult.error);
    }
    if (!sbisResult.ok) {
      console.error("[evobox lead] SBIS CRM:", sbisResult.error);
    }

    const emailOk = emailResult.ok;
    const crmOk = sbisResult.ok;

    if (emailOk || crmOk) {
      return { ok: true, emailOk, crmOk };
    }

    return {
      ok: false,
      error: `Почта: ${emailResult.error}. CRM: ${sbisResult.error}`,
      code: "INTEGRATION",
    };
  }

  const emailResult = await sendEmailLead(data);
  if (!emailResult.ok) {
    return { ok: false, error: emailResult.error, code: "EMAIL" };
  }
  return { ok: true, emailOk: true };
}
