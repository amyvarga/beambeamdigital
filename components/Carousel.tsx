'use client';

import { useRef, useState, useEffect, ReactNode } from "react";

interface CarouselProps {
  children: ReactNode[];
  interval?: number;
}

export default function Carousel({ children, interval = 4000 }: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = children.length;

  function goTo(index: number) {
    const next = (index + count) % count;
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.children[next] as HTMLElement;
    carousel.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setCurrent(next);
  }

  function handleScroll() {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const index = Math.round(carousel.scrollLeft / carousel.offsetWidth);
    if (index !== current) setCurrent(index);
  }

  useEffect(() => {
    if (paused || interval === 0) return;
    const timer = setInterval(() => {
      setCurrent(prev => {
        const next = (prev + 1) % count;
        const carousel = carouselRef.current;
        if (carousel) {
          const card = carousel.children[next] as HTMLElement;
          carousel.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [paused, count, interval]);

  return (
    <div
      className="carousel-wrapper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        className="carousel-btn carousel-btn--prev"
        aria-label="Previous"
        onClick={() => goTo(current - 1)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div
        className="carousel"
        ref={carouselRef}
        onScroll={handleScroll}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") goTo(current - 1);
          if (e.key === "ArrowRight") goTo(current + 1);
        }}
      >
        {children}
      </div>

      <button
        className="carousel-btn carousel-btn--next"
        aria-label="Next"
        onClick={() => goTo(current + 1)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="carousel-dots">
        {children.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? " active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
