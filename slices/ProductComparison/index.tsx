"use client";

import { FC } from "react";
import type * as prismic from "@prismicio/client";
import { asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import ProductCard from "@/components/ProductCard";

type ProductItem = {
  product_title: prismic.KeyTextField;
  product_brief_description: prismic.RichTextField;
  price: prismic.KeyTextField;
  price_currency: prismic.KeyTextField;
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
  const ctx = context as { isPage?: boolean } | undefined;
  const HeadingTag = ctx?.isPage ? "h2" : "h3";
  const p = slice.primary as Record<string, unknown>;
  const products = (p.product as ProductItem[]) ?? [];
  const offerFor = (item: ProductItem) => {
    if (!item.price) return undefined;
    const range = item.price.match(/^\s*([\d,.]+)\s*[-–—]\s*([\d,.]+)\s*$/);
    if (range) {
      return {
        "@type": "AggregateOffer",
        lowPrice: range[1].replace(/,/g, ""),
        highPrice: range[2].replace(/,/g, ""),
        priceCurrency: item.price_currency ?? "GBP",
      };
    }
    return {
      "@type": "Offer",
      price: item.price,
      priceCurrency: item.price_currency ?? "GBP",
    };
  };

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
          offers: offerFor(item),
          provider: {
            "@type": "Organization",
            "@id": "https://www.beambeam.co.uk/#organization",
          },
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
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="product-content content fade-in">
        <div className="product-items" id="packages">
          {products.filter((item) => item.product_title || item.product_brief_description).map((item, i) => (
            <ProductCard
              key={i}
              title={item.product_title ?? null}
              briefDescription={item.product_brief_description}
              price={item.price ?? null}
              priceCurrency={item.price_currency ?? "GBP"}
              HeadingTag={HeadingTag}
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
