'use client';

import { ReactNode, useState } from "react";

interface AccordionItem {
  heading: string;
  body: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex(prev => (prev === index ? null : index));

  return (
    <div className="accordion fade-in">
      {items.map((item, index) => (
        <div
          key={index}
          className={`accordion-item${openIndex === index ? ' accordion--visible' : ''}`}
        >
          <div className="accordion-heading" onClick={() => toggle(index)}>
            {item.heading}
          </div>
          <div className="accordion-body">{item.body}</div>
        </div>
      ))}
    </div>
  );
}
