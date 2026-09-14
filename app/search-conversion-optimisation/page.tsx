import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import LatestArticles from "@/components/LatestArticles";
import PageJsonLd from "@/components/PageJsonLd";
import PageSliceZone from "@/components/PageSliceZone";
import { asText, Content } from "@prismicio/client";
import {
  ORGANIZATION_ID,
  getHeroHeading,
  getPrimarySchemaImage,
} from "@/lib/jsonLd";

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
  const serviceName = getHeroHeading(
    page.data.slices,
    "Search engine and conversion optimisation",
  );
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    page.data.slices,
  );
  const catalogName =
    products.find((product) => product.heading?.trim())?.heading ||
    "SEO support options";
  const offers = products
    .filter((product) => product.product_title?.trim())
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
            provider: { "@id": ORGANIZATION_ID },
          },
        },
      };
    });
  const offerCatalogId = offers.length > 0 ? `${PAGE_URL}#packages` : undefined;
  return (
    <>
      <PageJsonLd
        path={PAGE_PATH}
        name={String(page.data.meta_title || serviceName)}
        description={page.data.meta_description}
        serviceName={serviceName}
        serviceType="Search engine and conversion optimisation"
        image={primaryImage}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
        serviceOfferCatalogId={offerCatalogId}
        additionalGraph={
          offerCatalogId
            ? [
                {
                  "@type": "OfferCatalog",
                  "@id": offerCatalogId,
                  name: catalogName,
                  numberOfItems: offers.length,
                  itemListElement: offers,
                },
              ]
            : []
        }
      />
      <BreadcrumbJsonLd
        label="Search engine and conversion optimisation"
        path={PAGE_PATH}
        parents={[
          { name: "Services", path: "/web-developer-south-devon" },
        ]}
      />
      <PageSliceZone
        slices={page.data.slices}
        components={components}
        context={{
          isPage: true,
          schemaPath: PAGE_PATH,
          suppressProductSchema: true,
        }}
      />
      <LatestArticles />
    </>
  );
}
