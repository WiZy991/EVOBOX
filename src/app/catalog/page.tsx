import type { ReactNode } from "react";
import Link from "next/link";
import { getArchiveProducts, getCurrentProducts, productCategories } from "@/data/products";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { LeadForm } from "@/components/ui/LeadForm";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils/cn";

export const metadata = buildMetadata({
  title: "Каталог Эвотор — смарт-терминалы и Power",
  description:
    "Эвотор 6, 5i, 5 ST, 7.3, 10, Power-СТ, Power-POS. Партнёр EVOBOX — подбор, доставка, настройка.",
  path: "/catalog",
});

type PageProps = {
  searchParams: { category?: string };
};

export default function CatalogPage({ searchParams }: PageProps) {
  const active = searchParams.category;
  const current = getCurrentProducts();
  const archived = getArchiveProducts();
  const filteredCurrent = active ? current.filter((p) => p.category === active) : current;

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50 py-14 sm:py-20">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Каталог Эвотор</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Модельный ряд и ориентиры по ценам «от» — для быстрого выбора. Точные условия и комплектацию согласуем с вами.
            Контент каталога можно обновить в{" "}
            <code className="rounded bg-slate-100 px-1 text-sm">src/data/products.imported.json</code>{" "}
            (для разработчиков).
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <FilterPill href="/catalog" active={!active}>
              Все актуальные
            </FilterPill>
            {productCategories.map((c) => (
              <FilterPill key={c} href={`/catalog?category=${encodeURIComponent(c)}`} active={active === c}>
                {c}
              </FilterPill>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCurrent.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {filteredCurrent.length === 0 && (
            <p className="text-center text-slate-600">В этой категории нет актуальных моделей.</p>
          )}
        </Container>
      </section>
      {archived.length > 0 && (
        <section className="border-t border-slate-200 bg-amber-50/40 py-14">
          <Container>
            <h2 className="text-xl font-semibold text-slate-900">Архив и снятые с производства</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Модели для справки. Для новых заказов рекомендуем актуальные позиции из основного каталога.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {archived.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <Container className="max-w-xl">
          <h2 className="text-xl font-semibold text-slate-900">Не определились с моделью?</h2>
          <p className="mt-2 text-sm text-slate-600">Опишите нишу — подберём терминал или POS-комплект Эвотор.</p>
          <LeadForm formType="equipment" className="mt-6" title="Подобрать оборудование" submitLabel="Отправить" />
        </Container>
      </section>
    </>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-[var(--evo-green)] bg-[var(--evo-green)] text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-[var(--evo-green)]/50",
      )}
    >
      {children}
    </Link>
  );
}
