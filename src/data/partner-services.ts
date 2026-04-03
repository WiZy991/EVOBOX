import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  GraduationCap,
  HardDrive,
  LayoutGrid,
  RefreshCw,
  ScanLine,
  Wine,
  Wrench,
} from "lucide-react";
import { partnerServiceRows, type PartnerServiceRow } from "./partner-services-data";

export type PartnerServiceOffer = PartnerServiceRow & { icon: LucideIcon };

const iconsBySlug: Record<string, LucideIcon> = {
  "marking-turnkey": ScanLine,
  "utm-terminal": Wine,
  "kkt-reregistration": RefreshCw,
  "fn-replacement": HardDrive,
  "error-fix": Wrench,
  "app-training": GraduationCap,
  "evotor-pay": CreditCard,
  "marketplace-app": LayoutGrid,
};

export const partnerServiceOffers: PartnerServiceOffer[] = partnerServiceRows.map((row) => {
  const icon = iconsBySlug[row.slug];
  if (!icon) throw new Error(`No icon for service slug: ${row.slug}`);
  return { ...row, icon };
});

export { getPartnerServiceBySlug } from "./partner-services-data";
