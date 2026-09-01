import { createClient } from "@/prismicio";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";

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
        <div className="header">
          <div className="page-title"><h2 className="fade-in inline">Latest Resources</h2></div>
          <div className="callToAction">
            <span className="callToActionLink">
              <Link href="/resources" data-replace="View all resources"><span>View all resources</span></Link>
            </span>
          </div>
        </div>
        <div className="article-grid">
          {articles.map((article) => (
            <ArticleCard
              key={article.uid}
              article={article}
              className="fade-in"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
