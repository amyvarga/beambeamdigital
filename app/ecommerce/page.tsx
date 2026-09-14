import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import PageSliceZone from "@/components/PageSliceZone";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import {
  getHeroHeading,
  getPrimarySchemaImage,
} from "@/lib/jsonLd";

const path = "/ecommerce";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("ecommerce");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      url: path,
      type: "website",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function EcommercePage() {
  const client = createClient();
  const page = await client.getSingle("ecommerce");
  const serviceName = getHeroHeading(
    page.data.slices,
    "E-commerce optimisation",
  );
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    page.data.slices,
  );
  return (
    <>
      <PageJsonLd
        path={path}
        name={String(page.data.meta_title || "Ecommerce Services")}
        description={page.data.meta_description}
        serviceName={serviceName}
        serviceType="E-commerce search engine and performance optimisation"
        image={primaryImage}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
      />
      <BreadcrumbJsonLd
        label="E-commerce"
        path={path}
        parents={[
          { name: "Services", path: "/web-developer-south-devon" },
        ]}
      />
      <PageSliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true, schemaPath: path }}
      />
    </>
  );
}
