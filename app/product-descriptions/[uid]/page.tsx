import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";

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
    const title = page.data.meta_title ?? uid;
    const description = page.data.meta_description ?? undefined;

    return {
      title,
      description,
      alternates: {
        canonical: `/${uid}`,
      },
      openGraph: {
        title,
        description,
        url: `/${uid}`,
        type: "website",
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

  const label = String(page.data.meta_title || uid);

  return (
    <>
      <PageJsonLd
        path={`/${uid}`}
        name={label}
        description={page.data.meta_description}
        serviceName={label}
      />
      <BreadcrumbJsonLd
        label={label}
        path={`/${uid}`}
      />
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true }}
      />
    </>
  );
}
