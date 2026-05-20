import { MetadataRoute } from "next";

const baseUrl = "https://www.beambeam.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/websites`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/ecommerce`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/seo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];
}
