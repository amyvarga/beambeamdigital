import {
  ORGANIZATION_ID,
  SITE_URL,
  WEBSITE_ID,
  schemaDate,
  schemaImageObject,
  schemaLanguage,
  serializeJsonLd,
  type SchemaImageInput,
} from "@/lib/jsonLd";

type PageJsonLdProps = {
  path: string;
  name: string;
  description?: string | null;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  serviceName?: string;
  serviceType?: string;
  includeWebsite?: boolean;
  image?: SchemaImageInput | null;
  datePublished?: string | null;
  dateModified?: string | null;
  inLanguage?: string | null;
  aboutId?: string;
  mainEntityId?: string;
  serviceOfferCatalogId?: string;
  additionalGraph?: Record<string, unknown>[];
};

export default function PageJsonLd({
  path,
  name,
  description,
  type = "WebPage",
  serviceName,
  serviceType,
  includeWebsite = false,
  image,
  datePublished,
  dateModified,
  inLanguage = "en-GB",
  aboutId,
  mainEntityId,
  serviceOfferCatalogId,
  additionalGraph = [],
}: PageJsonLdProps) {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const pageId = path === "/" ? `${SITE_URL}/#webpage` : `${url}#webpage`;
  const serviceId = serviceName ? `${url}#service` : undefined;
  const imageId = image?.url ? `${url}${path === "/" ? "/" : ""}#primaryimage` : undefined;
  const primaryImage = imageId && image ? schemaImageObject(image, imageId) : undefined;
  const language = schemaLanguage(inLanguage);
  const resolvedAboutId = aboutId ?? serviceId;
  const resolvedMainEntityId =
    mainEntityId ??
    serviceId ??
    (type === "ContactPage" ? ORGANIZATION_ID : undefined);
  const graph = [
    ...(includeWebsite
      ? [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "Beam Beam Digital",
            inLanguage: language,
            publisher: { "@id": ORGANIZATION_ID },
          },
        ]
      : []),
    {
      "@type": type,
      "@id": pageId,
      url,
      name,
      description: description || undefined,
      datePublished: schemaDate(datePublished),
      dateModified: schemaDate(dateModified),
      inLanguage: language,
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORGANIZATION_ID },
      breadcrumb:
        path === "/" ? undefined : { "@id": `${url}#breadcrumb` },
      primaryImageOfPage: imageId ? { "@id": imageId } : undefined,
      about: resolvedAboutId ? { "@id": resolvedAboutId } : undefined,
      mainEntity: resolvedMainEntityId
        ? { "@id": resolvedMainEntityId }
        : undefined,
    },
    ...(serviceId
      ? [
          {
            "@type": "Service",
            "@id": serviceId,
            name: serviceName,
            serviceType: serviceType || serviceName,
            description: description || undefined,
            url,
            inLanguage: language,
            provider: { "@id": ORGANIZATION_ID },
            image: imageId ? { "@id": imageId } : undefined,
            hasOfferCatalog: serviceOfferCatalogId
              ? { "@id": serviceOfferCatalogId }
              : undefined,
            areaServed: [
              { "@type": "Place", name: "South Devon" },
              { "@type": "Country", name: "United Kingdom" },
            ],
          },
        ]
      : []),
    ...(primaryImage ? [primaryImage] : []),
    ...additionalGraph,
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}
