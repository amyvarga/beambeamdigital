import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("page");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function Home() {
  const client = createClient();
  const page = await client.getSingle("page");
  const heroSlices = page.data.slices.filter((s) => s.slice_type === "hero_banner");

  return <SliceZone slices={heroSlices} components={components} />;
}