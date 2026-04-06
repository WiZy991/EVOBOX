import { homeAnchors } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LeadForm } from "@/components/ui/LeadForm";

export function CTASection() {
  return (
    <Section
      id={homeAnchors.leadForm}
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#8b2d00] text-white"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Заявка на Эвотор</h2>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              Оставьте контакты — подберём модель по ниши и нагрузке, уточним комплект и сроки. Работаем как партнёр
              экосистемы Эвотор: оборудование, подключение, регистрация ККТ и дальнейшее сопровождение.
            </p>
            <ul className="mt-8 space-y-2 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="text-[var(--evo-orange)]">✓</span>
                Актуальные цены «от» и комплекты уточняем перед сделкой
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--evo-orange)]">✓</span>
                Подбор кассы, Power-СТ или POS-комплекта
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--evo-orange)]">✓</span>
                Настройка, обучение, поддержка
              </li>
            </ul>
          </div>
          <LeadForm
            formType="request"
            className="border-slate-200 bg-white text-slate-900 shadow-xl [&_h3]:text-slate-900 [&_p]:text-slate-600"
            title="Оставить заявку"
            submitLabel="Отправить заявку"
          />
        </div>
      </Container>
    </Section>
  );
}
