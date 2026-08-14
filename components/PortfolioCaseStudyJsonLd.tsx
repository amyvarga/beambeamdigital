import { asText, type Content } from "@prismicio/client";

const SITE_URL = "https://www.beambeam.co.uk";

type PortfolioCaseStudyJsonLdProps = {
  caseStudy: Content.PortfolioCaseStudyDocument;
};

function collectImageUrls(value: unknown, urls = new Set<string>()): Set<string> {
  if (!value || typeof value !== "object") return urls;

  if (Array.isArray(value)) {
    value.forEach((item) => collectImageUrls(item, urls));
    return urls;
  }

  const item = value as Record<string, unknown>;
  if (
    typeof item.url === "string" &&
    item.dimensions &&
    typeof item.dimensions === "object"
  ) {
    urls.add(item.url);
  }

  Object.values(item).forEach((child) => collectImageUrls(child, urls));
  return urls;
}

export default function PortfolioCaseStudyJsonLd({
  caseStudy,
}: PortfolioCaseStudyJsonLdProps) {
  const path = `/work/${caseStudy.uid}`;
  const url = `${SITE_URL}${path}`;
  const hero = caseStudy.data.slices.find(
    (slice) => slice.slice_type === "hero_banner",
  );
  const projectName =
    (hero?.slice_type === "hero_banner" && asText(hero.primary.headline)) ||
    caseStudy.data.meta_title ||
    caseStudy.uid;
  const description = caseStudy.data.meta_description || undefined;
  const images = [
    ...(caseStudy.data.meta_image.url ? [caseStudy.data.meta_image.url] : []),
    ...collectImageUrls(caseStudy.data.slices),
  ].filter((image, index, all) => all.indexOf(image) === index);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: caseStudy.data.meta_title || projectName,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#project` },
      },
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        name: `${projectName} website and SEO case study`,
        description,
        genre: "Portfolio case study",
        image: images.length > 0 ? images : undefined,
        creator: { "@id": `${SITE_URL}/#organization` },
        about: {
          "@type": "Organization",
          name: projectName,
        },
        mainEntityOfPage: { "@id": `${url}#webpage` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: `${SITE_URL}/work`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: projectName,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
