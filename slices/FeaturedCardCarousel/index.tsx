'use client';

import { FC, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";

/**
 * Props for `FeaturedCardGrid`.
 */
export type FeaturedCardGridProps =
  SliceComponentProps<Content.FeaturedCardGridSlice>;

/**
 * Component for "FeaturedCardGrid" Slices.
 */
const FeaturedCardGrid: FC<FeaturedCardGridProps> = ({ slice }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const cards = slice.primary.cards;

  function goTo(index: number) {
    const next = Math.max(0, Math.min(index, cards.length - 1));
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.children[next] as HTMLElement;
    carousel.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setCurrent(next);
  }

  function handleScroll() {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
    if (index !== current) setCurrent(index);
  }

  return (
    <section
      className="work section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="work-content content">
        <div className="work-title title">
          <PrismicRichText field={slice.primary.section_heading} />
        </div>
        <div className="work-carousel-wrapper">
          <button
            className="carousel-btn carousel-btn--prev"
            aria-label="Previous work"
            onClick={() => goTo(current - 1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div
            className="work-carousel"
            ref={carouselRef}
            onScroll={handleScroll}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") goTo(current - 1);
              if (e.key === "ArrowRight") goTo(current + 1);
            }}
          >
            {cards.map((card, index) => (
              <div key={index} className={`work-card fade-in ${card.title?.toLowerCase().replace(/\s+/g, "-") ?? ""}`}>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </PrismicLink>
              </div>
            ))}
          </div>
          <button
            className="carousel-btn carousel-btn--next"
            aria-label="Next work"
            onClick={() => goTo(current + 1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="carousel-dots">
            {cards.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === current ? " active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCardGrid;
