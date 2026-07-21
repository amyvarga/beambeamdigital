import type * as prismic from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';

interface ProductCardProps {
  title: string | null;
  briefDescription: prismic.RichTextField;
  HeadingTag: 'h2' | 'h3';
  cta_text: string | null;
  cta_link: prismic.LinkField | null;
}

export default function ProductCard({ title, briefDescription, HeadingTag, cta_text, cta_link }: ProductCardProps) {
  return (
    <div className="product-item">
      {title && <div className="product-item-title bg-(--color-6) p-(--gap)"><HeadingTag className="text-(--color-5) !mb-0">{title}</HeadingTag></div>}
      <div className="product-item-content pricing">
        <PrismicRichText field={briefDescription} />
      </div>
      {cta_text && cta_link && (
        <div className="flex justify-center mb-[calc(var(--gap)/2)] min-[1135px]:mb-(--gap)">
          <PrismicNextLink field={cta_link} className="btn after:content-['→'] after:transition-transform hover:after:translate-x-4">
            {cta_text}
          </PrismicNextLink>
        </div>
      )}
    </div>
  );
}
