"use client";

import { FC } from "react";
import type * as prismic from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

type ProductItem = {
  product_title: prismic.KeyTextField;
  product_brief_description: prismic.RichTextField;
  product_inline_link: prismic.KeyTextField;
  product_inline_link_text: prismic.KeyTextField;
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
  const Title = ctx?.isPage ? "h2" : "h3";
  const p = slice.primary as Record<string, unknown>;
  const products = (p.product as ProductItem[]) ?? [];

  return (
    <section
      id="pricing"
      className="pricing section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="pricing-content content fade-in">
        <div className="pricing-packages">
          {products.filter((item) => item.product_title || item.product_brief_description).map((item, i) => (
            <div
              key={i}
              className="pricing-package fade-in"
            >
              {item.product_title && <Title>{item.product_title}</Title>}
              {item.product_brief_description && (
                <PrismicRichText field={item.product_brief_description} />
              )}
              <p className="callToActionLink">
                {item.product_inline_link && item.product_inline_link_text && (
                  <a href={item.product_inline_link ?? undefined} data-replace={item.product_inline_link_text} className=""><span>{item.product_inline_link_text}</span></a>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductComparison;
