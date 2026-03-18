'use client';

import { useEffect } from 'react';

export default function MobileNavObserver() {
  useEffect(() => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    function toggleMobileNav() {
      const isOpen = navMenu!.classList.toggle('active');
      navToggle!.classList.toggle('active');
      navToggle!.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMobileNav() {
      navMenu!.classList.remove('active');
      navToggle!.classList.remove('active');
      navToggle!.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function handleOutsideClick(e: MouseEvent) {
      if (
        navMenu!.classList.contains('active') &&
        !navMenu!.contains(e.target as Node) &&
        !navToggle!.contains(e.target as Node)
      ) {
        closeMobileNav();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && navMenu!.classList.contains('active')) {
        closeMobileNav();
      }
    }

    function updateScrollPadding() {
      const nav = document.querySelector('.nav');
      if (!nav) return;
      if (window.innerWidth >= 900) {
        document.documentElement.style.scrollPaddingTop = '0px';
      } else {
        const navHeight = nav.getBoundingClientRect().height;
        document.documentElement.style.scrollPaddingTop = `${navHeight}px`;
      }
    }

    updateScrollPadding();
    window.addEventListener('resize', updateScrollPadding);

    navToggle.addEventListener('click', toggleMobileNav);
    navLinks.forEach(link => link.addEventListener('click', closeMobileNav));
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updateScrollPadding);
      navToggle.removeEventListener('click', toggleMobileNav);
      navLinks.forEach(link => link.removeEventListener('click', closeMobileNav));
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
