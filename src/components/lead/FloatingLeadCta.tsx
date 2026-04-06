"use client";

import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";
import { formatPhoneHref } from "@/lib/utils/formatPhone";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/contexts/LeadModalContext";

export function FloatingLeadCta() {
  const { openModal } = useLeadModal();

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 sm:bottom-6 sm:right-6"
      aria-label="Быстрая связь"
    >
      <a
        href={formatPhoneHref(siteConfig.phone)}
        className="flex items-center gap-3 rounded-2xl border border-white/20 bg-[var(--brand-dark)] px-4 py-3 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.02] sm:px-5 sm:py-3.5"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-accent)] text-white">
          <Phone className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-[10px] font-medium uppercase tracking-wider text-white/70">Звонок бесплатный</span>
          <span className="block text-lg font-bold leading-tight tracking-tight sm:text-xl">{siteConfig.phone}</span>
        </span>
      </a>
      <Button
        type="button"
        size="lg"
        className="h-12 gap-2 rounded-xl px-5 shadow-lg"
        onClick={() => openModal()}
      >
        <MessageCircle className="size-5" aria-hidden />
        Заявка в один клик
      </Button>
    </div>
  );
}
