'use client';

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import Carousel from "@/components/Carousel";

export type FeaturedCardGridProps =
  SliceComponentProps<Content.FeaturedCardGridSlice>;

const FeaturedCardGrid: FC<FeaturedCardGridProps> = ({ slice }) => {
  const cards = slice.primary.cards;

  return (
    <section
      className="work section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="work"
    >
      <div className="work-content content">
        <div className="work-title title">
          <PrismicRichText field={slice.primary.section_heading} />
        </div>
        <Carousel>
          {cards.map((card, index) => (
            <div key={index} className={`carousel-item work-card fade-in ${card.title?.toLowerCase().replace(/\s+/g, "-") ?? ""}`}>
              {card.logo.url && (
                <img
                  src={card.logo.url}
                  alt={card.logo.alt ?? ""}
                  width={card.logo.dimensions?.width}
                  height={card.logo.dimensions?.height}
                />
              )}
              <h3>{card.title}</h3>
              <div className="work-description">
                <PrismicRichText field={card.description_list} />
              </div>
              <PrismicLink field={card.link} className="work-link">
                {(card.link as { text?: string }).text ?? "Visit Site"}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </PrismicLink>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedCardGrid;
