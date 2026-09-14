import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import LatestArticles from "@/components/LatestArticles";
import PageJsonLd from "@/components/PageJsonLd";
import PageSliceZone from "@/components/PageSliceZone";
import {
  ORGANIZATION_ID,
  getPrimarySchemaImage,
} from "@/lib/jsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("page");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      url: "/",
      type: "website",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function Home() {
  const client = createClient();
  const page = await client.getSingle("page");
  const contentSlices = page.data.slices.filter(
    (s) => s.slice_type !== "menu_navigation" && s.slice_type !== "footer_navigation_and_services_regions"
  );
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    contentSlices,
  );

  return (
    <>
      <PageJsonLd
        path="/"
        name={String(page.data.meta_title || "Beam Beam Digital")}
        description={page.data.meta_description}
        includeWebsite
        image={primaryImage}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
        aboutId={ORGANIZATION_ID}
        mainEntityId={ORGANIZATION_ID}
      />
      <PageSliceZone
        slices={contentSlices}
        components={components}
        context={{ schemaPath: "/" }}
      />
      <LatestArticles />
    </>
  );
}
