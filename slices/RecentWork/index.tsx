import { FC } from "react";
import { Content, isFilled, asText } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";

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
        <div className="work-grid">
          {cards.map((card, index) => {
            const cardContent = (
              <>
                {card.image.url && (
                  <div className="work-card-image">
                    <PrismicNextImage field={card.image} />
                  </div>
                )}
                <div className="work-card-content">
                  <h3>{card.title}</h3>
                  <div className="work-description">
                    <PrismicRichText field={card.description_list} />
                  </div>
                </div>
              </>
            );
            const sharedProps = {
              className: "work-card fade-in overflow-hidden",
            };
            return isFilled.link(card.link)
              ? <PrismicLink key={index} field={card.link} {...sharedProps}>{cardContent}</PrismicLink>
              : <div key={index} {...sharedProps}>{cardContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
};

export default RecentWork;
