'use client';

import { FC } from "react";
import { Content, asLink } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import Accordion from "@/components/Accordion";

export type WhatWeDoCardsProps =
  SliceComponentProps<Content.WhatWeDoSliceSlice>;

const WhatWeDoCards: FC<WhatWeDoCardsProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  const Title = ctx?.isPage ? "h1" : "h2";
  const sectionTitle = slice.primary.section_title || "What We Do";
  const featureItems = slice.primary.features || [];

  const items = featureItems.map((item: Content.WhatWeDoSliceSliceDefaultPrimaryFeaturesItem) => ({
    heading: item.feature_title ?? "",
    body: <PrismicRichText field={item.feature_description} />,
    ctaLabel: item.service_cta_button_label ?? undefined,
    ctaLink: asLink(item.service_cta_button_link) ?? undefined,
  }));

  return (
    <section id="services" className="services section">
      <div className="services-content content">
        <div className="services-title title">
          <Title className="fade-in">{sectionTitle}</Title>
        </div>
        <Accordion items={items} />
        {slice.primary.cta_button_label && (
          <p className="about-cta">
            <PrismicLink field={slice.primary.cta_button_link} className="btn btn-primary">
              {slice.primary.cta_button_label}
            </PrismicLink>
          </p>
        )}
      </div>
    </section>
  );
};

export default WhatWeDoCards;
