import { absoluteUrl, SITE_URL, serializeJsonLd } from "@/lib/jsonLd";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type BreadcrumbJsonLdProps = {
  label: string;
  path: string;
  parents?: BreadcrumbItem[];
};

export default function BreadcrumbJsonLd({
  label,
  path,
  parents = [],
}: BreadcrumbJsonLdProps) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    ...parents,
    { name: label, path },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${path}#breadcrumb`,
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  );
}
