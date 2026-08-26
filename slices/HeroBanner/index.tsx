import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicLink, PrismicRichText } from "@prismicio/react";

/**
 * Props for `HeroBanner`.
 */
export type HeroBannerProps = SliceComponentProps<Content.HeroBannerSlice>;

/**
 * Component for "Hero Banner" Slices.
 */
const HeroBanner: FC<HeroBannerProps> = ({ slice }) => {
  const headlineText = asText(slice.primary.headline).trim();
  const ctaButtons = slice.primary.cta || [];
  const bgColor = slice.primary.background_color || undefined;

  return (
    <section
      className="section hero-section"
      id="home"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <div className="hero-background"></div>
      <div className="hero-overlay"></div>
      <div className="hero-content content">
        {headlineText && (
          <h1 className="hero-title title">{headlineText}</h1>
        )}
        <div className="hero-strapline">
          <PrismicRichText field={slice.primary.subheadline} />
        </div>
        {ctaButtons.some((b) => b.cta_label) && (
          <div className="hero-cta">
            {ctaButtons.filter((b) => b.cta_label).map((button, index) => (
              <PrismicLink
                key={index}
                field={button.cta_link}
                className="btn animate-fill"
              >
                {button.cta_label}
              </PrismicLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
