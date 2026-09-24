import type { MetadataRoute } from "next";
import { DEFAULT_LANGUAGE } from "@/lib/languages";
import { allDocsPages } from "@/lib/nav";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return allDocsPages.map((item) => ({
    url: `${SITE_URL}${item.href}`,
    changeFrequency: "monthly",
    priority: item.slug === "getting-started" ? (item.language === DEFAULT_LANGUAGE.id ? 1 : 0.9) : 0.8,
  }));
}
