import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("contact");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function ContactPage() {
  const client = createClient();
  const page = await client.getSingle("contact");
  return (
    <>
      <BreadcrumbJsonLd label="Contact" path="/contact" />
      <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />
    </>
  );
}
