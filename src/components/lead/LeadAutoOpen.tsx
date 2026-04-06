"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLeadModal } from "@/contexts/LeadModalContext";

const STORAGE_KEY = "evobox_lead_popup_once";

/** Один раз за сессию через 5 с, если пользователь сам не открыл форму раньше. */
export function LeadAutoOpen() {
  const pathname = usePathname();
  const { open, openModal } = useLeadModal();

  useEffect(() => {
    if (pathname === "/thanks") return;

    const markSeen = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private mode */
      }
    };

    if (open) {
      markSeen();
      return;
    }

    const timer = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) return;
        markSeen();
        openModal();
      } catch {
        /* */
      }
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [open, openModal, pathname]);

  return null;
}
