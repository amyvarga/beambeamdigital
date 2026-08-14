import { asText, type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import Link from "next/link";

type ArticleCardProps = {
  article: Content.ArticleDocument;
  headingLevel?: "h2" | "h3";
  showAuthor?: boolean;
  className?: string;
};

export default function ArticleCard({
  article,
  headingLevel = "h3",
  showAuthor = false,
  className = "",
}: ArticleCardProps) {
  const Heading = headingLevel;

  return (
    <Link
      href={`/resources/${article.uid}`}
      className={`article-card cursor-read ${className}`.trim()}
    >
      {article.data.featured_image?.url && (
        <PrismicNextImage
          field={article.data.featured_image}
          className="article-card-image"
          alt=""
        />
      )}
      <div className="article-card-body">
        <Heading>{asText(article.data.title)}</Heading>
        {article.data.date && (
          <time className="article-meta" dateTime={article.data.date}>
            {new Date(article.data.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        )}
        {showAuthor && article.data.author && (
          <span className="article-meta"> · {article.data.author}</span>
        )}
        {article.data.excerpt && (
          <p className="article-excerpt">{article.data.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
