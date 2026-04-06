import { CheckCircle2 } from "lucide-react";
import { homeAnchors } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const points = [
  "Партнёр по решениям Эвотор",
  "Помощь в подборе терминала или POS-комплекта",
  "Настройка под ваш бизнес и регламенты торговли",
  "Внедрение, регистрация ККТ и подключение ОФД",
  "Техническая поддержка и сопровождение после покупки",
];

export function PartnerEvoboxSection() {
  return (
    <Section id={homeAnchors.partner} className="border-y border-slate-200 bg-[var(--brand-accent-soft)]">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Почему выбирают EVOBOX</h2>
            <p className="mt-4 text-slate-600">
              Мы не перепродаём «абстрактную автоматизацию» — продаём и внедряем оборудование и сервисы Эвотор, берём на
              себя рутину запуска и остаёмся на связи после старта.
            </p>
          </div>
          <ul className="space-y-4">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-slate-800">
                <CheckCircle2 className="size-6 shrink-0 text-[var(--brand-accent)]" aria-hidden />
                <span className="font-medium">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href={`/#${homeAnchors.leadForm}`}>Связаться с EVOBOX</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/catalog">Смотреть каталог</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
