import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import LatestArticles from "@/components/LatestArticles";
import PageJsonLd from "@/components/PageJsonLd";
import PageSliceZone from "@/components/PageSliceZone";
import {
  getHeroHeading,
  getPrimarySchemaImage,
} from "@/lib/jsonLd";

const PAGE_PATH = "/search-conversion-optimisation";

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
  const serviceName = getHeroHeading(
    page.data.slices,
    "Search engine and conversion optimisation",
  );
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    page.data.slices,
  );
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
        }}
      />
      <LatestArticles />
    </>
  );
}
