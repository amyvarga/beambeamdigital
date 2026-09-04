import type * as prismic from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';

interface ProductCardProps {
  title: string;
  briefDescription: prismic.RichTextField;
  cta_text: string | null;
  cta_link: prismic.LinkField | null;
}

export default function ProductCard({
  title,
  briefDescription,
  cta_text,
  cta_link,
}: ProductCardProps) {
  return (
    <details className="product-item">
      <summary className="product-accordion-trigger">
        <h3 className="product-accordion-title">{title}</h3>
      </summary>
      <div className="product-accordion-panel">
        <div className="product-item-content pricing">
          <PrismicRichText field={briefDescription} />
          {cta_text && cta_link && (
            <div className="product-accordion-cta">
              <PrismicNextLink field={cta_link} className="">
                {cta_text}
              </PrismicNextLink>
            </div>
          )}
        </div>
      </div>
    </details>
  );
}
