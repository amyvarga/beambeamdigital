import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("services");
  return {
    title: page.data.meta_title ?? "Services | Beam Beam Digital",
    description: page.data.meta_description ?? undefined,
    openGraph: {
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function ServicesPage() {
  const client = createClient();
  const page = await client.getSingle("services");
  return <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />;
}
