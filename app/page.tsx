import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import LatestArticles from "@/components/LatestArticles";

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
  const contentSlices = page.data.slices.filter(
    (s) => s.slice_type !== "menu_navigation" && s.slice_type !== "footer_navigation_and_services_regions"
  );

  return (
    <>
      <SliceZone slices={contentSlices} components={components} />
      <LatestArticles />
    </>
  );
}