import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.domain;

export function buildMetadata(override: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = `${baseUrl.replace(/\/$/, "")}${override.path || ""}`;
  return {
    title: override.title,
    description: override.description,
    keywords: override.keywords ?? [...siteConfig.seo.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url,
      siteName: siteConfig.siteName,
      title: override.title,
      description: override.description,
    },
    robots: { index: true, follow: true },
  };
}

export { baseUrl };
