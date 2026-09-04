import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import LatestArticles from "@/components/LatestArticles";
import { asText, Content } from "@prismicio/client";
import { serializeJsonLd } from "@/lib/jsonLd";

const SITE_URL = "https://www.beambeam.co.uk";
const PAGE_PATH = "/search-conversion-optimisation";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("seo");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    alternates: {
      canonical: PAGE_PATH,
    },
    openGraph: {
      url: PAGE_PATH,
      type: "website",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function SeoPage() {
  const client = createClient();
  const page = await client.getSingle("seo");
  const productSlice = page.data.slices.find(
    (slice) => slice.slice_type === "product_comparison",
  ) as Content.ProductComparisonSlice | undefined;
  const products = productSlice?.primary.product ?? [];
  const offers = products
    .filter((product) => product.product_title)
    .map((product, index) => {
      const range = product.price?.match(/^\s*([\d,.]+)\s*[-–—]\s*([\d,.]+)\s*$/);
      const offer = range
        ? {
            "@type": "AggregateOffer",
            lowPrice: range[1].replace(/,/g, ""),
            highPrice: range[2].replace(/,/g, ""),
            priceCurrency: product.price_currency ?? "GBP",
          }
        : {
            "@type": "Offer",
            price: product.price ?? undefined,
            priceCurrency: product.price_currency ?? "GBP",
          };
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          ...offer,
          "@id": `${PAGE_URL}#offer-${index + 1}`,
          url: `${PAGE_URL}#packages`,
          itemOffered: {
            "@type": "Service",
            "@id": `${PAGE_URL}#package-${index + 1}`,
            name: product.product_title,
            description: asText(product.product_brief_description),
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
      };
    });
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: page.data.meta_title ?? "SEO Services",
        description: page.data.meta_description ?? undefined,
        inLanguage: "en-GB",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
        about: { "@id": `${PAGE_URL}#service` },
        mainEntity: { "@id": `${PAGE_URL}#service` },
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}#service`,
        name: "SEO Services",
        serviceType: "Search engine optimisation",
        description: page.data.meta_description ?? undefined,
        url: PAGE_URL,
        inLanguage: "en-GB",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: [
          { "@type": "Place", name: "South Devon" },
          { "@type": "Country", name: "United Kingdom" },
        ],
        hasOfferCatalog: { "@id": `${PAGE_URL}#offers` },
      },
      {
        "@type": "OfferCatalog",
        "@id": `${PAGE_URL}#offers`,
        name: "SEO Packages",
        numberOfItems: offers.length,
        itemListElement: offers,
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <BreadcrumbJsonLd label="SEO" path={PAGE_PATH} />
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true, suppressProductSchema: true }}
      />
      <LatestArticles />
    </>
  );
}
