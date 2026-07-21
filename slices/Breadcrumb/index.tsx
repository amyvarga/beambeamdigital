import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicLink, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Breadcrumb`.
 */
export type BreadcrumbProps = SliceComponentProps<Content.BreadcrumbSlice>;

/**
 * Component for "Breadcrumb" Slices.
 */
const Breadcrumb: FC<BreadcrumbProps> = ({ slice }) => {
  const { primary } = slice;

  return (
    <div className="breadcrumb-section">
    <div className="breadcrumb-wrapper" data-slice-type={slice.slice_type}>
      {primary.breadcrumb_text_1?.trim() && (
        <span>
          {isFilled.link(primary.breadcrumb_1) ? (
            <PrismicLink field={primary.breadcrumb_1}>{primary.breadcrumb_text_1}</PrismicLink>
          ) : primary.breadcrumb_text_1}
        </span>
      )}
      {primary.breadcrumb_text_2?.trim() && (
        <span>
          {isFilled.link(primary.breadcrumb_link_2) ? (
            <PrismicLink field={primary.breadcrumb_link_2}>{primary.breadcrumb_text_2}</PrismicLink>
          ) : primary.breadcrumb_text_2}
        </span>
      )}
      {primary.breadcrumb_text_3?.trim() && (
        <span>
          {isFilled.link(primary.breadcrumb_link_3) ? (
            <PrismicLink field={primary.breadcrumb_link_3}>{primary.breadcrumb_text_3}</PrismicLink>
          ) : primary.breadcrumb_text_3}
        </span>
      )}
    </div>
    </div>
  );
};

export default Breadcrumb;
