import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

/**
 * Props for `HeroBanner`.
 */
export type HeroBannerProps = SliceComponentProps<Content.HeroBannerSlice>;

/**
 * Component for "Hero Banner" Slices.
 */
const HeroBanner: FC<HeroBannerProps> = ({ slice }) => {
  const headlineText = asText(slice.primary.headline).trim();

  return (
    <section
      className="section hero-section"
      id="home"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
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
        {slice.primary.introduction?.trim() && (
          <p className="hero-introduction">{slice.primary.introduction}</p>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
