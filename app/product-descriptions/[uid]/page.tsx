import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import PageSliceZone from "@/components/PageSliceZone";
import {
  getProductDescriptionBreadcrumbParents,
  getProductDescriptionServiceType,
  getPublicProductDescriptionSlug,
} from "@/lib/productDescriptionSlugs";
import {
  getHeroHeading,
  getPrimarySchemaImage,
} from "@/lib/jsonLd";

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

  const publicSlug = getPublicProductDescriptionSlug(uid);
  const path = `/${publicSlug}`;
  const serviceName = getHeroHeading(page.data.slices, publicSlug);
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    page.data.slices,
  );

  return (
    <>
      <PageJsonLd
        path={path}
        name={String(page.data.meta_title || serviceName)}
        description={page.data.meta_description}
        serviceName={serviceName}
        serviceType={getProductDescriptionServiceType(publicSlug)}
        image={primaryImage}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
      />
      <BreadcrumbJsonLd
        label={serviceName}
        path={path}
        parents={getProductDescriptionBreadcrumbParents(publicSlug)}
      />
      <PageSliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true, schemaPath: path }}
      />
    </>
  );
}
