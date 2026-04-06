"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/contexts/LeadModalContext";

export function HeroActions() {
  const router = useRouter();
  const { openModal } = useLeadModal();

  function openWithIntent(intent: "equipment" | "consultation") {
    router.replace(`/?intent=${intent}`, { scroll: false });
    openModal();
  }

  return (
    <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
      <Button
        type="button"
        size="lg"
        className="w-full border-0 bg-[var(--brand-accent)] text-white shadow-[0_0_32px_rgba(255,102,0,0.35)] hover:bg-[var(--brand-accent-hover)] sm:w-auto"
        onClick={() => openWithIntent("equipment")}
      >
        Подобрать кассу
      </Button>
      <Button
        type="button"
        size="lg"
        variant="outline"
        className="w-full border-2 border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:w-auto"
        onClick={() => openWithIntent("consultation")}
      >
        Получить консультацию
      </Button>
    </div>
  );
}
