import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("websites");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    alternates: {
      canonical: "/website-design-development",
    },
    openGraph: {
      url: "/website-design-development",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function WebsitesPage() {
  const client = createClient();
  const page = await client.getSingle("websites");
  return (
    <>
      <PageJsonLd
        path="/website-design-development"
        name={String(page.data.meta_title || "Website Services")}
        description={page.data.meta_description}
        serviceName="Website design and development"
      />
      <BreadcrumbJsonLd label="Websites" path="/website-design-development" />
      <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />
    </>
  );
}
