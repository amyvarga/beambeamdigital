import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { asText, Content } from "@prismicio/client";
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

  const isSeoService = uid === "seo-audit" || uid === "seo-reviews";
  const serviceName = uid === "seo-reviews" ? "SEO Reviews" : "SEO Audit";
  const sections = page.data.slices
    .filter((slice) => slice.slice_type === "aboutSection")
    .map((slice) => slice as Content.AboutSectionSlice)
    .filter((slice) => slice.primary.heading || slice.primary.body_paragraph_one);
  const auditSchema = isSeoService
    ? [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `https://www.beambeam.co.uk/${uid}#webpage`,
          url: `https://www.beambeam.co.uk/${uid}`,
          name: page.data.meta_title ?? serviceName,
          description: page.data.meta_description ?? undefined,
          about: { "@id": `https://www.beambeam.co.uk/${uid}#service` },
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `https://www.beambeam.co.uk/${uid}#service`,
          name: page.data.meta_title ?? serviceName,
          serviceType: serviceName,
          description: page.data.meta_description ?? undefined,
          provider: { "@id": "https://www.beambeam.co.uk/#organization" },
          hasPart: {
            "@type": "ItemList",
            name: `${serviceName} Contents`,
            itemListElement: sections.map((section, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: section.primary.heading,
              description: asText(section.primary.body_paragraph_one),
            })),
          },
        },
      ]
    : [];

  return (
    <>
      {auditSchema.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(auditSchema) }}
        />
      )}
      <BreadcrumbJsonLd label={String(page.data.meta_title || uid)} path={`/${uid}`} />
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true }}
      />
    </>
  );
}
