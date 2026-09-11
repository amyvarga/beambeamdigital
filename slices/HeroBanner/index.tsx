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
const HeroBanner: FC<HeroBannerProps> = ({ slice, index, slices }) => {
  const headlineText = asText(slice.primary.headline).trim();
  const author = slice.primary.author?.trim();
  const hasMetadata = Boolean(slice.primary.date_written || author);
  const hasFollowingBreadcrumb = slices[index + 1]?.slice_type === "breadcrumb";

  return (
    <section
      className={`section hero-section${
        hasFollowingBreadcrumb ? " hero-section--with-breadcrumb" : ""
      }`}
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
        {hasMetadata && (
          <p className="hero-meta">
            {slice.primary.date_written && (
              <time dateTime={slice.primary.date_written}>
                {new Date(slice.primary.date_written).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
            {slice.primary.date_written && author && (
              <span aria-hidden="true"> · </span>
            )}
            {author && <span>{author}</span>}
          </p>
        )}

      </div>
    </section>
  );
};

export default HeroBanner;
