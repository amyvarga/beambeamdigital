'use client';

import { useEffect } from 'react';
const bottomMargin = typeof window !== 'undefined' && window.innerHeight < 700 ? '0px' : '-50px';
const observerOptions = {
        root: null,
        rootMargin: `0px 0px ${bottomMargin} 0px`,
        threshold: 0.1
    };

export default function FadeInObserver() {
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions
    )

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el) => observer.observe(el));

    // Cleanup
    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
}