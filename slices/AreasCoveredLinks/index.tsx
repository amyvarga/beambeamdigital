import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicLink } from "@prismicio/react";

export type AreasCoveredLinksProps = SliceComponentProps<Content.AreasCoveredLinksSlice>;

type RegionLink = {
  link_type: string;
  url?: string;
  text?: string;
};

const AreasCoveredLinks: FC<AreasCoveredLinksProps> = ({ slice }) => {
  const primary = slice.primary as {
    heading?: string;
    services_regions?: { service_title?: string; service_region?: unknown }[];
  };
  const servicesRegions = primary.services_regions ?? [];
  const fallbackRegions = (servicesRegions[0]?.service_region as unknown as RegionLink[]) ?? [];

  return (
    <section className="areas-covered section">
      <div className="areas-covered-content content">
        {primary.heading && (
          <div className="areas-covered-title title">
            <h1 className="fade-in">{primary.heading}</h1>
          </div>
        )}
        <div className="areas-covered-grid fade-in">
          {servicesRegions.map((group, index) => {
            const ownRegions = (group.service_region as unknown as RegionLink[]) ?? [];
            const regions = ownRegions.length > 0 ? ownRegions : fallbackRegions;
            return (
              <div key={index} className="areas-covered-group">
                {group.service_title && <h2>{group.service_title}</h2>}
                <ul>
                  {regions.map((region, i) => (
                    isFilled.link(region as Parameters<typeof isFilled.link>[0]) && (
                      <li key={i}>
                        <PrismicLink field={region as Parameters<typeof PrismicLink>[0]["field"]}>
                          {region.text || region.url}
                        </PrismicLink>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AreasCoveredLinks;
