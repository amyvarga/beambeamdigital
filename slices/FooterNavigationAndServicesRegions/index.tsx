import { FC } from "react";
import { Content } from "@prismicio/client";
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
       <div className="footer-seo">
          <div className="seo-section">
            <h4>{slice.primary.services_regions.map((item) => item.service_title).join(", ")}</h4>
            <ul className="seo-links">
              {slice.primary.services_regions.flatMap((item) => item.service_region ?? []).map((link, index) => (
                <li key={index}>
                  <PrismicLink field={link}>
                    {(link as { text?: string }).text ?? "Link"}
                  </PrismicLink>
                </li>
              ))}
            </ul>
          </div>
      </div>
      <div className="footer-bottom">
        <p>{slice.primary.copyright_notice}</p>
      </div>
    </footer>
  );
};

export default FooterNavigationAndServicesRegions;
