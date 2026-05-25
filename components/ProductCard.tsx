'use client';

import { useState, useRef } from 'react';
import type * as prismic from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';

interface ProductCardProps {
  title: string | null;
  briefDescription: prismic.RichTextField;
  ctaText: string | null;
  details: prismic.RichTextField;
  HeadingTag: 'h2' | 'h3';
}

export default function ProductCard({ title, briefDescription, ctaText, details, HeadingTag }: ProductCardProps) {
  const [pane, setPane] = useState<0 | 1>(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const pane0WrapperRef = useRef<HTMLDivElement>(null);
  const pane1WrapperRef = useRef<HTMLDivElement>(null);

  const scrollToCard = (expandingWrapper: HTMLDivElement | null) => {
    if (!expandingWrapper) return;
    const onEnd = () => {
      const el = cardRef.current;
      if (!el) return;
      const nav = document.querySelector('.nav') as HTMLElement;
      const offset = nav ? nav.offsetHeight + 20 : 150;
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
      {title && <div className="product-item-title"><HeadingTag>{title}</HeadingTag></div>}
      <div ref={pane0WrapperRef} className={`product-item-pane-wrapper${pane !== 0 ? ' product-item-pane-wrapper--collapsed' : ''}`}>
        <div className="product-item-pane">
          <div className="product-item-pane-inner">
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
          <div className="product-item-pane-inner">
            <PrismicRichText field={details} />
            <p className="callToActionLink">
              <a href="#" data-replace="View Pricing" onClick={goToPricing}>
                <span>View Pricing</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
