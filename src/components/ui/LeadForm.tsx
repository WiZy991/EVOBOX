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
  /** Компактная форма для модального окна: без email/комментария, плотная вёрстка */
  variant?: "default" | "compact";
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
  variant = "default",
  productName,
  productSlug,
  sourcePage: sourcePageProp,
  title = "Оставить заявку",
  submitLabel = "Отправить",
  redirectToThanks = false,
  className,
  onSubmittedSuccessfully,
}: LeadFormProps) {
  const compact = variant === "compact";
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
  /** Частичный успех: почта и CRM шли отдельно */
  const [channelNote, setChannelNote] = useState<string | null>(null);
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
    setChannelNote(null);

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
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        emailOk?: boolean;
        crmOk?: boolean;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Не удалось отправить. Попробуйте позже или позвоните нам.");
        return;
      }

      if (data.crmOk === false && data.emailOk === true) {
        setChannelNote("Заявка ушла на почту; в CRM запись не создалась — мы свяжемся по данным из письма.");
      } else if (data.emailOk === false && data.crmOk === true) {
        setChannelNote("Письмо не отправилось; заявка передана в CRM — с вами свяжутся оттуда.");
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
          "rounded-2xl border border-[var(--brand-accent)]/35 bg-[var(--brand-accent-soft)] text-center shadow-sm",
          compact ? "p-4" : "p-8",
          className,
        )}
      >
        <p className={cn("font-semibold text-slate-900", compact ? "text-base" : "text-lg")}>
          Заявка отправлена
        </p>
        {submittedServiceTitle ? (
          <p className={cn("mt-2 text-slate-600", compact ? "text-xs" : "text-sm")}>
            Услуга: <span className="font-medium text-slate-800">{submittedServiceTitle}</span>
          </p>
        ) : null}
        <p className={cn("mt-2 text-slate-600", compact ? "text-xs" : "text-sm")}>
          Мы свяжемся с вами в ближайшее время.
        </p>
        {channelNote ? (
          <p
            className={cn(
              "mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left text-amber-950",
              compact ? "text-xs leading-snug" : "text-sm leading-snug",
            )}
          >
            {channelNote}
          </p>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          className={compact ? "mt-4 h-9 text-sm" : "mt-6"}
          onClick={() => {
            setStatus("idle");
            setSubmittedServiceTitle(null);
            setChannelNote(null);
          }}
        >
          Отправить ещё одну
        </Button>
      </div>
    );
  }

  const inputSm = compact ? "h-9 text-sm" : "";
  const labelSm = compact ? "text-xs" : "";

  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8", className)}>
      {title ? <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3> : null}
      {!compact && selectedService ? (
        <p className="mt-3 border-l-[3px] border-[var(--evo-orange)] pl-3 text-sm leading-snug text-slate-700">
          <span className="font-semibold text-slate-900">Услуга:</span> {selectedService.title}
        </p>
      ) : null}
      {!compact ? (
        <p className="mt-1 text-sm text-slate-600">
          {selectedService
            ? "Оставьте контакты — перезвоним и согласуем сроки и формат работ."
            : "Перезвоним и уточним детали по оборудованию Эвотор."}
        </p>
      ) : null}

      <form
        className={cn("relative", compact ? "mt-0 space-y-2.5" : "mt-6 space-y-4")}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor={compact ? "lead-modal-hp" : "companyWebsite"}>Website</label>
          <input
            id={compact ? "lead-modal-hp" : "companyWebsite"}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("companyWebsite")}
          />
        </div>

        <div className={cn(compact && "grid gap-2.5 sm:grid-cols-2")}>
          <div className="space-y-1">
            <Label htmlFor={compact ? "lead-modal-name" : "lead-name"} className={labelSm}>
              Имя *
            </Label>
            <Input
              id={compact ? "lead-modal-name" : "lead-name"}
              className={inputSm}
              placeholder="Имя"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className={cn("text-red-600", compact ? "text-xs" : "text-sm")}>
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor={compact ? "lead-modal-city" : "lead-city"} className={labelSm}>
              Город *
            </Label>
            <Input
              id={compact ? "lead-modal-city" : "lead-city"}
              className={inputSm}
              placeholder="Город"
              {...form.register("city")}
            />
            {form.formState.errors.city && (
              <p className={cn("text-red-600", compact ? "text-xs" : "text-sm")}>
                {form.formState.errors.city.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor={compact ? "lead-modal-phone" : "lead-phone"} className={labelSm}>
            Телефон *
          </Label>
          <Controller
            control={form.control}
            name="phone"
            render={({ field }) => (
              <Input
                id={compact ? "lead-modal-phone" : "lead-phone"}
                className={inputSm}
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
            <p className={cn("text-red-600", compact ? "text-xs" : "text-sm")}>
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        {!compact ? (
          <>
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
          </>
        ) : null}

        <div className={cn("flex items-start gap-2", compact ? "pt-0.5" : "gap-3 pt-2")}>
          <Checkbox
            id={compact ? "lead-modal-consent" : "lead-consent"}
            className={compact ? "mt-0.5" : undefined}
            checked={form.watch("consent")}
            onCheckedChange={(c) => form.setValue("consent", c === true, { shouldValidate: true })}
          />
          <Label
            htmlFor={compact ? "lead-modal-consent" : "lead-consent"}
            className={cn(
              "cursor-pointer font-normal text-slate-600",
              compact ? "text-[11px] leading-snug" : "leading-snug",
            )}
          >
            Согласен на обработку ПДн по{" "}
            <Link
              href="/personal-data"
              className="font-medium text-[var(--brand-accent)] underline underline-offset-2 hover:text-[var(--brand-accent-hover)]"
            >
              политике
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
          <p className={cn("text-red-600", compact ? "text-xs" : "text-sm")}>
            {form.formState.errors.consent.message}
          </p>
        )}

        {status === "error" && errorMessage && (
          <p className={cn("text-red-600", compact ? "text-xs" : "text-sm")} role="alert">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          className={cn("w-full", !compact && "sm:w-auto", compact && "h-9 text-sm")}
          disabled={status === "loading" || !form.watch("consent")}
        >
          {status === "loading" ? "Отправка…" : submitLabel}
        </Button>
      </form>
    </div>
  );
}

function LeadFormSkeleton({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl border border-slate-200 bg-slate-50",
        compact ? "min-h-[220px] p-4" : "min-h-[420px] p-8",
        className,
      )}
      aria-hidden
    />
  );
}

export function LeadForm(props: LeadFormProps) {
  const compact = props.variant === "compact";
  return (
    <Suspense fallback={<LeadFormSkeleton className={props.className} compact={compact} />}>
      <LeadFormInner {...props} />
    </Suspense>
  );
}
