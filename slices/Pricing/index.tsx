import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

/**
 * Props for `ContentHeader`.
 */
export type ContentHeaderProps =
  SliceComponentProps<Content.ContentHeaderSlice>;

/**
 * Component for "ContentHeader" Slices.
 */
const ContentHeader: FC<ContentHeaderProps> = ({ slice }) => {
  const bgColor = slice.primary.background_color ?? undefined;

  return (
    <section
      id="pricing"
      className="pricing section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <div className="pricing-content content fade-in">
        <div className="pricing-title title">
          <h2 className="fade-in">{asText(slice.primary.title)}</h2>
        </div>
        <div className="pricing-textn">
          <PrismicRichText field={slice.primary.description} />
        </div>
      </div>
    </section>
  );
};

export default ContentHeader;
