import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { asText } from "@prismicio/client";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import ArticleCard from "@/components/ArticleCard";
import PageSliceZone from "@/components/PageSliceZone";
import {
  PERSON_ID,
  SITE_URL,
  getPrimarySchemaImage,
  schemaDate,
} from "@/lib/jsonLd";

const path = "/resources";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("resources");
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

export default async function ResourcesPage() {
  const client = createClient();
  const [page, articles] = await Promise.all([
    client.getSingle("resources"),
    client.getAllByType("article", {
      orderings: [{ field: "my.article.date", direction: "desc" }],
    }),
  ]);
  const primaryImage = getPrimarySchemaImage(
    page.data.meta_image,
    page.data.slices,
  );
  const articleListId = `${SITE_URL}${path}#articles`;
  const articleItems = articles.map((article, index) => {
    const articleUrl = `${SITE_URL}${path}/${article.uid}`;
    const preferredImage = article.data.featured_image?.url
      ? article.data.featured_image
      : article.data.meta_image;
    const articleImage = getPrimarySchemaImage(preferredImage, [article.data.body]);

    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        url: articleUrl,
        headline: asText(article.data.title),
        description:
          article.data.meta_description || article.data.excerpt || undefined,
        datePublished: schemaDate(
          article.data.date || article.first_publication_date,
        ),
        dateModified: schemaDate(article.last_publication_date),
        image: articleImage?.url || undefined,
        author: article.data.author
          ? article.data.author.trim().toLowerCase() === "amy varga"
            ? { "@id": PERSON_ID }
            : { "@type": "Person", name: article.data.author }
          : undefined,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    };
  });

  return (
    <>
      <PageJsonLd
        path={path}
        name={String(page.data.meta_title || "Resources")}
        description={page.data.meta_description}
        type="CollectionPage"
        image={primaryImage}
        datePublished={page.first_publication_date}
        dateModified={page.last_publication_date}
        inLanguage={page.lang}
        mainEntityId={articleListId}
        additionalGraph={[
          {
            "@type": "ItemList",
            "@id": articleListId,
            name: "Beam Beam Digital resources",
            numberOfItems: articleItems.length,
            itemListElement: articleItems,
          },
        ]}
      />
      <BreadcrumbJsonLd label="Resources" path={path} />
      <PageSliceZone
        slices={page.data.slices}
        components={components}
        context={{ isPage: true, schemaPath: path }}
      />
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
