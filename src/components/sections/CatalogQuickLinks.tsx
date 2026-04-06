import Link from "next/link";
import { getCurrentProducts } from "@/data/products";
import { Container } from "@/components/layout/Container";

/** Быстрый переход к моделям в каталоге (аналог блока «Онлайн-кассы» в меню) */
export function CatalogQuickLinks() {
  const products = getCurrentProducts();

  return (
    <section className="border-b border-slate-200/90 bg-slate-50 py-4 sm:py-5" aria-label="Модели в каталоге">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500">Онлайн-кассы</p>
          <nav className="flex flex-wrap gap-x-3 gap-y-2 sm:gap-x-4">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/catalog/${p.slug}`}
                className="text-sm font-medium text-slate-800 transition-colors hover:text-[var(--brand-accent)]"
              >
                {p.name}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
