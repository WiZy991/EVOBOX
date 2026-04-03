import Link from "next/link";
import { homeAnchors } from "@/data/navigation";
import { getLandingEquipment } from "@/data/products";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/ProductCard";

export function EquipmentSection() {
  const list = getLandingEquipment();

  return (
    <Section id={homeAnchors.equipment} className="bg-white">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Оборудование Эвотор</h2>
            <p className="mt-3 text-slate-600">
              Названия моделей, ориентиры по ценам «от» и внешний вид терминалов — чтобы было проще сравнить линейку.
              Итоговое предложение сформируем под вашу нишу и нагрузку.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/catalog">Весь каталог</Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
