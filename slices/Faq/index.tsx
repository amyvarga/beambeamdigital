"use client";

import { FC } from "react";
import { Content, asLink, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import Accordion from "@/components/Accordion";
import { absoluteUrl, serializeJsonLd } from "@/lib/jsonLd";

export type FaqProps = SliceComponentProps<Content.FaqSlice>;

const Faq: FC<FaqProps> = ({ slice, context }) => {
  const ctx = context as { schemaPath?: string } | undefined;
  const pageUrl = ctx?.schemaPath ? absoluteUrl(ctx.schemaPath) : undefined;
  const faqItems = (slice.primary.faq ?? []).filter(
    (item) => item.faq_title?.trim() && asText(item.faq_description).trim(),
  );
  const items = faqItems.map((item) => ({
    heading: item.faq_title ?? "",
    body: <PrismicRichText field={item.faq_description} />,
    ctaLabel: item.cta_label ?? undefined,
    ctaLink: asLink(item.cta_link) ?? undefined,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": pageUrl ? `${pageUrl}#faq` : undefined,
    url: pageUrl,
    isPartOf: pageUrl ? { "@id": `${pageUrl}#webpage` } : undefined,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.faq_title ?? "",
      acceptedAnswer: {
        "@type": "Answer",
        text: asText(item.faq_description),
      },
    })),
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="faq section"
    >
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      )}
      <div className="faq-content">
        {slice.primary.faq_heading && (
          <div className="faq-title">
            <h2 className="fade-in">{slice.primary.faq_heading}</h2>
          </div>
        )}
        <Accordion items={items} />
      </div>
    </section>
  );
};

export default Faq;
