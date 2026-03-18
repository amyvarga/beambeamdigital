'use client';

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import Accordion from "@/components/Accordion";

export type WhatWeDoCardsProps =
  SliceComponentProps<Content.WhatWeDoSliceSlice>;

const WhatWeDoCards: FC<WhatWeDoCardsProps> = ({ slice }) => {
  const sectionTitle = slice.primary.section_title || "What We Do";
  const featureItems = slice.primary.features || [];

  const items = featureItems.map((item: Content.WhatWeDoSliceSliceDefaultPrimaryFeaturesItem) => ({
    heading: item.feature_title ?? "",
    body: <PrismicRichText field={item.feature_description} />,
  }));

  return (
    <section id="services" className="services section">
      <div className="services-content content">
        <div className="services-title title">
          <h2 className="fade-in">{sectionTitle}</h2>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  );
};

export default WhatWeDoCards;
