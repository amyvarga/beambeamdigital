import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicLink } from "@prismicio/react";

/**
 * Props for `HeroBanner`.
 */
export type HeroBannerProps = SliceComponentProps<Content.HeroBannerSlice>;

/**
 * Component for "Hero Banner" Slices.
 */
const HeroBanner: FC<HeroBannerProps> = ({ slice }) => {
  // Extract data with fallbacks
  const headlineText = slice.primary.headline
    ? asText(slice.primary.headline)
    : "BEAM BEAM Digital";

  const subheadlineText = slice.primary.subheadline
    ? asText(slice.primary.subheadline)
    : "Supporting small businesses to harness the benefits of online and digital technologies";

  const ctaButtons = slice.primary.cta || [];
  const bgColor = slice.primary.background_color || undefined;

  // Split headline for logo spans (handles any number of words)
  const headlineWords = headlineText.split(" ");
  const firstPart = headlineWords.slice(0, -1).join(" ");
  const lastPart = headlineWords[headlineWords.length - 1];

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
        <h1 className="hero-title title">
          <span className="logo-beam">{firstPart}</span>{" "}
          <span className="logo-digital">{lastPart}</span>
        </h1>
        <p className="hero-strapline">{subheadlineText}</p>
        <div className="hero-cta">
          {ctaButtons.length > 0 ? (
            ctaButtons.map((button, index) => (
              <PrismicLink
                key={index}
                field={button.cta_link}
                className="btn btn-primary"
              >
                {button.cta_label || "Get in touch"}
              </PrismicLink>
            ))
          ) : (
            <a href="#contact" className="btn btn-primary">Get in touch</a>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
