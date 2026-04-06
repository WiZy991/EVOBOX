"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/types/product";
import { Container } from "@/components/layout/Container";
import { LeadForm } from "@/components/ui/LeadForm";

function ProductLeadSectionInner({ product }: { product: Product }) {
  const searchParams = useSearchParams();
  const consultation = searchParams.get("mode") === "consultation";

  return (
    <section
      id="lead-form"
      className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-14"
      aria-label={consultation ? "Консультация" : "Заявка на товар"}
    >
      <Container className="max-w-xl">
        {consultation ? (
          <>
            <h2 className="text-xl font-semibold text-slate-900">Консультация по {product.name}</h2>
            <p className="mt-2 text-sm text-slate-600">Ответим на вопросы по комплектам и подключению.</p>
            <LeadForm
              formType="consultation"
              productName={product.name}
              productSlug={product.slug}
              title="Получить консультацию"
              submitLabel="Запросить звонок"
              className="mt-6"
            />
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-slate-900">Заявка на {product.name}</h2>
            <p className="mt-2 text-sm text-slate-600">Уточним комплект, условия доставки и сроки запуска.</p>
            <LeadForm
              formType="product"
              productName={product.name}
              productSlug={product.slug}
              title="Оставить заявку на этот товар"
              submitLabel="Отправить заявку"
              className="mt-6"
            />
          </>
        )}
        <p className="mt-8 text-center text-sm text-slate-600">
          {consultation ? (
            <>
              Нужна заявка на покупку?{" "}
              <a
                href={`/catalog/${product.slug}?mode=product#lead-form`}
                className="font-medium text-[var(--brand-accent)] underline underline-offset-2 hover:text-[var(--brand-accent-hover)]"
              >
                Оформить заявку на товар
              </a>
            </>
          ) : (
            <>
              Нужна только консультация?{" "}
              <a
                href={`/catalog/${product.slug}?mode=consultation#lead-form`}
                className="font-medium text-[var(--brand-accent)] underline underline-offset-2 hover:text-[var(--brand-accent-hover)]"
              >
                Запросить консультацию
              </a>
            </>
          )}
        </p>
      </Container>
    </section>
  );
}

export function ProductLeadSection({ product }: { product: Product }) {
  return (
    <Suspense
      fallback={
        <section className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-14">
          <Container className="max-w-xl">
            <div className="h-64 animate-pulse rounded-2xl bg-slate-100" aria-hidden />
          </Container>
        </section>
      }
    >
      <ProductLeadSectionInner product={product} />
    </Suspense>
  );
}
