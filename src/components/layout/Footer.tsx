import Link from "next/link";
import { homeAnchors, mainNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { formatPhoneHref } from "@/lib/utils/formatPhone";
import { Container } from "./Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span className="rounded-lg bg-[var(--evo-orange)] px-2 py-0.5 text-xs text-white">ЭВО</span>
              <span className="rounded-lg bg-[var(--evo-green)] px-2 py-0.5 text-xs text-white">BOX</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{siteConfig.companyDescription}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Меню</p>
            <ul className="mt-3 space-y-2 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-600 hover:text-[var(--evo-green-dark)]">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/#${homeAnchors.equipment}`} className="text-slate-600 hover:text-[var(--evo-green-dark)]">
                  Оборудование на главной
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Контакты</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a href={formatPhoneHref(siteConfig.phone)} className="hover:text-[var(--evo-green-dark)]">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[var(--evo-green-dark)]">
                  {siteConfig.email}
                </a>
              </li>
              <li className="leading-snug">{siteConfig.address}</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Документы</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-slate-600 hover:text-[var(--evo-green-dark)]">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/personal-data" className="text-slate-600 hover:text-[var(--evo-green-dark)]">
                  Обработка персональных данных
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-slate-200 pt-8 text-center text-xs text-slate-500">
          © {year} {siteConfig.siteName}. Партнёр Эвотор. Онлайн-кассы и POS-системы.
        </p>
      </Container>
    </footer>
  );
}
