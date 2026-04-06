"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LeadForm } from "@/components/ui/LeadForm";
import { useLeadModal } from "@/contexts/LeadModalContext";

export function LeadRequestDialog() {
  const { open, setOpen } = useLeadModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <div className="border-b border-slate-100 px-6 pb-4 pt-5 pr-14">
          <DialogTitle className="text-xl">Оставить заявку</DialogTitle>
          <p className="mt-2 text-sm text-slate-600">
            Перезвоним, подберём кассу Эвотор или ответим на вопросы по услугам.
          </p>
        </div>
        <div className="px-6 pb-6 pt-2">
          <LeadForm
            formType="request"
            title=""
            submitLabel="Отправить заявку"
            className="rounded-none border-0 p-0 shadow-none sm:p-0 [&_h3]:hidden"
            onSubmittedSuccessfully={() => {
              window.setTimeout(() => setOpen(false), 2800);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
