export type LeadFormType =
  | "consultation"
  | "request"
  | "callback"
  | "product"
  | "equipment";

export type LeadPayload = {
  name: string;
  city: string;
  phone: string;
  email?: string;
  comment?: string;
  formType: LeadFormType;
  productName?: string;
  productSlug?: string;
  /** Выбранная услуга партнёра (карточки на главной) */
  serviceTopic?: string;
  sourcePage?: string;
  /** Honeypot — must be empty */
  companyWebsite?: string;
};

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; error: string; code?: "VALIDATION" | "RATE_LIMIT" | "EMAIL" | "SBIS" | "SPAM" };
