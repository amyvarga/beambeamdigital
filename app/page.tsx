import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

export default async function Home() {
  const client = createClient();
  const page = await client.getSingle("page");
  const heroSlices = page.data.slices.filter((s) => s.slice_type === "hero_banner");

  return <SliceZone slices={heroSlices} components={components} />;
}