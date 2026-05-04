"use client";

import { FC } from "react";
import type * as prismic from "@prismicio/client";
import { asLink } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";

type ProductItem = {
  inline_link: prismic.KeyTextField;
  heading: prismic.KeyTextField;
  description: prismic.RichTextField;
  cta_text: prismic.KeyTextField;
  cta_link: prismic.LinkField;
};

type PageSectionSlice = prismic.SharedSlice<
  "aboutSection",
  prismic.SharedSliceVariation<"default", {
    product: prismic.GroupField<ProductItem>;
  }>
>;

export type PageSectionProps = SliceComponentProps<PageSectionSlice>;

const PageSection: FC<PageSectionProps> = ({ slice }) => {
  const p = slice.primary as Record<string, unknown>;
  const products = (p.product as ProductItem[]) ?? [];

  return (
    <section className="page-section section">
      <div className="page-content content">
        {products.map((item, i) => (
          <div
            key={i}
            id={item.inline_link ?? undefined}
            className="page-section-item"
          >
            {item.heading && <h2>{item.heading}</h2>}
            {item.description && (
              <div className="page-text">
                <PrismicRichText field={item.description} />
              </div>
            )}
            {(() => {
              const ctaText = item.cta_text?.trim();
              const ctaHref = asLink(item.cta_link);
              const ctaLabel = (item.cta_link as { text?: string })?.text?.trim();
              if (!ctaText && (!ctaHref || !ctaLabel)) return null;
              return (
                <p className="callToAction">
                  {ctaText && item.cta_text}
                  {ctaHref && ctaLabel && (
                    <PrismicLink field={item.cta_link} className="btn btn-primary">
                      {ctaLabel}
                    </PrismicLink>
                  )}
                </p>
              );
            })()}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PageSection;
