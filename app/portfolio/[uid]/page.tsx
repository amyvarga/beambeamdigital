import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import PortfolioCaseStudyJsonLd from "@/components/PortfolioCaseStudyJsonLd";

type PortfolioCaseStudyPageProps = {
  params: Promise<{ uid: string }>;
};

export async function generateStaticParams() {
  const client = createClient();
  const caseStudies = await client.getAllByType("portfolio_case_study");

  return caseStudies.map(({ uid }) => ({ uid }));
}

export async function generateMetadata({
  params,
}: PortfolioCaseStudyPageProps): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();

  try {
    const caseStudy = await client.getByUID("portfolio_case_study", uid);
    const title = caseStudy.data.meta_title || uid;
    const description = caseStudy.data.meta_description || undefined;
    const path = `/portfolio/${uid}`;

    return {
      title,
      description,
      alternates: { canonical: path },
      openGraph: {
        title,
        description,
        url: path,
        type: "website",
        images: caseStudy.data.meta_image?.url
          ? [caseStudy.data.meta_image.url]
          : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function PortfolioCaseStudyPage({
  params,
}: PortfolioCaseStudyPageProps) {
  const { uid } = await params;
  const client = createClient();

  let caseStudy;
  try {
    caseStudy = await client.getByUID("portfolio_case_study", uid);
  } catch {
    notFound();
  }

  return (
    <>
      <PortfolioCaseStudyJsonLd caseStudy={caseStudy} />
      <SliceZone
        slices={caseStudy.data.slices}
        components={components}
        context={{ isPage: true }}
      />
    </>
  );
}
