export type { LeadFormType, LeadPayload, SubmitLeadResult } from "@/types/lead";

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  formType: import("@/types/lead").LeadFormType;
  productName?: string;
  serviceName?: string;
  companyWebsite?: string;
  consent: boolean;
};
