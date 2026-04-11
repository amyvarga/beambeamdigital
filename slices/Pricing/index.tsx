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
        <div className="pricing-packages">
          <div className="pricing-package fade-in">
            <h3>{slice.primary.pricing_package_1_title}</h3>
            <PrismicRichText field={slice.primary.pricing_package_1_description} />
          </div>
          <div className="pricing-package fade-in">
            <h3>{slice.primary.pricing_package_2_title}</h3>
            <PrismicRichText field={slice.primary.pricing_package_2_description} />
          </div>
          <div className="pricing-package fade-in">
            <h3>{slice.primary.pricing_package_3_title}</h3>
            <PrismicRichText field={slice.primary.pricing_package_3_description} />
          </div>
          <div className="pricing-package fade-in">
            <h3>{slice.primary.pricing_package_4_title}</h3>
            <PrismicRichText field={slice.primary.pricing_package_4_description} />
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default ContentHeader;
