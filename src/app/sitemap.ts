import type { MetadataRoute } from "next";
import { flatDocsNav } from "@/lib/nav";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return flatDocsNav.map((item) => ({
    url: `${SITE_URL}${item.href}`,
    changeFrequency: "monthly",
    priority: item.href === "/docs/getting-started" ? 1 : 0.8,
  }));
}
