import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

export default async function Home() {
  const client = createClient();
  const page = await client.getSingle("page");

  return <SliceZone slices={page.data.slices} components={components} />;
}