"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import MasonryGallery from "@/components/MasonryGallery";

const masonryImages = [
    { src: "/images/corporate-logos/DULUX_RGB_imp_05.png", alt: "Dulux logo" },
  { src: "/images/corporate-logos/bl-logo.jpg", alt: "British Library logo" },
  { src: "/images/corporate-logos/clipper_teas_logo.jpg", alt: "Clipper Teas logo" },
  { src: "/images/corporate-logos/tkmaxx_logo.jpg", alt: "TK Maxx logo" },
  { src: "/images/corporate-logos/dorset-cereals.jpg", alt: "Dorset Cereals logo" },
  { src: "/images/corporate-logos/rocklands_boulders.gif", alt: "" },
  { src: "/images/corporate-logos/virgin-media-logo.jpg", alt: "Virgin Media logo" },
    { src: "/images/corporate-logos/tangozebra.png", alt: "Tangozebra logo" },
  { src: "/images/corporate-logos/channel 4.jpg", alt: "Channel 4" },
  { src: "/images/corporate-logos/odg-logo.gif", alt: "" },
  { src: "/images/corporate-logos/Three_UK-Logo.png", alt: "Three UK logo" },
  { src: "/images/corporate-logos/The-Sun-Logo.jpg", alt: "The Sun logo" }

];

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
            {(slice.primary.cta_text?.trim() || slice.primary.cta_button_label) && (
              <p className="about-cta">
                {slice.primary.cta_text?.trim() && slice.primary.cta_text}
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
        <MasonryGallery images={masonryImages} />
      </div>
    </section>
  );
};

export default AboutSection;
