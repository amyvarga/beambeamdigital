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
  const url = `${SITE_URL}${path}`;
  const serviceId = serviceName ? `${url}#service` : undefined;
  const graph = [
    ...(includeWebsite
      ? [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "Beam Beam Digital",
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
        ]
      : []),
    {
      "@type": type,
      "@id": `${url}#webpage`,
      url,
      name,
      description: description || undefined,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: serviceId ? { "@id": serviceId } : undefined,
      mainEntity:
        type === "ContactPage"
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
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}
