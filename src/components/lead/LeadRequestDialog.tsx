"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LeadForm } from "@/components/ui/LeadForm";
import { useLeadModal } from "@/contexts/LeadModalContext";

const MODAL_IMAGE = "/images/hero-terminal-photoroom.png";

export function LeadRequestDialog() {
  const { open, setOpen } = useLeadModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[min(100vw-1rem,520px)] gap-0 overflow-hidden p-0 sm:max-w-[520px]">
        <div className="flex max-h-[min(92vh,560px)] flex-col overflow-y-auto sm:max-h-[min(90vh,480px)] sm:flex-row">
          <div className="relative flex shrink-0 items-center justify-center border-b border-slate-100 bg-gradient-to-br from-orange-50/90 via-white to-slate-50 px-6 py-5 sm:w-[42%] sm:border-b-0 sm:border-r sm:py-6">
            <div className="relative aspect-[555/352] w-full max-w-[200px] sm:max-w-none">
              <Image
                src={MODAL_IMAGE}
                alt="Смарт-терминал Эвотор"
                width={220}
                height={140}
                className="h-auto w-full object-contain drop-shadow-md"
              />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col px-4 pb-4 pt-4 pr-12 sm:px-5 sm:pb-5 sm:pt-5">
            <DialogTitle className="text-base font-bold text-slate-900 sm:text-lg">
              Заявка на звонок
            </DialogTitle>
            <p className="mt-1 text-xs leading-snug text-slate-600">
              Перезвоним и подберём кассу Эвотор под вашу нишу.
            </p>
            <LeadForm
              formType="request"
              variant="compact"
              title=""
              submitLabel="Жду звонка"
              className="mt-3 rounded-none border-0 p-0 shadow-none sm:mt-4 [&_h3]:hidden"
              onSubmittedSuccessfully={() => {
                window.setTimeout(() => setOpen(false), 2400);
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
