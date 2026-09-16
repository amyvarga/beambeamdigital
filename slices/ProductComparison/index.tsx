import { FC } from "react";
import type * as prismic from "@prismicio/client";
import { asLink, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import ProductCard from "@/components/ProductCard";
import {
  ORGANIZATION_ID,
  absoluteUrl,
  serializeJsonLd,
} from "@/lib/jsonLd";

type ProductItem = {
  heading: prismic.KeyTextField;
  introduction: prismic.KeyTextField;
  product_title: prismic.KeyTextField;
  product_brief_description: prismic.RichTextField;
  product_inline_link: prismic.KeyTextField;
  product_inline_link_text: prismic.KeyTextField;
  product_details: prismic.RichTextField;
  cta_text: prismic.KeyTextField;
  cta_link: prismic.LinkField;
};

type ProductComparisonSlice = prismic.SharedSlice<
  "product_comparison",
  prismic.SharedSliceVariation<"default", {
    product: prismic.GroupField<ProductItem>;
  }>
>;

export type ProductComparisonProps = SliceComponentProps<ProductComparisonSlice>;

const ProductComparison: FC<ProductComparisonProps> = ({ slice, context }) => {
  const ctx = context as { schemaPath?: string } | undefined;
  const p = slice.primary as Record<string, unknown>;
  const products = (p.product as ProductItem[]) ?? [];
  const sectionHeading = products.find((item) => item.heading?.trim())?.heading;
  const visibleProducts = products.filter(
    (item) =>
      Boolean(item.product_title?.trim()) ||
      Boolean(asText(item.product_brief_description).trim()),
  );
  const pageUrl = ctx?.schemaPath ? absoluteUrl(ctx.schemaPath) : undefined;
  const listId = pageUrl ? `${pageUrl}#packages` : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": listId,
    name: sectionHeading ?? "Service packages",
    numberOfItems: visibleProducts.length,
    itemListElement: visibleProducts.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        "@id": pageUrl ? `${pageUrl}#package-${i + 1}` : undefined,
        url: asLink(item.cta_link)
          ? absoluteUrl(asLink(item.cta_link) as string)
          : pageUrl
            ? `${pageUrl}#packages`
            : undefined,
        name: item.product_title ?? "",
        description: asText(item.product_brief_description),
        provider: { "@id": ORGANIZATION_ID },
      },
    })),
  };

  return (
    <section
      id="product"
      className="product-section section !flex-col"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {visibleProducts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      )}
      <div className="product-content content fade-in">
        {sectionHeading && (
          <div className="product-title title">
            <h2>{sectionHeading}</h2>
          </div>
        )}
        <div className="product-items" id="packages">
          {visibleProducts.map((item, i) => (
            <ProductCard
              key={i}
              title={item.product_title ?? `Package ${i + 1}`}
              briefDescription={item.product_brief_description}
              cta_text={item.cta_text ?? null}
              cta_link={item.cta_link ?? null}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductComparison;
