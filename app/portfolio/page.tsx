import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("work");
  return {
    title: page.data.meta_title ?? "Work | Beam Beam Digital",
    description: page.data.meta_description ?? undefined,
    openGraph: {
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function WorkPage() {
  const client = createClient();
  const page = await client.getSingle("work");
  return <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />;
}
