import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

/**
 * Props for `WhatWeDoCards`.
 */
export type WhatWeDoCardsProps =
  SliceComponentProps<Content.WhatWeDoSliceSlice>;

/**
 * Component for "What We Do Cards" Slices.
 */
const WhatWeDoCards: FC<WhatWeDoCardsProps> = ({ slice }) => {
  const sectionTitle = slice.primary.section_title || "What We Do";
  const featureItems = slice.primary.features || [];
  return (
    <section id="services" className="services section">
      <div className="services-content content">
        <div className="services-title title">
          <h2 className="fade-in">
            {sectionTitle}
          </h2>
        </div>
        <div className="services-grid">
        {featureItems.length > 0 ? (featureItems.map((item: Content.WhatWeDoSliceSliceDefaultPrimaryFeaturesItem, index: number) => (
          <div key={index} className="service-card fade-in" style={{ '--delay': '0.1s' } as React.CSSProperties}>
            <div className="service-card-border">
              <h3>{asText(item.feature_title)}</h3>
              <div><PrismicRichText field={item.feature_description} /></div>
            </div>
            </div>
          ))
         ) : (
          <> 
          <div className="service-card fade-in">
            <div className="service-card-border">
              <h3>Create websites and an online presence</h3>
              <p>Grow your business using the power of digital marketing.</p>
              <ul>
                <li>Beautiful, engaging websites & social media</li>
                <li>Search Engine Optimised so you are found</li>
                <li>Functionality that promotes online monetisation </li>
              </ul>
            </div>
          </div>
          <div className="service-card fade-in">
              <div className="service-card-border">
                <h3>Automate tasks and worflows</h3>
                <p>Benefit from technology that automates mundane and repetitive tasks.</p>
                <ul>
                    <li>Save time</li>
                    <li>Improve accuracy</li>
                    <li>Automate synchronisation of data across multiple platforms</li>
                </ul>
              </div>
            </div>
            <div className="service-card fade-in">
              <div className="service-card-border">
                <h3>Seamlessly integrate AI into workflows</h3>
                <p>Let Artifical Intelligence make your life easier allowing you to focus your efforts on what you do best.</p>
                <ul>
                    <li>Quickly gather data and information</li>
                    <li>Improve the quality and accuracy of data</li>
                    <li>Increase your data coverage</li>
                    <li>Increase overall productivity</li>
                </ul> 
              </div>
            </div>
            </>
          )}
      </div>
      </div>
      </section>
  );
};

export default WhatWeDoCards;
