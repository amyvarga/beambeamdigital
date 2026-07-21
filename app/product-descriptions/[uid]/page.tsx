import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

type ProductDescriptionPageProps = {
  params: Promise<{ uid: string }>;
};

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("product_description");

  return pages.map(({ uid }) => ({ uid }));
}

export async function generateMetadata({
  params,
}: ProductDescriptionPageProps): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();

  try {
    const page = await client.getByUID("product_description", uid);

    return {
      title: page.data.meta_title,
      description: page.data.meta_description,
      openGraph: {
        images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductDescriptionPage({
  params,
}: ProductDescriptionPageProps) {
  const { uid } = await params;
  const client = createClient();
  let page;

  try {
    page = await client.getByUID("product_description", uid);
  } catch {
    notFound();
  }

  const label = page.data.meta_title || uid;

  return (
    <>
      <BreadcrumbJsonLd
        label={String(label)}
        path={`/product-descriptions/${uid}`}
      />
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true }}
      />
    </>
  );
}
