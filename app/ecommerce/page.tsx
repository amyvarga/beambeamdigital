import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("ecommerce");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    alternates: {
      canonical: "/ecommerce",
    },
    openGraph: {
      url: "/ecommerce",
      type: "website",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function EcommercePage() {
  const client = createClient();
  const page = await client.getSingle("ecommerce");
  return (
    <>
      <PageJsonLd
        path="/ecommerce"
        name={String(page.data.meta_title || "Ecommerce Services")}
        description={page.data.meta_description}
        serviceName="Ecommerce website design and development"
      />
      <BreadcrumbJsonLd label="Ecommerce" path="/ecommerce" />
      <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />
    </>
  );
}
