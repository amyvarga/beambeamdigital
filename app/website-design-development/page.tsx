import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import PageSliceZone from "@/components/PageSliceZone";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import {
  SITE_URL,
  getHeroHeading,
  getPrimarySchemaImage,
} from "@/lib/jsonLd";

const path = "/website-design-development";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("websites");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      url: path,
      type: "website",
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function WebsitesPage() {
  const client = createClient();
  const page = await client.getSingle("websites");
  const serviceName = getHeroHeading(
    page.data.slices,
    "Website design and development",
  );
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    page.data.slices,
  );
  const productSlice = page.data.slices.find(
    (slice) => slice.slice_type === "product_comparison",
  );
  const hasPackages =
    productSlice?.slice_type === "product_comparison" &&
    productSlice.primary.product.some(
      (product) =>
        Boolean(product.product_title) ||
        product.product_brief_description.length > 0,
    );
  return (
    <>
      <PageJsonLd
        path={path}
        name={String(page.data.meta_title || "Website Services")}
        description={page.data.meta_description}
        serviceName={serviceName}
        serviceType="Website design and development"
        image={primaryImage}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
        serviceOfferCatalogId={
          hasPackages ? `${SITE_URL}${path}#packages` : undefined
        }
      />
      <BreadcrumbJsonLd
        label="Website design and development"
        path={path}
        parents={[
          { name: "Services", path: "/web-developer-south-devon" },
        ]}
      />
      <PageSliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true, schemaPath: path }}
      />
    </>
  );
}
