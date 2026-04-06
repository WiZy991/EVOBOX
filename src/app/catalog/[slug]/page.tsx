import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatProductPrice, getProductBySlug, products } from "@/data/products";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/ui/LeadForm";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return buildMetadata({
    title: `${product.name} — купить у партнёра EVOBOX`,
    description: product.shortDescription,
    path: `/catalog/${product.slug}`,
  });
}

export default function ProductPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const discontinued = product.status === "discontinued";

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50 py-10">
        <Container>
          <nav className="text-sm text-slate-500">
            <Link href="/catalog" className="hover:text-[var(--brand-accent)]">
              Каталог
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800">{product.name}</span>
          </nav>
        </Container>
      </section>
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-square max-h-[440px] overflow-hidden rounded-2xl border border-slate-200 bg-white lg:max-h-none">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
              <p className="mt-4 text-lg text-slate-600">{product.shortDescription}</p>
              <p className="mt-4 text-2xl font-bold text-[var(--brand-accent)]">{formatProductPrice(product)}</p>
              {product.statusNote && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">{product.statusNote}</p>
              )}
              <p className="mt-6 text-sm leading-relaxed text-slate-600">{product.fullDescription}</p>
              <p className="mt-4 text-xs text-slate-500">
                Актуальные цены и комплекты уточняйте у менеджера EVOBOX — подберём вариант под вашу задачу.
              </p>
              <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Характеристики</h2>
              <dl className="mt-3 divide-y divide-slate-100">
                {product.specifications.map((s) => (
                  <div key={s.label} className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm text-slate-500">{s.label}</dt>
                    <dd className="text-sm font-medium text-slate-900 sm:col-span-2">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                {!discontinued && (
                  <>
                    <Button asChild>
                      <Link href="#zayavka">Оставить заявку на товар</Link>
                    </Button>
                    <Button asChild variant="accent">
                      <Link href="#konsult">Получить консультацию</Link>
                    </Button>
                  </>
                )}
                {discontinued && (
                  <Button asChild>
                    <Link href="/catalog/evotor-7-3">Перейти на Эвотор 7.3</Link>
                  </Button>
                )}
                <Button asChild variant="secondary">
                  <Link href="/catalog">Назад в каталог</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {!discontinued && (
        <>
          <section id="zayavka" className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-14">
            <Container className="max-w-xl">
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
            </Container>
          </section>
          <section id="konsult" className="scroll-mt-24 border-t border-slate-200 py-14">
            <Container className="max-w-xl">
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
            </Container>
          </section>
        </>
      )}
      {discontinued && (
        <section className="border-t border-slate-200 bg-slate-50 py-14">
          <Container className="max-w-xl">
            <h2 className="text-xl font-semibold text-slate-900">Помощь с заменой оборудования</h2>
            <p className="mt-2 text-sm text-slate-600">
              Подберём актуальную модель Эвотор вместо снятой с производства.
            </p>
            <LeadForm
              formType="equipment"
              productName={`Замена: ${product.name}`}
              productSlug={product.slug}
              title="Подобрать замену"
              submitLabel="Отправить"
              className="mt-6"
            />
          </Container>
        </section>
      )}
    </>
  );
}
