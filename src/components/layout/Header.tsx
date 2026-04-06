"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useLeadModal } from "@/contexts/LeadModalContext";
import { homeAnchors, mainNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { formatPhoneHref } from "@/lib/utils/formatPhone";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";

/** Якоря на главной (пункт «Контакты» только в mainNav → /contacts, без дубля) */
const anchorItems = [
  { href: `/#${homeAnchors.equipment}`, label: "Оборудование" },
  { href: `/#${homeAnchors.audience}`, label: "Ниши" },
  { href: `/#${homeAnchors.evotorAdvantages}`, label: "Эвотор" },
  { href: `/#${homeAnchors.partner}`, label: "EVOBOX" },
  { href: `/#${homeAnchors.services}`, label: "Услуги" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { openModal } = useLeadModal();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  function openLeadModal() {
    router.replace("/", { scroll: false });
    openModal();
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <Container className="grid min-h-14 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-2 sm:min-h-16 sm:gap-x-4 sm:py-2.5 lg:min-h-[4.25rem] lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="rounded-lg bg-[var(--evo-orange)] px-2 py-1 text-sm text-white">ЭВО</span>
          <span className="rounded-lg bg-[var(--evo-green)] px-2 py-1 text-sm text-white">BOX</span>
        </Link>

        <nav
          className="hidden min-w-0 items-center justify-center gap-x-3 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden"
          aria-label="Основное меню"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 text-sm font-medium transition-colors hover:text-[var(--brand-accent)]",
                pathname === item.href ? "text-[var(--brand-accent)]" : "text-slate-600",
              )}
            >
              {item.label}
            </Link>
          ))}
          {anchorItems.map((item) => (
            <Link
              key={item.href}
              href={isHome ? item.href.replace("/", "") : item.href}
              className="shrink-0 text-sm font-medium text-slate-600 transition-colors hover:text-[var(--brand-accent)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="col-start-3 row-start-1 flex shrink-0 items-center justify-end gap-2 lg:gap-3">
          <div className="hidden items-center gap-3 lg:flex">
            <div className="hidden flex-col items-end text-right leading-tight xl:flex">
              <a
                href={formatPhoneHref(siteConfig.phone)}
                className="whitespace-nowrap text-xl font-bold tracking-tight text-[var(--brand-accent)] hover:text-[var(--brand-accent-hover)]"
              >
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-1 max-w-[14rem] truncate text-xs text-slate-600 hover:text-[var(--brand-accent)]"
                title={siteConfig.email}
              >
                {siteConfig.email}
              </a>
            </div>
            <Button type="button" size="sm" className="shrink-0" onClick={() => openLeadModal()}>
              Оставить заявку
            </Button>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <Button type="button" size="sm" className="px-3" onClick={() => openLeadModal()}>
              Заявка
            </Button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
              aria-expanded={open}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </Container>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Мобильное меню">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium text-slate-800"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {anchorItems.map((item) => (
              <Link
                key={item.href}
                href={isHome ? item.href.replace("/", "") : item.href}
                className="text-base font-medium text-slate-800"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={formatPhoneHref(siteConfig.phone)}
              className="text-lg font-bold text-[var(--brand-accent)]"
            >
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="text-sm text-slate-600">
              {siteConfig.email}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
