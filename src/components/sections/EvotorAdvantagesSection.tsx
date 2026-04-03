import { Barcode, Layers, MonitorSmartphone, Plug, ShieldCheck, Sparkles } from "lucide-react";
import { homeAnchors } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

const items = [
  {
    title: "Современное кассовое решение",
    text: "Смарт-терминалы и POS Power для разной нагрузки — от мобильной кассы до стойки администратора.",
    icon: MonitorSmartphone,
  },
  {
    title: "Удобный интерфейс",
    text: "Понятный сценарий для кассира и администратора, быстрый выход на продажи.",
    icon: Sparkles,
  },
  {
    title: "Маркировка и 54-ФЗ",
    text: "Работа с «Честным знаком», алкоголем (ЕГАИС) и требованиями закона — через экосистему Эвотор.",
    icon: Barcode,
  },
  {
    title: "Интеграции",
    text: "1С, МойСклад, отраслевой софт и сервисы записи — подключаем под ваш процесс.",
    icon: Plug,
  },
  {
    title: "Разные форматы бизнеса",
    text: "Розница, HoReCa, услуги, выездная торговля — под каждый формат есть модель линейки.",
    icon: Layers,
  },
  {
    title: "Поддержка и обновления",
    text: "Регулярные обновления платформы и доступ к базе знаний Эвотор; как партнёр помогаем на месте.",
    icon: ShieldCheck,
  },
];

export function EvotorAdvantagesSection() {
  return (
    <Section id={homeAnchors.evotorAdvantages} className="bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Преимущества Эвотор</h2>
          <p className="mt-3 text-slate-600">
            Почему предприниматели выбирают экосистему Эвотор — и как EVOBOX помогает внедрить её под ключ.
          </p>
        </div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, text, icon: Icon }) => (
            <li
              key={title}
              className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 p-6 shadow-sm"
            >
              <Icon className="size-8 text-[var(--evo-green)]" aria-hidden />
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
