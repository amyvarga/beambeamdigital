'use client';

import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { cancelElementScroll, scrollElementToTop } from '@/lib/scrollToElement';

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
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const positionLockFrame = useRef<number | null>(null);
  const accordionId = useId();

  const stopPositionLock = () => {
    if (positionLockFrame.current !== null) {
      cancelAnimationFrame(positionLockFrame.current);
      positionLockFrame.current = null;
    }
  };

  const holdItemInPlace = (index: number) => {
    stopPositionLock();

    const item = itemRefs.current[index];
    if (!item) return;

    const scrollMarginTop = Number.parseFloat(
      window.getComputedStyle(item).scrollMarginTop,
    ) || 0;
    const lockedTop = item.getBoundingClientRect().top;

    if (lockedTop < scrollMarginTop) return;

    let startedAt: number | null = null;
    const maintainPosition = (time: number) => {
      startedAt ??= time;
      const currentItem = itemRefs.current[index];
      if (!currentItem) {
        positionLockFrame.current = null;
        return;
      }

      const movement = currentItem.getBoundingClientRect().top - lockedTop;
      if (Math.abs(movement) > 0.5) {
        window.scrollBy(0, movement);
      }

      if (time - startedAt < 600) {
        positionLockFrame.current = requestAnimationFrame(maintainPosition);
      } else {
        positionLockFrame.current = null;
      }
    };

    positionLockFrame.current = requestAnimationFrame(maintainPosition);
  };

  useEffect(() => () => {
    stopPositionLock();
    cancelElementScroll();
  }, []);

  const toggle = (index: number) => {
    const isOpening = openIndex !== index;
    cancelElementScroll();

    if (isOpening && openIndex !== null) {
      holdItemInPlace(index);
    } else {
      stopPositionLock();
    }

    if (typeof window !== "undefined" && "gtag" in window) {
      (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", isOpening ? "accordion_open" : "accordion_close", {
        accordion_heading: items[index].heading,
      });
    }

    setOpenIndex(isOpening ? index : null);
  };

  const scrollOpenedItemIntoView = (index: number) => {
    const item = itemRefs.current[index];
    if (!item) return;

    scrollElementToTop(item);
  };

  return (
    <div className="container mx-auto">
      <div className="overflow-hidden">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const triggerId = `${accordionId}-trigger-${index}`;
          const panelId = `${accordionId}-panel-${index}`;
          return (
            <div
              key={index}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              className="accordion-section first:border-t-[0.5px] border-[var(--color-2)] [scroll-margin-top:var(--scroll-margin-top)]"
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
                min-1500px:p[var(--gap)]
                border-b-[0.5px] border-[var(--color-2)]
                text-left
                cursor-pointer
                [transition:var(--transition)]
                "
              >
                <div className={`min-w-0 [transition:var(--transition)] ${isOpen ? 'font-semibold' : ''}`}>
                  <h3 className="m-0">{item.heading}</h3>
                </div>
                <div className={`
                  flex h-8 w-8 
                  items-center justify-center
                  justify-self-end
                  rounded-full
                  border border border-[var(--color-5)]
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
                onTransitionEnd={(event) => {
                  if (
                    isOpen &&
                    event.target === event.currentTarget &&
                    event.propertyName === 'grid-template-rows'
                  ) {
                    stopPositionLock();
                    scrollOpenedItemIntoView(index);
                  }
                }}
                className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="min-h-0 overflow-hidden">
                  {item.body}
                  {item.ctaLabel && item.ctaLink && (
                    <p className="callToActionLink mr-[1em]">
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
