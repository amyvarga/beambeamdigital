'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FadeInObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in:not(.visible)');

    if (window.innerWidth <= 768) {
      fadeElements.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
    );

    fadeElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
