'use client';

import { ReactNode, useId, useState } from "react";
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
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const accordionId = useId();

  const toggle = (index: number) => {
    const isOpening = !openIndices.has(index);
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", isOpening ? "accordion_open" : "accordion_close", {
        accordion_heading: items[index].heading,
      });
    }

    setOpenIndices((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="container mx-auto">
      <div className="rounded-[var(--btn-radius)] overflow-hidden">
        {items.map((item, index) => {
          const isOpen = openIndices.has(index);
          const triggerId = `${accordionId}-trigger-${index}`;
          const panelId = `${accordionId}-panel-${index}`;
          return (
            <div
              key={index}
              className="accordion-section not-last:border-b-[0.5px] border-[var(--color-5)] [scroll-margin-top:var(--scroll-margin-top)]"
            >
              <button
                id={triggerId}
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="
                grid w-full
                grid-cols-[minmax(0,1fr)_2rem]
                items-center
                gap-[var(--gap)]
                bg-[var(--color-2)]
                px-[calc(var(--gap)/2)]
                min-1500px:p[var(--gap)]
                text-left
                cursor-pointer
                [transition:var(--transition)]
                "
              >
                <div className={`min-w-0 text-[var(--color-5)] [transition:var(--transition)] ${isOpen ? 'font-semibold' : ''}`}>
                  <h3 className="m-0 font-[family-name:var(--font-cormorant-garamond)]!">{item.heading}</h3>
                </div>
                <div className={`
                  flex h-8 w-8 
                  items-center justify-center
                  justify-self-end
                  rounded-full
                  border border border-[var(--color-5)] 
                  text-[var(--color-5)]
                  transform 
                  [transition:var(--transition)] 
                  ${isOpen ? '-rotate-180' : ''}`}>
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!isOpen}
                className={`bg-[var(--color-5)] overflow-hidden [transition:max-height_var(--transition)] ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
              >
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
