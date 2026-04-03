import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatProductPrice } from "@/data/products";
import { Badge } from "./badge";
import { Button } from "./button";
import { homeAnchors } from "@/data/navigation";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const priceLabel = formatProductPrice(product);
  const isDiscontinued = product.status === "discontinued";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/catalog/${product.slug}`} className="relative block aspect-[4/3] bg-slate-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.status !== "current" && (
          <div className="absolute left-3 top-3">
            <Badge variant="secondary">{isDiscontinued ? "Снят с производства" : "Архив"}</Badge>
          </div>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{product.shortDescription}</p>
        <p className="mt-3 text-base font-bold text-[var(--evo-green-dark)]">{priceLabel}</p>
        {product.statusNote && (
          <p className="mt-2 text-xs text-amber-800">{product.statusNote}</p>
        )}
        <p className="mt-3 text-xs text-slate-400">
          Цены «от» и комплектация — ориентир; итоговую стоимость и состав уточнит менеджер EVOBOX.
        </p>
        <div className="mt-5 flex w-full flex-col gap-2">
          <Button asChild variant="secondary" size="sm" className="w-full">
            <Link href={`/catalog/${product.slug}`} className="w-full">
              Подробнее
            </Link>
          </Button>
          {!isDiscontinued && (
            <>
              <Button asChild size="sm" className="w-full">
                <Link href={`/catalog/${product.slug}#zayavka`} className="w-full">
                  Оставить заявку
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/?intent=consultation#${homeAnchors.leadForm}`} className="w-full">
                  Консультация
                </Link>
              </Button>
            </>
          )}
          {isDiscontinued && (
            <Button asChild size="sm" className="w-full">
              <Link href="/catalog/evotor-7-3" className="w-full">
                Смотреть Эвотор 7.3
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
