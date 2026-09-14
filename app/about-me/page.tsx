import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import PageSliceZone from "@/components/PageSliceZone";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import {
  ORGANIZATION_ID,
  PERSON_ID,
  getPrimarySchemaImage,
} from "@/lib/jsonLd";

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
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    page.data.slices,
  );
  const primaryImageId = primaryImage?.url
    ? "https://www.beambeam.co.uk/about-me#primaryimage"
    : undefined;
  return (
    <>
      <PageJsonLd
        path="/about-me"
        name={String(page.data.meta_title || "About Beam Beam Digital")}
        description={page.data.meta_description}
        type="AboutPage"
        image={primaryImage}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
        aboutId={PERSON_ID}
        mainEntityId={PERSON_ID}
        additionalGraph={[
          {
            "@type": "Person",
            "@id": PERSON_ID,
            name: "Amy Varga",
            url: "https://www.beambeam.co.uk/about-me",
            description: page.data.meta_description || undefined,
            jobTitle: "Freelance web developer",
            image: primaryImageId ? { "@id": primaryImageId } : undefined,
            worksFor: { "@id": ORGANIZATION_ID },
          },
        ]}
      />
      <BreadcrumbJsonLd label="About" path="/about-me" />
      <PageSliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true, schemaPath: "/about-me" }}
      />
    </>
  );
}
