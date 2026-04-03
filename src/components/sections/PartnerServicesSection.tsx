import Link from "next/link";
import { homeAnchors } from "@/data/navigation";
import { partnerServiceOffers } from "@/data/partner-services";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export function PartnerServicesSection() {
  return (
    <Section id={homeAnchors.services} className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Услуги партнёра</h2>
          <p className="mt-3 text-slate-600">
            Техническая поддержка и сопровождение касс Эвотор — оставьте заявку по нужной услуге, перезвоним и
            уточним детали.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {partnerServiceOffers.map(({ slug, title, description, icon: Icon }) => (
            <li
              key={slug}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--evo-orange)]/10 text-[var(--evo-orange)]">
                <Icon className="size-6" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
              <Link
                href={`/?service=${slug}#${homeAnchors.leadForm}`}
                scroll={true}
                className="mt-5 inline-flex text-sm font-semibold text-[var(--evo-orange)] underline-offset-2 hover:underline"
              >
                Отправить заявку
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
