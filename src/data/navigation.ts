export const mainNav = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/contacts", label: "Контакты" },
] as const;

/** Якоря на главной */
export const homeAnchors = {
  hero: "hero",
  equipment: "equipment",
  audience: "audience",
  evotorAdvantages: "evotor-advantages",
  partner: "partner-evobox",
  services: "partner-services",
  leadForm: "lead-form",
  contacts: "contacts",
} as const;
