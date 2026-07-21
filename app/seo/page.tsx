import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import LatestArticles from "@/components/LatestArticles";
import { asText, Content } from "@prismicio/client";

const SITE_URL = "https://www.beambeam.co.uk";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("seo");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
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
        ...offer,
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: product.product_title,
          description: asText(product.product_brief_description),
        },
      };
    });
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE_URL}/seo#webpage`,
      url: `${SITE_URL}/seo`,
      name: page.data.meta_title ?? "SEO Services",
      description: page.data.meta_description ?? undefined,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Beam Beam Digital",
        url: SITE_URL,
      },
      about: { "@id": `${SITE_URL}/seo#service` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE_URL}/seo#service`,
      name: "SEO Services",
      serviceType: "Search engine optimisation",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Place", name: "South Devon" },
      hasOfferCatalog: { "@id": `${SITE_URL}/seo#offers` },
    },
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      "@id": `${SITE_URL}/seo#offers`,
      name: "SEO Packages",
      itemListElement: offers,
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BreadcrumbJsonLd label="SEO" path="/seo" />
      <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />
      <LatestArticles />
    </>
  );
}
