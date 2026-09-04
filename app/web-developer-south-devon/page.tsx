import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";

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

  return (
    <>
      <PageJsonLd
        path={path}
        name={String(page.data.meta_title || "Web Developer in South Devon")}
        description={page.data.meta_description}
        serviceName="Web development services"
      />
      <BreadcrumbJsonLd label="Services" path={path} />
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true }}
      />
    </>
  );
}
