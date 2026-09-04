import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { asText, asLink } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import { serializeJsonLd } from "@/lib/jsonLd";

const SITE_URL = "https://www.beambeam.co.uk";

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
    const title = article.data.meta_title ?? asText(article.data.title);
    const description = article.data.meta_description ?? article.data.excerpt;
    const path = `/resources/${uid}`;
    const image = article.data.meta_image?.url ?? article.data.featured_image?.url;
    return {
      title,
      description,
      alternates: {
        canonical: path,
      },
      openGraph: {
        title,
        description: description ?? undefined,
        url: path,
        type: "article",
        images: image ? [image] : [],
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
  const path = `/resources/${uid}`;
  const url = `${SITE_URL}${path}`;
  const publishedDate = article.data.date ?? article.first_publication_date;
  const image = article.data.featured_image?.url ?? article.data.meta_image?.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: title,
    description: article.data.meta_description ?? article.data.excerpt ?? undefined,
    datePublished: publishedDate,
    dateModified: article.last_publication_date,
    inLanguage: article.lang,
    isAccessibleForFree: true,
    articleSection: "Resources",
    keywords: article.tags.length > 0 ? article.tags : undefined,
    author: article.data.author
      ? {
          "@type": "Person",
          name: article.data.author,
          url: `${SITE_URL}/about-me`,
        }
      : undefined,
    image: image ?? undefined,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <>
      <PageJsonLd
        path={path}
        name={title}
        description={article.data.meta_description ?? article.data.excerpt}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <BreadcrumbJsonLd label={title} path={path} />
      <article className="page-section section">
        <div className="breadcrumb">
          <span><Link href="/resources">← Resources</Link></span>
        </div>
        <div className="content article-content min-[1135px]:!px-[calc(var(--gap)*10))]">
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
              <time dateTime={publishedDate}>
                {new Date(publishedDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
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
