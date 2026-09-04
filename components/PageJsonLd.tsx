import { serializeJsonLd } from "@/lib/jsonLd";

const SITE_URL = "https://www.beambeam.co.uk";

type PageJsonLdProps = {
  path: string;
  name: string;
  description?: string | null;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  serviceName?: string;
  serviceType?: string;
  includeWebsite?: boolean;
};

export default function PageJsonLd({
  path,
  name,
  description,
  type = "WebPage",
  serviceName,
  serviceType,
  includeWebsite = false,
}: PageJsonLdProps) {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const pageId = path === "/" ? `${SITE_URL}/#webpage` : `${url}#webpage`;
  const serviceId = serviceName ? `${url}#service` : undefined;
  const graph = [
    ...(includeWebsite
      ? [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "Beam Beam Digital",
            inLanguage: "en-GB",
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
        ]
      : []),
    {
      "@type": type,
      "@id": pageId,
      url,
      name,
      description: description || undefined,
      inLanguage: "en-GB",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb:
        path === "/" ? undefined : { "@id": `${url}#breadcrumb` },
      about: serviceId ? { "@id": serviceId } : undefined,
      mainEntity: serviceId
        ? { "@id": serviceId }
        : type === "ContactPage"
          ? { "@id": `${SITE_URL}/#organization` }
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
            inLanguage: "en-GB",
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: [
              { "@type": "Place", name: "South Devon" },
              { "@type": "Country", name: "United Kingdom" },
            ],
          },
        ]
      : []),
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
