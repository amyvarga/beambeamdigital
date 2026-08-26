import { MetadataRoute } from "next";
import { createClient } from "@/prismicio";

const baseUrl = "https://www.beambeam.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient();
  const [
    home,
    services,
    websites,
    ecommerce,
    seo,
    work,
    about,
    contact,
    resources,
    articles,
    productDescriptions,
    portfolioCaseStudies,
  ] = await Promise.all([
    client.getSingle("page"),
    client.getSingle("services"),
    client.getSingle("websites"),
    client.getSingle("ecommerce"),
    client.getSingle("seo"),
    client.getSingle("work"),
    client.getSingle("about"),
    client.getSingle("contact"),
    client.getSingle("resources"),
    client.getAllByType("article"),
    client.getAllByType("product_description"),
    client.getAllByType("portfolio_case_study"),
  ]);

  const coreEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(home.last_publication_date), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/web-developer-south-devon`, lastModified: new Date(services.last_publication_date), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/website-design-development`, lastModified: new Date(websites.last_publication_date), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/ecommerce`, lastModified: new Date(ecommerce.last_publication_date), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/search-conversion-optimisation`, lastModified: new Date(seo.last_publication_date), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(work.last_publication_date), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about-me`, lastModified: new Date(about.last_publication_date), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(contact.last_publication_date), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/resources`, lastModified: new Date(resources.last_publication_date), changeFrequency: "weekly", priority: 0.7 },
  ];

  const articleEntries = articles.map((a) => ({
    url: `${baseUrl}/resources/${a.uid}`,
    lastModified: new Date(a.last_publication_date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const productDescriptionEntries = productDescriptions.map((page) => ({
    url: `${baseUrl}/${page.uid}`,
    lastModified: new Date(page.last_publication_date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const portfolioCaseStudyEntries = portfolioCaseStudies.map((caseStudy) => ({
    url: `${baseUrl}/portfolio/${caseStudy.uid}`,
    lastModified: new Date(caseStudy.last_publication_date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...coreEntries,
    ...articleEntries,
    ...productDescriptionEntries,
    ...portfolioCaseStudyEntries,
  ];
}
