'use client';

import { ReactNode, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface AccordionItem {
  heading: string;
  body: ReactNode;
  ctaLabel?: string;
  ctaLink?: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (index: number) => {
    const isOpening = openIndex !== index;
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", isOpening ? "accordion_open" : "accordion_close", {
        accordion_heading: items[index].heading,
      });
    }

    const scrollToItem = (i: number) => {
      const el = itemRefs.current[i];
      if (!el) return;
      const hero = document.querySelector('.hero-section') as HTMLElement;
      const offset = hero ? hero.offsetHeight + 20 : 150;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    if (isOpening && openIndex !== null) {
      // Close current item, wait for collapse, scroll new item into view, then open it
      setOpenIndex(null);
      setTimeout(() => {
        scrollToItem(index);
        setTimeout(() => {
          setOpenIndex(index);
        }, 400);
      }, 500);
    } else {
      setOpenIndex(prev => (prev === index ? null : index));
    }
  };

  return (
    <div className="container mx-auto">
      <div className="rounded-[var(--btn-radius)] overflow-hidden">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              ref={(el) => { itemRefs.current[index] = el; }}
              className="accordion-section not-last:border-b-[0.5px] border-[var(--color-5)] [scroll-margin-top:var(--scroll-margin-top)]"
            >
              <div
                onClick={() => toggle(index)}
                className="bg-[var(--color-2)] flex justify-between p-[calc(var(--gap)/2)] min-[1135px]:p-[var(--gap)] items-center [transition:var(--transition)] cursor-pointer pr-10 relative"
              >
                <div className={`text-[var(--color-5)] [transition:var(--transition)] ${isOpen ? 'font-semibold' : ''}`}>
                  <h3 className="font-[family-name:var(--font-cormorant-garamond)]!">{item.heading}</h3>
                </div>
                <div className={`h-8 w-8 border border-[var(--color-5)] rounded-full items-center inline-flex justify-center transform [transition:var(--transition)] text-[var(--color-5)] absolute top-0 right-0 mb-auto ml-auto mt-[calc(var(--gap)/2)] min-[1135px]:mt-[var(--gap)] mr-[calc(var(--gap)/2)] min-[1135px]:mr-[var(--gap)] ${isOpen ? '-rotate-180' : ''}`}>
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
              </div>
              <div className={`bg-[var(--color-5)] overflow-hidden [transition:max-height_var(--transition)] ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className={`p-[calc(var(--gap)/2)] min-[1135px]:p-[var(--gap)]`}>
                  {item.body}
                  {item.ctaLabel && item.ctaLink && (
                    <p className="callToActionLink text-right mr-[1em]">
                      <a href={item.ctaLink} data-replace={item.ctaLabel}><span>{item.ctaLabel}</span></a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
