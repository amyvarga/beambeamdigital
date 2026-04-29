"use client";

import { FC } from "react";
import type * as prismic from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";

type ProductSectionSlice = prismic.SharedSlice<
  "aboutSection",
  prismic.SharedSliceVariation<"default", {
    heading: prismic.KeyTextField;
    body_paragraph_one: prismic.RichTextField;
    cta_text: prismic.KeyTextField;
    cta_button_label: prismic.KeyTextField;
    cta_button_link: prismic.LinkField;
  }>
>;

export type ProductSectionProps = SliceComponentProps<ProductSectionSlice>;

const ProductSection: FC<ProductSectionProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  const Title = ctx?.isPage ? "h1" : "h2";
  const p = slice.primary as Record<string, unknown>;
  const bodyParagraph = p.body_paragraph_one as Parameters<typeof PrismicRichText>[0]["field"];

  return (
    <section id="about" className="about section">
      <div className="page-content content">
        {slice.primary.heading && (
          <div className="page-title title">
            <Title className="fade-in">{slice.primary.heading}</Title>
          </div>
        )}
        <div className="page-text fade-in">
          <PrismicRichText field={bodyParagraph} />
          {(slice.primary.cta_text?.trim() || slice.primary.cta_button_label) && (
            <p className="callToAction">
              {slice.primary.cta_text?.trim() && slice.primary.cta_text}
              {slice.primary.cta_button_label && (
                <PrismicLink field={slice.primary.cta_button_link} className="btn btn-primary">
                  {slice.primary.cta_button_label}
                </PrismicLink>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
