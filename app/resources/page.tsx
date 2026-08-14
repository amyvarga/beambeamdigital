import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import ArticleCard from "@/components/ArticleCard";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("resources");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: page.data.meta_image?.url ? [page.data.meta_image.url] : [],
    },
  };
}

export default async function ResourcesPage() {
  const client = createClient();
  const [page, articles] = await Promise.all([
    client.getSingle("resources"),
    client.getAllByType("article", {
      orderings: [{ field: "my.article.date", direction: "desc" }],
    }),
  ]);

  return (
    <>
      <PageJsonLd
        path="/resources"
        name={String(page.data.meta_title || "Resources")}
        description={page.data.meta_description}
        type="CollectionPage"
      />
      <BreadcrumbJsonLd label="Resources" path="/resources" />
      <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />
      <div className="page-section section">
        <div className="content">
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard
                key={article.uid}
                article={article}
                headingLevel="h2"
                showAuthor
                className="transition-transform duration-500 ease-in-out hover:brightness-125"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
