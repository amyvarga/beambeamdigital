"use client";

import { FC } from "react";
import type * as prismic from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";

type PageSectionSlice = prismic.SharedSlice<
  "aboutSection",
  prismic.SharedSliceVariation<"default", {
    heading: prismic.KeyTextField;
    body_paragraph_one: prismic.RichTextField;
    cta_text: prismic.KeyTextField;
    link: prismic.LinkField;
  }>
>;

export type PageSectionProps = SliceComponentProps<PageSectionSlice>;

const PageSection: FC<PageSectionProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  /*const Title = ctx?.isPage ? "h2" : "h3";*/
  const Title = "h2";
  const p = slice.primary as Record<string, unknown>;
  const bodyParagraph = p.body_paragraph_one as Parameters<typeof PrismicRichText>[0]["field"];

  return (
    <section id="page" className="page section">
      <div className="page-content content">
        {slice.primary.heading && (
          <div className="page-title title">
            <Title className="fade-in text-(--color-2) text-left">{slice.primary.heading}</Title>
          </div>
        )}
        <div className="page-text fade-in">
          <PrismicRichText field={bodyParagraph} />
          {slice.primary.cta_text?.trim() && isFilled.link(slice.primary.link) && (
            <p className="text-center">
              <PrismicLink field={slice.primary.link} className="animate-fill btn" data-replace={slice.primary.cta_text}>
                {slice.primary.cta_text}
              </PrismicLink>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageSection;
