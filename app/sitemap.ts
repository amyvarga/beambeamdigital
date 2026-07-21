import { MetadataRoute } from "next";
import { createClient } from "@/prismicio";

const baseUrl = "https://www.beambeam.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient();
  const articles = await client.getAllByType("article");
  const productDescriptions = await client.getAllByType("product_description");
  const articleEntries = articles.map((a) => ({
    url: `${baseUrl}/resources/${a.uid}`,
    lastModified: a.last_publication_date
      ? new Date(a.last_publication_date)
      : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const productDescriptionEntries = productDescriptions.map((page) => ({
    url: `${baseUrl}/${page.uid}`,
    lastModified: page.last_publication_date
      ? new Date(page.last_publication_date)
      : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/websites`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/ecommerce`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/seo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...articleEntries,
    ...productDescriptionEntries,
  ];
}
