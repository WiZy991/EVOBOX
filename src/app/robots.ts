import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

const base = (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.domain).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
