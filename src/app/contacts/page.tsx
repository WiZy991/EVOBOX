import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { formatPhoneHref } from "@/lib/utils/formatPhone";
import { Container } from "@/components/layout/Container";
import { YandexMapEmbed } from "@/components/maps/YandexMapEmbed";
import { LeadForm } from "@/components/ui/LeadForm";

export const metadata = buildMetadata({
  title: "Контакты EVOBOX",
  description: `Телефон ${siteConfig.phone}, email ${siteConfig.email}, адрес: ${siteConfig.address}.`,
  path: "/contacts",
});

export default function ContactsPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-20">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Контакты</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Свяжитесь с нами удобным способом или оставьте заявку на обратный звонок.
          </p>
        </Container>
      </section>
      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Реквизиты и адрес</h2>
              <ul className="mt-6 space-y-6">
                <li className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-accent)]">
                    <Phone className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Телефон</p>
                    <a
                      href={formatPhoneHref(siteConfig.phone)}
                      className="text-xl font-bold text-slate-900 hover:text-[var(--brand-accent)]"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-accent)]">
                    <Mail className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Email</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-lg font-semibold text-slate-900 hover:text-[var(--brand-accent)]"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-accent-soft)] text-[var(--brand-accent)]">
                    <MapPin className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Адрес</p>
                    <p className="text-lg font-semibold text-slate-900">{siteConfig.address}</p>
                    <p className="mt-1 text-sm text-slate-600">{siteConfig.workingHours}</p>
                  </div>
                </li>
              </ul>
              <div className="mt-10">
                <YandexMapEmbed title="Офис EVOBOX на карте" />
              </div>
            </div>
            <div>
              <LeadForm
                formType="callback"
                title="Заказать звонок"
                submitLabel="Перезвоните мне"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
