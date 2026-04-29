import { FC } from "react";
import { Content, asText, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";

/**
 * Props for `ContentHeader`.
 */
export type ContentHeaderProps =
  SliceComponentProps<Content.ContentHeaderSlice>;

/**
 * Component for "ContentHeader" Slices.
 */
const ContentHeader: FC<ContentHeaderProps> = ({ slice, context }) => {
  const ctx = context as { isPage?: boolean } | undefined;
  const Title = ctx?.isPage ? "h1" : "h2";
  return (
    <section
      id="pricing"
      className="pricing section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="pricing-content content fade-in">
        <div className="pricing-title title">
          <Title className="fade-in">{asText(slice.primary.title)}</Title>
        </div>
        <div className="pricing-packages">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => {
            const p = slice.primary as Record<string, unknown>;
            const title = p[`pricing_package_${n}_title`] as string | undefined;
            const description = p[`pricing_package_${n}_description`] as Parameters<typeof PrismicRichText>[0]["field"];
            const inlineLinkRaw = p[`pricing_package_${n}_inline_link`];
            const inlineLink = typeof inlineLinkRaw === "string" ? inlineLinkRaw : undefined;
            const link = p[`pricing_package_${n}_link`] as (Parameters<typeof PrismicLink>[0]["field"] & { text?: string }) | undefined;
            return (
              <div key={n} className="pricing-package fade-in" id={inlineLink ? inlineLink.replace("#", "") : undefined}>
                <h2>{title}</h2>
                <PrismicRichText field={description} />
                <p className="callToActionLink">
                  {isFilled.link(link) && <PrismicLink field={link} data-replace={link.text} className=""><span>{link.text}</span></PrismicLink>}
            
                </p>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
};

export default ContentHeader;
