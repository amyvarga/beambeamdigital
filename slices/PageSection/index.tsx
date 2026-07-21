"use client";

import { FC } from "react";
import type * as prismic from "@prismicio/client";
import { asText, isFilled} from "@prismicio/client";
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
  const Title = ctx?.isPage ? "h2" : "h3";
  const p = slice.primary as Record<string, unknown>;
  const bodyParagraph = p.body_paragraph_one as Parameters<typeof PrismicRichText>[0]["field"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: slice.primary.heading ?? "",
    description: asText(bodyParagraph),
    provider: {
        "@type": "Organization",
        "@id": "https://www.beambeam.co.uk/#organization",
    },
  };

  return (
    <section id="page" className="page section !pb-0 !px-[calc(var(--gap)*20))]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page-content content">
        {slice.primary.heading && (
          <div className="page-title title">
            <Title className="fade-in text-(--color-2) text-left">{slice.primary.heading}</Title>
          </div>
        )}
        <div className="page-text fade-in">
          <PrismicRichText field={bodyParagraph} />
          {slice.primary.cta_text?.trim() && isFilled.link(slice.primary.link) && (
            <p className="callToActionLink">
              <PrismicLink field={slice.primary.link} className="" data-replace={slice.primary.cta_text}>
                <span>{slice.primary.cta_text}</span>
              </PrismicLink>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageSection;
