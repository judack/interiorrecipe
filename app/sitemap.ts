import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";
import { GUIDES } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.baseUrl}/reservation`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...GUIDES.map((guide) => ({
      url: `${SITE.baseUrl}/guides/${guide.slug}`,
      lastModified: new Date(guide.updatedDate),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
