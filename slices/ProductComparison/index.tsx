"use client";

import { FC } from "react";
import type * as prismic from "@prismicio/client";
import { asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import ProductCard from "@/components/ProductCard";

type ProductItem = {
  product_title: prismic.KeyTextField;
  product_brief_description: prismic.RichTextField;
  product_inline_link: prismic.KeyTextField;
  product_inline_link_text: prismic.KeyTextField;
  product_details: prismic.RichTextField;
};

type ProductComparisonSlice = prismic.SharedSlice<
  "product_comparison",
  prismic.SharedSliceVariation<"default", {
    product: prismic.GroupField<ProductItem>;
  }>
>;

export type ProductComparisonProps = SliceComponentProps<ProductComparisonSlice>;

const ProductComparison: FC<ProductComparisonProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  const HeadingTag = ctx?.isPage ? "h2" : "h3";
  const p = slice.primary as Record<string, unknown>;
  const products = (p.product as ProductItem[]) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products
      .filter((item) => item.product_title || item.product_brief_description)
      .map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: item.product_title ?? "",
          description: asText(item.product_brief_description),
          provider: {
            "@type": "LocalBusiness",
            name: "Beam Beam Digital",
          },
        },
      })),
  };

  return (
    <section
      id="product"
      className="product-section section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="product-content content fade-in">
        <div className="product-items">
          {products.filter((item) => item.product_title || item.product_brief_description).map((item, i) => (
            <ProductCard
              key={i}
              title={item.product_title ?? null}
              briefDescription={item.product_brief_description}
              ctaText={item.product_inline_link_text ?? null}
              details={item.product_details}
              HeadingTag={HeadingTag}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductComparison;
