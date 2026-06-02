import { createClient } from "@/prismicio";
import { asText } from "@prismicio/client";
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";

export default async function LatestArticles() {
  const client = createClient();
  const articles = await client.getAllByType("article", {
    orderings: [{ field: "my.article.date", direction: "desc" }],
    limit: 3,
  });

  if (articles.length === 0) return null;

  return (
    <div className="page-section section">
      <div className="content">
        <h2 className="fade-in inline">Latest Resources</h2>
        <span className="callToActionLink">
          <a href="/resources" data-replace={"View all resources"}><span>View all resources</span></a>
        </span>
        <div className="article-grid">
          {articles.map((article) => (
            <Link
              key={article.uid}
              href={`/resources/${article.uid}`}
              className="article-card fade-in"
            >
              {article.data.featured_image?.url && (
                <PrismicNextImage
                  field={article.data.featured_image}
                  className="article-card-image"
                  alt=""
                />
              )}
              <div className="article-card-body">
                <h3>{asText(article.data.title)}</h3>
                {article.data.date && (
                  <time className="article-meta" dateTime={article.data.date}>
                    {new Date(article.data.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
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
  );
}
