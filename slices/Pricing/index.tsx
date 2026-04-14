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
const ContentHeader: FC<ContentHeaderProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  const Title = ctx?.isPage ? "h1" : "h2";
  return (
    <section
      id="pricing"
      className="pricing section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="pricing-content content fade-in">
        <div className="pricing-title title">
          <Title className="fade-in">{asText(slice.primary.title)}</Title>
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
          <div className="pricing-package fade-in">
            <h3>{slice.primary.pricing_package_5_title}</h3>
            <PrismicRichText field={slice.primary.pricing_package_5_description} />
          </div>
        </div>


      </div>
    </section>
  );
};

export default ContentHeader;
