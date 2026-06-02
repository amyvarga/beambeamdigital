import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { asText } from "@prismicio/client";
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

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
      <BreadcrumbJsonLd label="Resources" path="/resources" />
      <SliceZone slices={page.data.slices} components={components} context={{ isPage: true }} />
      <div className="page-section section">
        <div className="content">
          <div className="article-grid">
            {articles.map((article) => (
              <Link
                key={article.uid}
                href={`/resources/${article.uid}`}
                className="article-card transition-transform duration-500 ease-in-out hover:brightness-125"
              >
                {article.data.featured_image?.url && (
                  <PrismicNextImage
                    field={article.data.featured_image}
                    className="article-card-image"
                    alt=""
                  />
                )}
                <div className="article-card-body">
                  <h2>{asText(article.data.title)}</h2>
                  {article.data.date && (
                    <time className="article-meta" dateTime={article.data.date}>
                      {new Date(article.data.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  )}
                  {article.data.author && (
                    <span className="article-meta"> · {article.data.author}</span>
                  )}
                  {article.data.excerpt && (
                    <p className="article-excerpt">{article.data.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
