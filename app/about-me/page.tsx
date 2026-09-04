import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("about");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    alternates: {
      canonical: "/about-me",
    },
    openGraph: {
      url: "/about-me",
      type: "website",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function AboutMePage() {
  const client = createClient();
  const page = await client.getSingle("about");
  return (
    <>
      <PageJsonLd
        path="/about-me"
        name={String(page.data.meta_title || "About Beam Beam Digital")}
        description={page.data.meta_description}
        type="AboutPage"
      />
      <BreadcrumbJsonLd label="About" path="/about-me" />
      <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />
    </>
  );
}
