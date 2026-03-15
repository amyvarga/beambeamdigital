"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

/**
 * Props for `AboutSection`.
 */
export type AboutSectionProps = SliceComponentProps<Content.AboutSectionSlice>;

/**
 * Component for "About Section" Slices.
 */
const AboutSection: FC<AboutSectionProps> = ({ slice }) => {
  const profileHeading = slice.primary.heading || "About me";
  const hasImage = slice.primary.profile_image?.url;

  return (
    <section id="about" className="about section">
      <div className="about-content content">
        <div className="about-title title">
          <h2 className="fade-in">{profileHeading}</h2>
        </div>
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
            <PrismicRichText field={slice.primary.body} />
            {slice.primary.cta_text && (
              <p className="about-cta">
                {slice.primary.cta_text}
                {slice.primary.cta_button_label && (
                  <PrismicLink
                    field={slice.primary.cta_button_link}
                    className="btn btn-primary"
                  >
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
