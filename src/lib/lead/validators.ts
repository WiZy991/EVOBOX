import { z } from "zod";
import type { LeadFormType } from "@/types/lead";
import { isCompleteRuPhone } from "@/lib/utils/formatPhoneMask";

const formTypes = [
  "consultation",
  "request",
  "callback",
  "product",
  "equipment",
] as const satisfies readonly LeadFormType[];

export const leadApiSchema = z
  .object({
    name: z.string().trim().min(1, "Укажите имя"),
    city: z.string().trim().min(2, "Укажите город"),
    phone: z
      .string()
      .trim()
      .refine(isCompleteRuPhone, { message: "Введите номер полностью: +7 (___) ___-__-__" }),
    email: z.string().trim().optional(),
    comment: z.string().trim().optional(),
    formType: z.enum(formTypes),
    productName: z.string().trim().optional(),
    productSlug: z.string().trim().optional(),
    serviceTopic: z.string().trim().max(500).optional(),
    sourcePage: z.string().trim().optional(),
    companyWebsite: z.string().optional(),
    consent: z
      .boolean()
      .refine((v) => v === true, { message: "Необходимо согласие на обработку данных" }),
  })
  .superRefine((val, ctx) => {
    if (val.email && val.email.length > 0) {
      const ok = z.string().email().safeParse(val.email).success;
      if (!ok) {
        ctx.addIssue({
          code: "custom",
          message: "Некорректный email",
          path: ["email"],
        });
      }
    }
  });

export type LeadApiInput = z.infer<typeof leadApiSchema>;
