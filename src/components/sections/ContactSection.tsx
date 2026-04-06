import { Mail, MapPin, Phone } from "lucide-react";
import { homeAnchors } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { formatPhoneHref } from "@/lib/utils/formatPhone";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { YandexMapEmbed } from "@/components/maps/YandexMapEmbed";

export function ContactSection() {
  return (
    <Section id={homeAnchors.contacts} className="border-t border-slate-200 bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Контакты</h2>
          <p className="mt-3 text-slate-600">Приезжайте в офис или свяжитесь удобным способом.</p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <ul className="space-y-6">
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
          <YandexMapEmbed title="Офис EVOBOX на карте" className="min-h-[280px] shadow-md" />
        </div>
      </Container>
    </Section>
  );
}
