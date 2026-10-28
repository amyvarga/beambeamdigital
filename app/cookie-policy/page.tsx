import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import PageSliceZone from "@/components/PageSliceZone";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import { getPrimarySchemaImage } from "@/lib/jsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("cookie_policy");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    alternates: {
      canonical: "/cookie-policy",
    },
    openGraph: {
      url: "/cookie-policy",
      type: "website",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function CookiePolicyPage() {
  const client = createClient();
  const page = await client.getSingle("cookie_policy");
  return (
    <>
      <PageJsonLd
        path="/cookie-policy"
        name={String(page.data.meta_title || "Cookie policy")}
        description={page.data.meta_description}
        image={getPrimarySchemaImage(page.data.meta_image, page.data.slices)}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
      />
      <BreadcrumbJsonLd label="Cookie policy" path="/cookie-policy" />
      <PageSliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true, schemaPath: "/cookie-policy" }}
      />
    </>
  );
}
