import { SITE } from "@/lib/site-config";

export function buildBreadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE.baseUrl}${item.href}` } : {}),
    })),
  };
}

export function buildWebPageJsonLd({
  path,
  name,
  description,
  dateModified,
}: {
  path: string;
  name: string;
  description: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${SITE.baseUrl}${path}`,
    name,
    description,
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.baseUrl,
    },
    author: { "@type": "Organization", name: SITE.name },
    ...(dateModified ? { dateModified } : {}),
  };
}
