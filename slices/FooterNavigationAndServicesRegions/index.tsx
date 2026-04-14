import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicLink } from "@prismicio/react";

/**
 * Props for `FooterNavigationAndServicesRegions`.
 */
export type FooterNavigationAndServicesRegionsProps =
  SliceComponentProps<Content.FooterNavigationAndServicesRegionsSlice>;

/**
 * Component for "FooterNavigationAndServicesRegions" Slices.
 */
const FooterNavigationAndServicesRegions: FC<
  FooterNavigationAndServicesRegionsProps
> = ({ slice }) => {
  return (
    <footer
      className="footer section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="footer-bottom">
        <p>{slice.primary.copyright_notice}</p>
      </div>
    </footer>
  );
};

export default FooterNavigationAndServicesRegions;
