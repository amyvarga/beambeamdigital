import type { Metadata, Viewport } from "next";
import { Montserrat, Raleway, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import FadeInObserver from "@/components/FadeInObserver";
import MobileNavObserver from "@/components/MobileNavObserver";
import ActiveNavObserver from "@/components/ActiveNavObserver";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

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
  title: "Beam Beam Digital App",
  description: "Beam Beam Digital is located in South Devon. I deliver digital solutions that include website design, build and development, AI integration and task automation services. I specialise in e-commerce and search engine optimisation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${raleway.variable} ${bodoniModa.variable} `}>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <FadeInObserver />
        <MobileNavObserver />
        <ActiveNavObserver />
        <main id="main-content">
        {children}
        </main>
        <GoogleAnalytics />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
