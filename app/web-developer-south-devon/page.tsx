import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import PageSliceZone from "@/components/PageSliceZone";
import {
  getHeroHeading,
  getPrimarySchemaImage,
} from "@/lib/jsonLd";

const path = "/web-developer-south-devon";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("services");

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

export default async function ServicesPage() {
  const client = createClient();
  const page = await client.getSingle("services");
  const serviceName = getHeroHeading(
    page.data.slices,
    "Web development services",
  );
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    page.data.slices,
  );

  return (
    <>
      <PageJsonLd
        path={path}
        name={String(page.data.meta_title || "Web Developer in South Devon")}
        description={page.data.meta_description}
        serviceName={serviceName}
        serviceType="Web development"
        image={primaryImage}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
      />
      <BreadcrumbJsonLd label="Services" path={path} />
      <PageSliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true, schemaPath: path }}
      />
    </>
  );
}
