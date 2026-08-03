import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { asLink, asText, Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

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
    alternates: { canonical: "/work" },
    openGraph: {
      title,
      description,
      url: "/work",
      type: "website",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function WorkPage() {
  const client = createClient();
  const page = await client.getSingle("work");
  const title = page.data.meta_title || META_TITLE;
  const description = page.data.meta_description || META_DESCRIPTION;
  const workSlice = page.data.slices.find(
    (slice) => slice.slice_type === "featured_card_grid",
  ) as Content.FeaturedCardGridSlice | undefined;
  const projects = (workSlice?.primary.cards ?? [])
    .filter((card) => card.title)
    .map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: card.title,
        description: asText(card.description_list) || undefined,
        url: asLink(card.link) || undefined,
        image: card.image.url || undefined,
      },
    }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/work#webpage`,
    url: `${SITE_URL}/work`,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    ...(projects.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        name: "Beam Beam Digital work",
        numberOfItems: projects.length,
        itemListElement: projects,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd label="Work" path="/work" />
      <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />
    </>
  );
}
