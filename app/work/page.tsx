import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("work");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function WorkPage() {
  const client = createClient();
  const page = await client.getSingle("work");
  return (
    <>
      <PageJsonLd
        path="/work"
        name={String(page.data.meta_title || "Work")}
        description={page.data.meta_description}
        type="CollectionPage"
      />
      <BreadcrumbJsonLd label="Work" path="/work" />
      <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />
    </>
  );
}
