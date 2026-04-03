import { Bike, Briefcase, Coffee, ShoppingBag, Store } from "lucide-react";
import { homeAnchors } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const items = [
  {
    title: "Розница",
    text: "Магазины у дома, киоски, небольшие сети — сканирование, маркировка, учёт через приложения Эвотор.",
    icon: ShoppingBag,
  },
  {
    title: "Кафе и рестораны",
    text: "Меню, столики, интеграции с r_keeper, Quick Resto, Dooglys; крупный экран Эвотор 10.",
    icon: Coffee,
  },
  {
    title: "Услуги",
    text: "Салоны, СТО, прокат: запись, абонементы, гибкие сценарии оплаты.",
    icon: Briefcase,
  },
  {
    title: "Курьеры и выездная торговля",
    text: "Эвотор 5i и линейка 5 — лёгкие терминалы с автономностью для доставки и выезда.",
    icon: Bike,
  },
  {
    title: "Небольшой бизнес",
    text: "Старт с понятного комплекта: касса, ФН, ОФД, обучение — без лишней сложности.",
    icon: Store,
  },
];

export function AudienceSection() {
  return (
    <Section id={homeAnchors.audience} className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Кому подходит Эвотор</h2>
          <p className="mt-3 text-slate-600">
            Одна экосистема смарт-терминалов и приложений — разные сценарии под вашу нишу и формат торговли.
          </p>
        </div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, text, icon: Icon }) => (
            <li
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--evo-green)]/10 text-[var(--evo-green-dark)]">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <Button asChild>
            <Link href={`/#${homeAnchors.leadForm}`}>Подобрать модель под нишу</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
