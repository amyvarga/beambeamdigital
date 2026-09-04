import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { asLink, asText, Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { serializeJsonLd } from "@/lib/jsonLd";

const SITE_URL = "https://www.beambeam.co.uk";
const META_TITLE = "Our Work | Web Design Portfolio | Beam Beam Digital";
const META_DESCRIPTION =
  "Explore websites, e-commerce and digital projects created by Beam Beam Digital for businesses in Devon and beyond.";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("work");
  const title = page.data.meta_title || META_TITLE;
  const description = page.data.meta_description || META_DESCRIPTION;

  return {
    title,
    description,
    alternates: { canonical: "/portfolio" },
    openGraph: {
      title,
      description,
      url: "/portfolio",
      type: "website",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function PortfolioPage() {
  const client = createClient();
  const page = await client.getSingle("work");
  const title = page.data.meta_title || META_TITLE;
  const description = page.data.meta_description || META_DESCRIPTION;
  const workSlice = page.data.slices.find(
    (slice) => slice.slice_type === "featured_card_grid",
  ) as Content.FeaturedCardGridSlice | undefined;
  const projects = (workSlice?.primary.cards ?? [])
    .filter((card) => card.title)
    .map((card, index) => {
      const href = asLink(card.link);
      const url = href ? new URL(href, SITE_URL).toString() : undefined;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          "@id": url ? `${url}#case-study` : undefined,
          name: card.title,
          description: asText(card.description_list) || undefined,
          url,
          image: card.image.url || undefined,
        },
      };
    });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/portfolio#webpage`,
    url: `${SITE_URL}/portfolio`,
    name: title,
    description,
    inLanguage: "en-GB",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    breadcrumb: { "@id": `${SITE_URL}/portfolio#breadcrumb` },
    about: { "@id": `${SITE_URL}/#organization` },
    ...(projects.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        "@id": `${SITE_URL}/portfolio#itemlist`,
        name: "Beam Beam Digital portfolio",
        numberOfItems: projects.length,
        itemListElement: projects,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <BreadcrumbJsonLd label="Portfolio" path="/portfolio" />
      <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />
    </>
  );
}
