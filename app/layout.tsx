import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import FadeInObserver from "@/components/FadeInObserver";
import MobileNavObserver from "@/components/MobileNavObserver";
import ActiveNavObserver from "@/components/ActiveNavObserver";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import {
  ORGANIZATION_ID,
  PERSON_ID,
  SITE_URL,
  serializeJsonLd,
} from "@/lib/jsonLd";

const montserrat = localFont({
  src: "./fonts/montserrat-latin-variable.woff2",
  variable: "--font-montserrat",
  display: "swap",
  weight: "100 900",
});

const raleway = localFont({
  src: "./fonts/raleway-latin-variable.woff2",
  variable: "--font-raleway",
  display: "swap",
  weight: "100 900",
});

const bodoniModa = localFont({
  src: "./fonts/bodoni-moda-latin-variable.woff2",
  variable: "--font-bodoni-moda",
  display: "swap",
  weight: "400 900",
});

const cormorantGaramond = localFont({
  src: "./fonts/cormorant-garamond-latin-variable.woff2",
  variable: "--font-cormorant-garamond",
  display: "swap",
  weight: "300 700",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.beambeam.co.uk"),
  title: "Beam Beam Digital, Devon | Websites, e-commerce, SEO, AI optimisation",
  description: "Beam Beam Digital is located in South Devon. Its services include website design and build, e-commerce, search engine and AI optimisation, and information technology.",
};

const logoId = `${SITE_URL}/#logo`;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Beam Beam Digital",
      url: SITE_URL,
      description:
        "Website design and build, e-commerce, search engine and AI optimisation, conversion optimisation, automation and information technology services based in South Devon.",
      logo: { "@id": logoId },
      image: { "@id": logoId },
      founder: { "@id": PERSON_ID },
      email: "amymvarga@yahoo.co.uk",
      telephone: "+44 7532 275361",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer enquiries",
        email: "amymvarga@yahoo.co.uk",
        telephone: "+44 7532 275361",
        availableLanguage: "English",
        areaServed: "GB",
      },
      address: {
        "@type": "PostalAddress",
        addressRegion: "South Devon",
        addressCountry: "GB",
      },
      areaServed: [
        { "@type": "Place", name: "South Devon" },
        { "@type": "Place", name: "South West England" },
        { "@type": "Country", name: "United Kingdom" },
      ],
      knowsAbout: [
        "Website design and development",
        "E-commerce",
        "Search engine optimisation",
        "AI search optimisation",
        "Conversion optimisation",
        "Workflow automation",
        "Information technology",
        "WordPress",
        "Squarespace",
        "Wix",
        "GoDaddy",
        "Shopify",
      ],
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Amy Varga",
      url: `${SITE_URL}/about-me`,
      jobTitle: "Freelance web developer",
      worksFor: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "ImageObject",
      "@id": logoId,
      url: `${SITE_URL}/images/logo.png`,
      contentUrl: `${SITE_URL}/images/logo.png`,
      width: 200,
      height: 200,
      caption: "Beam Beam Digital logo",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = createClient();
  const page = await client.getSingle("page");
  const navSlices = page.data.slices.filter((s) => s.slice_type === "menu_navigation");
  const footerSlices = page.data.slices.filter((s) => s.slice_type === "footer_navigation_and_services_regions");

  return (
    <html lang="en" className={`${montserrat.variable} ${raleway.variable} ${bodoniModa.variable} ${cormorantGaramond.variable} `}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <FadeInObserver />
        <MobileNavObserver />
        <ActiveNavObserver />
        <SliceZone slices={navSlices} components={components} />
        <main id="main-content">
          {children}
        </main>
        <div className="sticky-button animate-fill">
            <a href="contact">Get in touch</a>
          </div>
        <SliceZone slices={footerSlices} components={components} />
        <GoogleAnalytics />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
