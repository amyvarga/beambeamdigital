import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

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
          {[1, 2, 3, 4, 5].map((n) => {
            const p = slice.primary as Record<string, unknown>;
            const title = p[`pricing_package_${n}_title`] as string | undefined;
            const description = p[`pricing_package_${n}_description`] as Parameters<typeof PrismicRichText>[0]["field"];
            const inlineLink = p[`pricing_package_${n}_inline_link`] as string | undefined;
            return (
              <div key={n} className="pricing-package fade-in" id={inlineLink ? inlineLink.replace("#", "") : undefined}>
                <h3>{title}</h3>
                <PrismicRichText field={description} />
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
};

export default ContentHeader;
