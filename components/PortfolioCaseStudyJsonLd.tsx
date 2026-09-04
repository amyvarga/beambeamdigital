import { asText, type Content } from "@prismicio/client";
import { serializeJsonLd } from "@/lib/jsonLd";

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
  const path = `/portfolio/${caseStudy.uid}`;
  const url = `${SITE_URL}${path}`;
  const hero = caseStudy.data.slices.find(
    (slice) => slice.slice_type === "hero_banner",
  );
  const projectName =
    (hero?.slice_type === "hero_banner" && asText(hero.primary.headline)) ||
    caseStudy.data.meta_title ||
    caseStudy.uid;
  const pageTitle = caseStudy.data.meta_title || `${projectName} case study`;
  const description = caseStudy.data.meta_description || undefined;
  const primaryImage = caseStudy.data.meta_image.url
    ? {
        "@type": "ImageObject",
        "@id": `${url}#primaryimage`,
        url: caseStudy.data.meta_image.url,
        contentUrl: caseStudy.data.meta_image.url,
        width: caseStudy.data.meta_image.dimensions?.width,
        height: caseStudy.data.meta_image.dimensions?.height,
        caption: caseStudy.data.meta_image.alt || undefined,
      }
    : undefined;
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
        name: pageTitle,
        description,
        datePublished: caseStudy.first_publication_date,
        dateModified: caseStudy.last_publication_date,
        inLanguage: caseStudy.lang,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: primaryImage
          ? { "@id": primaryImage["@id"] }
          : undefined,
        mainEntity: { "@id": `${url}#case-study` },
      },
      {
        "@type": "Article",
        "@id": `${url}#case-study`,
        url,
        name: pageTitle,
        headline: projectName,
        description,
        genre: "Portfolio case study",
        articleSection: "Portfolio",
        datePublished: caseStudy.first_publication_date,
        dateModified: caseStudy.last_publication_date,
        inLanguage: caseStudy.lang,
        keywords: caseStudy.tags.length > 0 ? caseStudy.tags : undefined,
        image: images.length > 0 ? images : undefined,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: {
          "@type": "Organization",
          name: projectName,
        },
        mainEntityOfPage: { "@id": `${url}#webpage` },
      },
      ...(primaryImage ? [primaryImage] : []),
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
            name: "Portfolio",
            item: `${SITE_URL}/portfolio`,
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
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(jsonLd),
      }}
    />
  );
}
