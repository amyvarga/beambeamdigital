"use client";

import { FC } from "react";
import { Content, asLink } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import MasonryGallery from "@/components/MasonryGallery";

export type AboutSectionProps = SliceComponentProps<Content.AboutSectionSlice>;

const AboutSection: FC<AboutSectionProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  const Title = ctx?.isPage ? "h1" : "h2";
  const p = slice.primary as Record<string, unknown>;

  const masonryImages = (slice.primary.masonry_gallery ?? []).map((item) => {
    if (!item.image?.url) return null;
    return {
      src: item.image.url,
      alt: item.image.alt ?? "",
      href: asLink(item.link) ?? undefined,
      title: item.image.alt ?? "",
      columns: item.columns ?? 1,
    };
  }).filter(Boolean) as { src: string; alt: string; href?: string; title?: string; columns?: number }[];

  const cta_text = p.cta_text as string | undefined;
  const cta_button_label = p.cta_button_label as string | undefined;
  const cta_button_link = p.cta_button_link as Parameters<typeof PrismicLink>[0]["field"] | undefined;

  return (
    <section id="about" className="about section">
      <div className="about-content content">
        {slice.primary.heading && (
          <div className="about-title title">
            <Title className="fade-in">{slice.primary.heading}</Title>
          </div>
        )}
        <div className="about-grid">
          <div className="about-image">
            {slice.primary.about_image?.url ? (
              <PrismicNextImage
                field={slice.primary.about_image}
                className="fade-in"
                alt=""
              />
            ) : (
              <div className="placeholder-image fade-in">
                <span className="placeholder-text">Profile Image</span>
              </div>
            )}
          </div>
          <div className="about-text fade-in">
            <PrismicRichText field={slice.primary.body_paragraph_one} />
          </div>
          <MasonryGallery images={masonryImages} title={slice.primary.masonry_title ?? undefined} />
          <div className="about-text fade-in">
            <PrismicRichText field={slice.primary.body_paragraph_two} />
            <PrismicRichText field={slice.primary.body_paragraph_three} />
            {(cta_text?.trim() || cta_button_label) && (
              <p className="callToAction">
                {cta_text?.trim() && cta_text}
                {cta_button_label && (
                  <PrismicLink field={cta_button_link} className="btn btn-primary">
                    {cta_button_label}
                  </PrismicLink>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
