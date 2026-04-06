"use client";

import type { ReactNode } from "react";
import { FloatingLeadCta } from "@/components/lead/FloatingLeadCta";
import { LeadRequestDialog } from "@/components/lead/LeadRequestDialog";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LeadModalProvider } from "@/contexts/LeadModalContext";

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <LeadModalProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <LeadRequestDialog />
      <FloatingLeadCta />
    </LeadModalProvider>
  );
}
