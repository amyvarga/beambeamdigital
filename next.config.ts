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
    ];
  },
};

export default nextConfig;
