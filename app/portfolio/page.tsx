import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { asLink, asText, Content } from "@prismicio/client";
import { components } from "@/slices";
import PageSliceZone from "@/components/PageSliceZone";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import {
  ORGANIZATION_ID,
  SITE_URL,
  getPrimarySchemaImage,
  schemaImageObject,
} from "@/lib/jsonLd";

const path = "/portfolio";
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
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
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
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    page.data.slices,
  );
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
          image: card.image.url ? schemaImageObject(card.image) : undefined,
          creator: { "@id": ORGANIZATION_ID },
        },
      };
    });
  const itemListId = `${SITE_URL}${path}#itemlist`;
  const itemList = {
    "@type": "ItemList",
    "@id": itemListId,
    name: "Beam Beam Digital portfolio",
    numberOfItems: projects.length,
    itemListElement: projects,
  };

  return (
    <>
      <PageJsonLd
        path={path}
        name={String(title)}
        description={description}
        type="CollectionPage"
        image={primaryImage}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
        aboutId={ORGANIZATION_ID}
        mainEntityId={projects.length > 0 ? itemListId : undefined}
        additionalGraph={projects.length > 0 ? [itemList] : []}
      />
      <BreadcrumbJsonLd label="Portfolio" path={path} />
      <PageSliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true, schemaPath: path }}
      />
    </>
  );
}
