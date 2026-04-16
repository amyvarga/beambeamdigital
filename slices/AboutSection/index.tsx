"use client";

import { FC } from "react";
import { Content, asLink } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import MasonryGallery from "@/components/MasonryGallery";

/**
 * Props for `AboutSection`.
 */
export type AboutSectionProps = SliceComponentProps<Content.AboutSectionSlice>;

/**
 * Component for "About Section" Slices.
 */
const AboutSection: FC<AboutSectionProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  const Title = ctx?.isPage ? "h1" : "h2";
  const profileHeading = slice.primary.heading || null;
  const hasImage = slice.primary.profile_image?.url;

  const masonryImages = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const p = slice.primary as Record<string, unknown>;
    const image = p[`masonry_gallery_${n}`] as { url?: string; alt?: string } | undefined;
    const link = p[`masonry_gallery_${n}_link`] as Parameters<typeof asLink>[0] | undefined;
    const columns = p[`masonry_gallery_${n}_width`] as number | undefined;
    if (!image?.url) return null;
    return {
      src: image.url,
      alt: image.alt ?? "",
      href: asLink(link) ?? undefined,
      title: image.alt ?? "",
      columns: columns ?? 1,
    };
  }).filter(Boolean) as { src: string; alt: string; href?: string; title?: string; columns?: number }[];

  return (
    <section id="about" className="about section">
      <div className="about-content content">
        {profileHeading && (
          <div className="about-title title">
            <Title className="fade-in">{profileHeading}</Title>
          </div>
        )}
        <div className="about-grid">
          <div className="about-image">
            {hasImage ? (
              <PrismicNextImage
                field={slice.primary.profile_image}
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
            {(slice.primary.cta_text?.trim() || slice.primary.cta_button_label) && (
              <p className="callToAction">
                {slice.primary.cta_text?.trim() && slice.primary.cta_text}
                {slice.primary.cta_button_label && (
                  <PrismicLink field={slice.primary.cta_button_link} className="btn btn-primary">
                    {slice.primary.cta_button_label}
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
