export const BUSINESS_STARTER_WEBSITE_SLUG = "business-starter-website";

const BUSINESS_STARTER_WEBSITE_LEGACY_SLUGS = [
  "simple-website",
  "simple-websites",
] as const;

export function getPublicProductDescriptionSlug(uid: string) {
  return BUSINESS_STARTER_WEBSITE_LEGACY_SLUGS.includes(
    uid as (typeof BUSINESS_STARTER_WEBSITE_LEGACY_SLUGS)[number],
  )
    ? BUSINESS_STARTER_WEBSITE_SLUG
    : uid;
}

export function getProductDescriptionUidCandidates(slug: string) {
  return slug === BUSINESS_STARTER_WEBSITE_SLUG
    ? [BUSINESS_STARTER_WEBSITE_SLUG, ...BUSINESS_STARTER_WEBSITE_LEGACY_SLUGS]
    : [slug];
}
