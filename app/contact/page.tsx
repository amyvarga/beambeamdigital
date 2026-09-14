import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import PageSliceZone from "@/components/PageSliceZone";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import { getPrimarySchemaImage } from "@/lib/jsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("contact");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    alternates: {
      canonical: "/contact",
    },
    openGraph: {
      url: "/contact",
      type: "website",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function ContactPage() {
  const client = createClient();
  const page = await client.getSingle("contact");
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    page.data.slices,
  );
  return (
    <>
      <PageJsonLd
        path="/contact"
        name={String(page.data.meta_title || "Contact Beam Beam Digital")}
        description={page.data.meta_description}
        type="ContactPage"
        image={primaryImage}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
      />
      <BreadcrumbJsonLd label="Contact" path="/contact" />
      <PageSliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true, schemaPath: "/contact" }}
      />
    </>
  );
}
