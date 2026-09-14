export const SITE_URL = "https://www.beambeam.co.uk";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PERSON_ID = `${SITE_URL}/about-me#amy-varga`;

export type SchemaImageInput = {
  url?: string | null;
  alt?: string | null;
  dimensions?: {
    width?: number | null;
    height?: number | null;
  } | null;
};

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  if (path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function schemaLanguage(language?: string | null) {
  return language?.toLowerCase().startsWith("en")
    ? "en-GB"
    : language || "en-GB";
}

export function schemaDate(date?: string | null) {
  return date?.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
}

export function getHeroHeading(slices: readonly unknown[], fallback: string) {
  const hero = slices.find((slice) => {
    if (!slice || typeof slice !== "object") return false;
    return (slice as { slice_type?: unknown }).slice_type === "hero_banner";
  }) as
    | { primary?: { headline?: unknown; subheadline?: unknown } }
    | undefined;

  for (const field of [hero?.primary?.headline, hero?.primary?.subheadline]) {
    if (typeof field === "string" && field.trim()) return field.trim();
    if (!Array.isArray(field)) continue;

    const blocks = field.filter(
      (block): block is { type?: unknown; text?: unknown } =>
        Boolean(block) && typeof block === "object",
    );
    const heading = blocks.find(
      (block) =>
        block.type === "heading1" &&
        typeof block.text === "string" &&
        block.text.trim(),
    );
    if (typeof heading?.text === "string") return heading.text.trim();

    const text = blocks
      .map((block) => (typeof block.text === "string" ? block.text : ""))
      .join(" ")
      .trim();
    if (text) return text;
  }

  return fallback;
}

export function collectSchemaImages(
  value: unknown,
  images = new Map<string, SchemaImageInput>(),
) {
  if (!value || typeof value !== "object") return [...images.values()];

  if (Array.isArray(value)) {
    value.forEach((item) => collectSchemaImages(item, images));
    return [...images.values()];
  }

  const item = value as Record<string, unknown>;
  if (
    typeof item.url === "string" &&
    item.dimensions &&
    typeof item.dimensions === "object"
  ) {
    const dimensions = item.dimensions as {
      width?: number | null;
      height?: number | null;
    };
    images.set(item.url, {
      url: item.url,
      alt: typeof item.alt === "string" ? item.alt : undefined,
      dimensions,
    });
  }

  Object.values(item).forEach((child) => collectSchemaImages(child, images));
  return [...images.values()];
}

export function getPrimarySchemaImage(
  metaImage: SchemaImageInput | null | undefined,
  slices: readonly unknown[],
) {
  if (metaImage?.url) return metaImage;
  return collectSchemaImages(slices)[0];
}

export function schemaImageObject(image: SchemaImageInput, id?: string) {
  if (!image.url) return undefined;

  return {
    "@type": "ImageObject",
    "@id": id,
    url: image.url,
    contentUrl: image.url,
    width: image.dimensions?.width || undefined,
    height: image.dimensions?.height || undefined,
    caption: image.alt || undefined,
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
