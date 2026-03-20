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
       
      <div className="footer-bottom">
        <p>{slice.primary.copyright_notice}</p>
      </div>
       <div className="footer-seo">
          {(() => {
            const sharedLinks = slice.primary.services_regions[0]?.service_region ?? [];
            return slice.primary.services_regions.map((item, index) => (
              <div key={index} className="seo-section">
                <h4>{item.service_title}</h4>
                <ul className="seo-links">
                  {sharedLinks.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <PrismicLink field={link}>
                        {(link as { text?: string }).text ?? "Link"}
                      </PrismicLink>
                    </li>
                  ))}
                </ul>
              </div>
            ));
          })()}
      </div>
    </footer>
  );
};

export default FooterNavigationAndServicesRegions;
