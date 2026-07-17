'use client';

import { useState, useRef } from 'react';
import type * as prismic from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';

interface ProductCardProps {
  title: string | null;
  briefDescription: prismic.RichTextField;
  ctaText: string | null;
  details: prismic.RichTextField;
  HeadingTag: 'h2' | 'h3';
  cta_text: string | null;
  cta_link: prismic.LinkField | null;
}

export default function ProductCard({ title, briefDescription, ctaText, details, HeadingTag, cta_text, cta_link }: ProductCardProps) {
  const [pane, setPane] = useState<0 | 1>(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const pane0WrapperRef = useRef<HTMLDivElement>(null);
  const pane1WrapperRef = useRef<HTMLDivElement>(null);

  const scrollToCard = (expandingWrapper: HTMLDivElement | null) => {
    if (!expandingWrapper) return;
    const onEnd = () => {
      const el = cardRef.current;
      if (!el) return;
      const hero = document.querySelector('.hero-section') as HTMLElement;
      const offset = hero ? hero.offsetHeight + 20 : 150;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      expandingWrapper.removeEventListener('transitionend', onEnd);
    };
    expandingWrapper.addEventListener('transitionend', onEnd);
  };

  const goToDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    setPane(1);
    scrollToCard(pane1WrapperRef.current);
  };

  const goToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    setPane(0);
    scrollToCard(pane0WrapperRef.current);
  };

  return (
    <div className="product-item" ref={cardRef}>
      {title && <div className="product-item-title bg-(--color-6) p-(--gap)"><HeadingTag className="text-(--color-5) !mb-0">{title}</HeadingTag></div>}
      <div ref={pane0WrapperRef} className={`product-item-pane-wrapper${pane !== 0 ? ' product-item-pane-wrapper--collapsed' : ''}`}>
        <div className="product-item-pane">
          <div className="product-item-pane-inner pricing">
            <PrismicRichText field={briefDescription} />
            {ctaText && (
              <p className="callToActionLink">
                <a href="#" data-replace={ctaText} onClick={goToDetails}>
                  <span>{ctaText}</span>
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
      <div ref={pane1WrapperRef} className={`product-item-pane-wrapper${pane !== 1 ? ' product-item-pane-wrapper--collapsed' : ''}`}>
        <div className="product-item-pane">
          <div className="product-item-pane-inner includes">
            <PrismicRichText field={details} />
            <p className="callToActionLink">
              <a href="#" data-replace="View Pricing" onClick={goToPricing}>
                <span>View Pricing</span>
              </a>
            </p>
          </div>
        </div>
      </div>
      {cta_text && cta_link && (
        <div className="flex justify-center mb-[calc(var(--gap)/2)] min-[1135px]:mb-(--gap)">
          <PrismicNextLink field={cta_link} className="btn bg-(--color-2) !text-(--color-5)">
            {cta_text}
          </PrismicNextLink>
        </div>
      )}
    </div>
  );
}
