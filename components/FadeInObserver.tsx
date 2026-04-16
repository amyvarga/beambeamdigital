'use client';

import { useEffect } from 'react';

export default function FadeInObserver() {

  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');

    // On small screens, skip the fade-in and make everything visible immediately
    if (window.innerWidth <= 768) {
      fadeElements.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions
    );

    fadeElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}