import type { Metadata, Viewport } from "next";
import { Montserrat, Raleway, Bodoni_Moda } from "next/font/google";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Beam Beam Digital, Devon | Website design, and information technology",
  description: "Beam Beam Digital is located in South Devon. Its services include website design and build, e-commerce, search engine optimisation, automation, artificial intelligence integration and information technology.",
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
    <html lang="en" className={`${montserrat.variable} ${raleway.variable} ${bodoniModa.variable} `}>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <FadeInObserver />
        <MobileNavObserver />
        <ActiveNavObserver />
        <SliceZone slices={navSlices} components={components} />
        <main id="main-content">
          {children}
        </main>
        <SliceZone slices={footerSlices} components={components} />
        <GoogleAnalytics />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
