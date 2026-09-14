import { asText, type Content } from "@prismicio/client";
import {
  ORGANIZATION_ID,
  SITE_URL,
  WEBSITE_ID,
  collectSchemaImages,
  getPrimarySchemaImage,
  schemaDate,
  schemaImageObject,
  schemaLanguage,
  serializeJsonLd,
} from "@/lib/jsonLd";

type PortfolioCaseStudyJsonLdProps = {
  caseStudy: Content.PortfolioCaseStudyDocument;
};

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
  const primaryImageField = getPrimarySchemaImage(
    caseStudy.data.meta_image,
    caseStudy.data.slices,
  );
  const primaryImage = primaryImageField?.url
    ? schemaImageObject(primaryImageField, `${url}#primaryimage`)
    : undefined;
  const allImageFields = [
    ...(primaryImageField?.url ? [primaryImageField] : []),
    ...collectSchemaImages(caseStudy.data.slices),
  ].filter(
    (image, index, all) =>
      all.findIndex((candidate) => candidate.url === image.url) === index,
  );
  const images = allImageFields
    .map((image) => {
      if (image.url === primaryImageField?.url && primaryImage) {
        return { "@id": primaryImage["@id"] };
      }
      return schemaImageObject(image);
    })
    .filter(Boolean);
  const language = schemaLanguage(caseStudy.lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: pageTitle,
        description,
        datePublished: schemaDate(caseStudy.first_publication_date),
        dateModified: schemaDate(caseStudy.last_publication_date),
        inLanguage: language,
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORGANIZATION_ID },
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
        datePublished: schemaDate(caseStudy.first_publication_date),
        dateModified: schemaDate(caseStudy.last_publication_date),
        inLanguage: language,
        keywords: caseStudy.tags.length > 0 ? caseStudy.tags : undefined,
        image: images.length > 0 ? images : undefined,
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        about: {
          "@type": "Thing",
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
