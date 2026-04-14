'use client';

import { ReactNode, useState, useRef } from "react";

interface AccordionItem {
  heading: string;
  body: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(prev => (prev === index ? null : index));
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", isOpening ? "accordion_open" : "accordion_close", {
        accordion_heading: items[index].heading,
      });
    }
    if (isOpening) {
      setTimeout(() => {
        itemRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 1000);
    }
  };

  return (
    <div className="accordion fade-in">
      {items.map((item, index) => (
        <div
          key={index}
          ref={el => { itemRefs.current[index] = el; }}
          className={`accordion-item${openIndex === index ? ' accordion--visible' : ''}`}
        >
          <h2 className="accordion-heading" onClick={() => toggle(index)}>
            {item.heading}
          </h2>
          <div className="accordion-body">{item.body}</div>
        </div>
      ))}
    </div>
  );
}
