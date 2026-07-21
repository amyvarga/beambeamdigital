import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { asText, asLink } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { notFound } from "next/navigation";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

type Props = { params: Promise<{ uid: string }> };

export async function generateStaticParams() {
  const client = createClient();
  const articles = await client.getAllByType("article");
  return articles.map((article) => ({ uid: article.uid }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  try {
    const article = await client.getByUID("article", uid);
    return {
      title: article.data.meta_title ?? asText(article.data.title),
      description: article.data.meta_description ?? article.data.excerpt,
      openGraph: {
        images: article.data.meta_image?.url
          ? [article.data.meta_image.url]
          : article.data.featured_image?.url
          ? [article.data.featured_image.url]
          : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: Props) {
  const { uid } = await params;
  const client = createClient();
  let article;
  try {
    article = await client.getByUID("article", uid);
  } catch {
    notFound();
  }

  const title = asText(article.data.title);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: article.data.meta_description ?? article.data.excerpt ?? undefined,
    datePublished: article.data.date ?? undefined,
    author: article.data.author
      ? { "@type": "Person", name: article.data.author }
      : undefined,
    image: article.data.featured_image?.url ?? undefined,
    url: `https://www.beambeam.co.uk/resources/${uid}`,
    publisher: {
      "@type": "Organization",
      name: "Beam Beam Digital",
      url: "https://www.beambeam.co.uk",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd label={title} path={`/resources/${uid}`} />
      <article className="page-section section">
        <div className="breadcrumb">
          <span><a href="/resources">← Resources</a></span>
        </div>
        <div className="content article-content !px-[calc(var(--gap)*10))]">
          {article.data.featured_image?.url && (
            <PrismicNextImage
              field={article.data.featured_image}
              className="article-hero-image fade-in"
              width={1200}
              height={400}
              priority
              alt=""
            />
          )}
          <header className="article-header">
            <h1 className="fade-in">{title}</h1>
            <p className="article-meta fade-in">
              {article.data.date && (
                <time dateTime={article.data.date}>
                  {new Date(article.data.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              )}
              {article.data.author && <span> · {article.data.author}</span>}
            </p>
          </header>
          
          <div className="article-body">
            <PrismicRichText field={article.data.body} />
          </div>
          {article.data.cta_text && article.data.cta_link && (
            <div className="flex justify-center mt-[calc(var(--gap)*2)]">
              <a className="btn" href={asLink(article.data.cta_link) ?? "#"}>
                {article.data.cta_text}
              </a>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
