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
    two_columns: prismic.BooleanField;
  }>
>;

export type PageSectionProps = SliceComponentProps<PageSectionSlice>;

const PageSection: FC<PageSectionProps> = ({ slice }) => {
  const Title = "h2";
  const pageTextLayout = slice.primary.two_columns
    ? "lg:col-start-2 lg:col-span-2 lg:columns-2"
    : "lg:col-start-2 lg:col-span-2";
  const p = slice.primary as Record<string, unknown>;
  const bodyParagraph = p.body_paragraph_one as Parameters<typeof PrismicRichText>[0]["field"];

  return (
    <section id="page" className="page section">
      <div className="page-content content">
        {slice.primary.heading && (
          <div className="page-title title col-span-full">
            <Title className="fade-in w-full text-left text-(--color-2)">{slice.primary.heading}</Title>
          </div>
        )}
        <div className={`page-text ${pageTextLayout}`}>
          <PrismicRichText field={bodyParagraph} />
          {slice.primary.cta_text?.trim() && isFilled.link(slice.primary.link) && (
            <p className="text-right">
              <PrismicLink field={slice.primary.link} className="" data-replace={slice.primary.cta_text}>
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
