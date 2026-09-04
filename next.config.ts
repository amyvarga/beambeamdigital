import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/websites",
        destination: "/website-design-development",
        permanent: true,
      },
      {
        source: "/seo",
        destination: "/search-conversion-optimisation",
        permanent: true,
      },
      {
        source: "/work",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/work/:path*",
        destination: "/portfolio/:path*",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/about-me",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/web-developer-south-devon",
        permanent: true,
      },
      {
        source: "/simple-website",
        destination: "/business-starter-website",
        permanent: true,
      },
      {
        source: "/simple-websites",
        destination: "/business-starter-website",
        permanent: true,
      },
      {
        source: "/product-descriptions/simple-website",
        destination: "/business-starter-website",
        permanent: true,
      },
      {
        source: "/product-descriptions/simple-websites",
        destination: "/business-starter-website",
        permanent: true,
      },
      {
        source: "/product-descriptions/business-starter-website",
        destination: "/business-starter-website",
        permanent: true,
      },
      {
        source: "/product-descriptions/:uid",
        destination: "/:uid",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
