import type { Metadata } from "next";
import { Montserrat, Raleway, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import FadeInObserver from "@/components/FadeInObserver";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import HashAnalytics from "@/components/HashAnalytics"

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

export const metadata: Metadata = {
  title: "Beam Beam Digital App",
  description: "Beam Beam Digital is located in South Devon. They deliver digital solutions that include website design and development, AI process intergration and task automation services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${raleway.variable} ${bodoniModa.variable}`}>
      <body>
        <FadeInObserver />
        {children}
        <HashAnalytics />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
