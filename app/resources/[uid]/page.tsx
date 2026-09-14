import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { asText, asLink } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { notFound } from "next/navigation";
import { components } from "@/slices";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageJsonLd from "@/components/PageJsonLd";
import PageSliceZone from "@/components/PageSliceZone";
import {
  ORGANIZATION_ID,
  PERSON_ID,
  collectSchemaImages,
  getHeroHeading,
  getPrimarySchemaImage,
  schemaDate,
  schemaLanguage,
} from "@/lib/jsonLd";

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
  const headline = getHeroHeading(article.data.slices, title);
  const path = `/resources/${uid}`;
  const url = `${SITE_URL}${path}`;
  const publishedDate = article.data.date ?? article.first_publication_date;
  const preferredImage = article.data.featured_image?.url
    ? article.data.featured_image
    : article.data.meta_image;
  const primaryImage = getPrimarySchemaImage(preferredImage, [article.data.body]);
  const primaryImageId = primaryImage?.url ? `${url}#primaryimage` : undefined;
  const bodyImageUrls = collectSchemaImages(article.data.body)
    .map((image) => image.url)
    .filter((image): image is string => Boolean(image));
  const images = [
    ...(primaryImageId ? [{ "@id": primaryImageId }] : []),
    ...bodyImageUrls.filter((image) => image !== primaryImage?.url),
  ];
  const bodyText = asText(article.data.body).trim();

  const articleJsonLd = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    name: title,
    headline,
    alternativeHeadline: headline !== title ? title : undefined,
    description: article.data.meta_description ?? article.data.excerpt ?? undefined,
    datePublished: schemaDate(publishedDate),
    dateModified: schemaDate(article.last_publication_date),
    inLanguage: schemaLanguage(article.lang),
    isAccessibleForFree: true,
    articleSection: "Resources",
    keywords: article.tags.length > 0 ? article.tags : undefined,
    author: article.data.author
      ? article.data.author.trim().toLowerCase() === "amy varga"
        ? { "@id": PERSON_ID }
        : { "@type": "Person", name: article.data.author }
      : undefined,
    image: images.length > 0 ? images : undefined,
    wordCount: bodyText ? bodyText.split(/\s+/).length : undefined,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    publisher: { "@id": ORGANIZATION_ID },
  };

  return (
    <>
      <PageJsonLd
        path={path}
        name={String(article.data.meta_title || title)}
        description={article.data.meta_description ?? article.data.excerpt}
        image={primaryImage}
        datePublished={publishedDate}
        dateModified={article.last_publication_date}
        inLanguage={article.lang}
        mainEntityId={`${url}#article`}
        additionalGraph={[articleJsonLd]}
      />
      <BreadcrumbJsonLd
        label={title}
        path={path}
        parents={[{ name: "Resources", path: "/resources" }]}
      />
      <PageSliceZone
        slices={article.data.slices}
        components={components}
        context={{ isPage: false, schemaPath: path }}
      />
      <article className="page-section section">
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
