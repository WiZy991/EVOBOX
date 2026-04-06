"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { LeadFormType } from "@/types/lead";
import { getPartnerServiceBySlug } from "@/data/partner-services-data";
import { formatRuPhoneMask, isCompleteRuPhone } from "@/lib/utils/formatPhoneMask";
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";

const formSchema = z
  .object({
    name: z.string().trim().min(1, "Укажите имя"),
    city: z.string().trim().min(2, "Укажите город"),
    phone: z
      .string()
      .trim()
      .refine(isCompleteRuPhone, { message: "Введите номер полностью: +7 (___) ___-__-__" }),
    email: z.string().trim().optional(),
    comment: z.string().trim().optional(),
    consent: z.boolean().refine((v) => v === true, {
      message: "Необходимо согласие на обработку данных",
    }),
    companyWebsite: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.email && val.email.length > 0) {
      if (!z.string().email().safeParse(val.email).success) {
        ctx.addIssue({
          code: "custom",
          message: "Некорректный email",
          path: ["email"],
        });
      }
    }
  });

export type LeadFormValues = z.infer<typeof formSchema>;

type LeadFormProps = {
  formType: LeadFormType;
  productName?: string;
  productSlug?: string;
  /** Если не передан — берётся текущий путь */
  sourcePage?: string;
  title?: string;
  submitLabel?: string;
  redirectToThanks?: boolean;
  className?: string;
  /** После успешной отправки (без редиректа на /thanks), например закрыть модальное окно */
  onSubmittedSuccessfully?: () => void;
};

function LeadFormInner({
  formType,
  productName,
  productSlug,
  sourcePage: sourcePageProp,
  title = "Оставить заявку",
  submitLabel = "Отправить",
  redirectToThanks = false,
  className,
  onSubmittedSuccessfully,
}: LeadFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sourcePage = sourcePageProp ?? pathname;

  const resolvedFormType = useMemo<LeadFormType>(() => {
    const intent = searchParams.get("intent");
    if (intent === "consultation") return "consultation";
    if (intent === "equipment") return "equipment";
    return formType;
  }, [searchParams, formType]);

  const serviceFromQuery = searchParams.get("service");
  const selectedService = useMemo(() => {
    if (!serviceFromQuery) return undefined;
    return getPartnerServiceBySlug(serviceFromQuery);
  }, [serviceFromQuery]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /** Показать в экране «отправлено», пока URL уже без ?service= */
  const [submittedServiceTitle, setSubmittedServiceTitle] = useState<string | null>(null);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      city: "",
      phone: "",
      email: "",
      comment: "",
      consent: false,
      companyWebsite: "",
    },
  });

  async function onSubmit(values: LeadFormValues) {
    if (values.companyWebsite?.trim()) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    const serviceTitle = selectedService?.title;

    const payload = {
      name: values.name,
      city: values.city.trim(),
      phone: values.phone,
      email: values.email || undefined,
      comment: values.comment || undefined,
      formType: selectedService ? ("request" as const) : resolvedFormType,
      productName: productName || undefined,
      productSlug: productSlug || undefined,
      serviceTopic: serviceTitle,
      sourcePage,
      companyWebsite: values.companyWebsite || "",
      consent: true as const,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Не удалось отправить. Попробуйте позже или позвоните нам.");
        return;
      }

      setSubmittedServiceTitle(serviceTitle ?? null);

      if (serviceFromQuery) {
        const p = new URLSearchParams(searchParams.toString());
        p.delete("service");
        const qs = p.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }

      setStatus("success");
      form.reset({
        name: "",
        city: "",
        phone: "",
        email: "",
        comment: "",
        consent: false,
        companyWebsite: "",
      });
      if (redirectToThanks) {
        router.push("/thanks");
      } else {
        onSubmittedSuccessfully?.();
      }
    } catch {
      setStatus("error");
      setErrorMessage("Ошибка сети. Проверьте подключение и попробуйте снова.");
    }
  }

  if (status === "success" && !redirectToThanks) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-[var(--brand-accent)]/35 bg-[var(--brand-accent-soft)] p-8 text-center shadow-sm",
          className,
        )}
      >
        <p className="text-lg font-semibold text-slate-900">Заявка отправлена</p>
        {submittedServiceTitle ? (
          <p className="mt-2 text-sm text-slate-600">
            Услуга: <span className="font-medium text-slate-800">{submittedServiceTitle}</span>
          </p>
        ) : null}
        <p className="mt-2 text-sm text-slate-600">Мы свяжемся с вами в ближайшее время.</p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setStatus("idle");
            setSubmittedServiceTitle(null);
          }}
        >
          Отправить ещё одну
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8", className)}>
      <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
      {selectedService ? (
        <p className="mt-3 border-l-[3px] border-[var(--evo-orange)] pl-3 text-sm leading-snug text-slate-700">
          <span className="font-semibold text-slate-900">Услуга:</span> {selectedService.title}
        </p>
      ) : null}
      <p className="mt-1 text-sm text-slate-600">
        {selectedService
          ? "Оставьте контакты — перезвоним и согласуем сроки и формат работ."
          : "Перезвоним и уточним детали по оборудованию Эвотор."}
      </p>

      <form className="relative mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="companyWebsite">Website</label>
          <input
            id="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("companyWebsite")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-name">Имя *</Label>
          <Input id="lead-name" placeholder="Как к вам обращаться" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-city">Город *</Label>
          <Input id="lead-city" placeholder="Например, Владивосток" {...form.register("city")} />
          {form.formState.errors.city && (
            <p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-phone">Телефон *</Label>
          <Controller
            control={form.control}
            name="phone"
            render={({ field }) => (
              <Input
                id="lead-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (999) 123-45-67"
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(formatRuPhoneMask(e.target.value))}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-email">Email</Label>
          <Input id="lead-email" type="email" placeholder="Необязательно" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead-comment">Комментарий</Label>
          <Textarea id="lead-comment" placeholder="Ниша, количество касс, пожелания…" {...form.register("comment")} />
        </div>

        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="lead-consent"
            checked={form.watch("consent")}
            onCheckedChange={(c) => form.setValue("consent", c === true, { shouldValidate: true })}
          />
          <Label htmlFor="lead-consent" className="cursor-pointer font-normal leading-snug text-slate-600">
            Согласен на обработку персональных данных в соответствии с{" "}
            <Link
              href="/personal-data"
              className="font-medium text-[var(--brand-accent)] underline underline-offset-2 hover:text-[var(--brand-accent-hover)]"
            >
              политикой
            </Link>{" "}
            и{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-[var(--brand-accent)] underline underline-offset-2 hover:text-[var(--brand-accent-hover)]"
            >
              конфиденциальности
            </Link>
            .
          </Label>
        </div>
        {form.formState.errors.consent && (
          <p className="text-sm text-red-600">{form.formState.errors.consent.message}</p>
        )}

        {status === "error" && errorMessage && (
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}

        <Button type="submit" className="w-full sm:w-auto" disabled={status === "loading"}>
          {status === "loading" ? "Отправка…" : submitLabel}
        </Button>
      </form>
    </div>
  );
}

function LeadFormSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "min-h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-8",
        className,
      )}
      aria-hidden
    />
  );
}

export function LeadForm(props: LeadFormProps) {
  return (
    <Suspense fallback={<LeadFormSkeleton className={props.className} />}>
      <LeadFormInner {...props} />
    </Suspense>
  );
}
