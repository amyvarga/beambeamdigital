export const BUSINESS_STARTER_WEBSITE_SLUG = "business-starter-website";
export const SMALL_BUSINESS_AUTOMATION_SLUG = "small-business-automation";

const BUSINESS_STARTER_WEBSITE_LEGACY_SLUGS = [
  "simple-website",
  "simple-websites",
] as const;

const SMALL_BUSINESS_AUTOMATION_LEGACY_SLUGS = ["automation"] as const;

export function getPublicProductDescriptionSlug(uid: string) {
  if (
    BUSINESS_STARTER_WEBSITE_LEGACY_SLUGS.includes(
      uid as (typeof BUSINESS_STARTER_WEBSITE_LEGACY_SLUGS)[number],
    )
  ) {
    return BUSINESS_STARTER_WEBSITE_SLUG;
  }

  if (
    SMALL_BUSINESS_AUTOMATION_LEGACY_SLUGS.includes(
      uid as (typeof SMALL_BUSINESS_AUTOMATION_LEGACY_SLUGS)[number],
    )
  ) {
    return SMALL_BUSINESS_AUTOMATION_SLUG;
  }

  return uid;
}

export function getProductDescriptionUidCandidates(slug: string) {
  if (slug === BUSINESS_STARTER_WEBSITE_SLUG) {
    return [
      BUSINESS_STARTER_WEBSITE_SLUG,
      ...BUSINESS_STARTER_WEBSITE_LEGACY_SLUGS,
    ];
  }

  if (slug === SMALL_BUSINESS_AUTOMATION_SLUG) {
    return [
      SMALL_BUSINESS_AUTOMATION_SLUG,
      ...SMALL_BUSINESS_AUTOMATION_LEGACY_SLUGS,
    ];
  }

  return [slug];
}

const WEBSITE_SERVICE_SLUGS = new Set([
  BUSINESS_STARTER_WEBSITE_SLUG,
  "bespoke-website",
  "website-support",
]);

const SEO_SERVICE_SLUGS = new Set(["seo-audit", "seo-reviews"]);
const AUTOMATION_SERVICE_SLUGS = new Set([SMALL_BUSINESS_AUTOMATION_SLUG]);

export function getProductDescriptionBreadcrumbParents(slug: string) {
  const parents = [
    { name: "Services", path: "/web-developer-south-devon" },
  ];

  if (WEBSITE_SERVICE_SLUGS.has(slug)) {
    return [
      ...parents,
      {
        name: "Website design and development",
        path: "/website-design-development",
      },
    ];
  }

  if (SEO_SERVICE_SLUGS.has(slug)) {
    return [
      ...parents,
      {
        name: "Search engine and conversion optimisation",
        path: "/search-conversion-optimisation",
      },
    ];
  }

  return parents;
}

export function getProductDescriptionServiceType(slug: string) {
  if (WEBSITE_SERVICE_SLUGS.has(slug)) {
    return slug === "website-support"
      ? "Website support and maintenance"
      : "Website design and development";
  }

  if (SEO_SERVICE_SLUGS.has(slug)) {
    return "Search engine optimisation";
  }

  if (AUTOMATION_SERVICE_SLUGS.has(slug)) {
    return "Business and e-commerce automation";
  }

  return "Web development";
}
