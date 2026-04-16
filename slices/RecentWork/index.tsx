'use client';

import { FC } from "react";
import { Content, isFilled, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import Carousel from "@/components/Carousel";

export type RecentWorkProps =
  SliceComponentProps<Content.FeaturedCardGridSlice>;

const RecentWork: FC<RecentWorkProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  const Title = ctx?.isPage ? "h1" : "h2";
  const cards = slice.primary.cards;

  return (
    <section
      className="work section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="work"
    >
      <div className="work-content content">
        {asText(slice.primary.section_heading).trim() && (
          <div className="work-title title">
            <PrismicRichText
              field={slice.primary.section_heading}
              components={{ heading2: ({ children }) => <Title className="fade-in">{children}</Title> }}
            />
          </div>
        )}
        <Carousel>
          {cards.map((card, index) => {
            const cardContent = (
              <>
                {card.logo.url && (
                  <img
                    src={card.logo.url}
                    alt={card.logo.alt ?? ""}
                    width={card.logo.dimensions?.width}
                    height={card.logo.dimensions?.height}
                    className="transition-transform duration-500 ease-in-out hover:scale-125"
                  />
                )}
                <div className="work-description">
                  <PrismicRichText field={card.description_list} />
                </div>
              </>
            );
            const sharedProps = {
              className: `carousel-item work-card fade-in overflow-hidden`,
              style: {
  ['--card-bg' as string]: card.background_color || undefined,
  ['--card-color' as string]: card.colour || undefined,
},
            };
            return isFilled.link(card.link)
              ? <PrismicLink key={index} field={card.link} target="_blank" rel="noopener noreferrer" {...sharedProps}>{cardContent}</PrismicLink>
              : <div key={index} {...sharedProps}>{cardContent}</div>;
          })}
        </Carousel>
        {slice.primary.cta_button_label && (
          <p className="callToAction">
            <PrismicLink field={slice.primary.cta_button_link} className="btn btn-primary">
              {slice.primary.cta_button_label}
            </PrismicLink>
          </p>
        )}
      </div>
    </section>
  );
};

export default RecentWork;
