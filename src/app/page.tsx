import { AudienceSection } from "@/components/sections/AudienceSection";
import { CatalogQuickLinks } from "@/components/sections/CatalogQuickLinks";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTASection } from "@/components/sections/CTASection";
import { EquipmentSection } from "@/components/sections/EquipmentSection";
import { EvotorAdvantagesSection } from "@/components/sections/EvotorAdvantagesSection";
import { Hero } from "@/components/sections/Hero";
import { PartnerEvoboxSection } from "@/components/sections/PartnerEvoboxSection";
import { PartnerServicesSection } from "@/components/sections/PartnerServicesSection";
import { siteConfig } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <CatalogQuickLinks />
      <EquipmentSection />
      <AudienceSection />
      <EvotorAdvantagesSection />
      <PartnerEvoboxSection />
      <PartnerServicesSection />
      <CTASection />
      <ContactSection />
    </>
  );
}
