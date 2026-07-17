import type { Metadata, Viewport } from "next";
import { Montserrat, Raleway, Bodoni_Moda, Cormorant_Garamond } from "next/font/google";
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

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni-moda",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  display: "swap",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Beam Beam Digital",
  url: "https://www.beambeam.co.uk",
  description: "Web design, e-commerce, SEO, AI optimisation and IT services based in South Devon.",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Devon",
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "Place", name: "South Devon" },
    { "@type": "Place", name: "South West England" },
  ],
  knowsAbout: [
    "Website Design",
    "E-commerce",
    "Search Engine Optimisation",
    "AI Optimisation",
    "Digital Marketing",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <div className="sticky-button">
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
