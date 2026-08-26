import { FC } from "react";
import { Content, isFilled, asText } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import Carousel from "@/components/Carousel";

export type RecentWorkProps =
  SliceComponentProps<Content.FeaturedCardGridSlice>;

const RecentWork: FC<RecentWorkProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  const Title = ctx?.isPage ? "h1" : "h2";
  const cards = slice.primary.cards;
  const cardElements = cards.map((card, index) => {
    const cardContent = (
      <>
        {card.image.url && (
          <div className="work-card-image">
            <PrismicNextImage field={card.image} />
          </div>
        )}
        <div className="work-card-content">
          {card.title?.trim() && <h3>{card.title}</h3>}
          {isFilled.richText(card.description_list) && (
            <div className="work-description">
              <PrismicRichText field={card.description_list} />
            </div>
          )}
        </div>
      </>
    );
    const sharedProps = {
      className: "work-card cursor-view fade-in overflow-hidden",
    };

    return isFilled.link(card.link)
      ? <PrismicLink key={index} field={card.link} {...sharedProps}>{cardContent}</PrismicLink>
      : <div key={index} {...sharedProps}>{cardContent}</div>;
  });

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
        {isFilled.richText(slice.primary.work_introduction) && (
          <div className="work-introduction fade-in">
            <PrismicRichText field={slice.primary.work_introduction} />
          </div>
        )}
        {cardElements.length > 0 && (
          <div className="work-grid">{cardElements}</div>
        )}
        {slice.primary.cta_text?.trim() && isFilled.link(slice.primary.cta_link) && (
          <div className="work-cta">
            <PrismicLink field={slice.primary.cta_link} className="btn animate-fill">
              {slice.primary.cta_text}
            </PrismicLink>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentWork;
