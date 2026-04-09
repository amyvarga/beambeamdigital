'use client';

import { useEffect } from 'react';

export default function MobileNavObserver() {
  useEffect(() => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector<HTMLElement>('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    function openMobileNav() {
      navMenu!.classList.add('active');
      navMenu!.removeAttribute('aria-hidden');
      navToggle!.classList.add('active');
      navToggle!.setAttribute('aria-expanded', 'true');
    }

    function closeMobileNav() {
      navMenu!.classList.remove('active');
      navMenu!.setAttribute('aria-hidden', 'true');
      navToggle!.classList.remove('active');
      navToggle!.setAttribute('aria-expanded', 'false');
    }

    function toggleMobileNav() {
      if (navMenu!.classList.contains('active')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
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

    function handleNavLinkClick(e: Event) {
      if (window.innerWidth >= 900) return;
      const link = e.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute('href');
      if (!href) return;
      const hash = href.includes('#') ? '#' + href.split('#')[1] : null;
      if (!hash) return;
      e.preventDefault();
      closeMobileNav();
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }

    navToggle.addEventListener('click', toggleMobileNav);
    navLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      navToggle.removeEventListener('click', toggleMobileNav);
      navLinks.forEach(link => link.removeEventListener('click', handleNavLinkClick));
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
