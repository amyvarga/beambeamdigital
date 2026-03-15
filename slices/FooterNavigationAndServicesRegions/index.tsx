import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";

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
      <nav className="footer-main">
          <span className="footer-logo">
            <span className="logo-beam">{slice.primary.brand_title}</span>{" "}
            <span className="logo-digital">{slice.primary.brand_subtitle}</span>
          </span>
          <PrismicRichText field={slice.primary.description} />
          <ul className="footer-links">
            {slice.primary.navigation_links.map((link, index) => (
              <li key={index}>
                <PrismicLink field={link}>
                  {(link as { text?: string }).text ?? "Link"}
                </PrismicLink>
              </li>
            ))}
          </ul>
        </nav>
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
      <div className="footer-bottom">
        <p>{slice.primary.copyright_notice}</p>
      </div>
    </footer>
  );
};

export default FooterNavigationAndServicesRegions;
